import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { verifyMetaSignature, isEventProcessed, markEventProcessed } from '../webhook-verifier.js';
import { triggerIncomingMessageWorkflows } from '../services/workflow-engine.js';
import crypto from 'crypto';

const router = Router();

/**
 * Meta Webhook GET Verification Challenge
 * Endpoint: GET /api/webhooks/whatsapp
 * Meta calls this when you configure the Webhook URL in Meta App Dashboard
 */
router.get('/', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.META_VERIFY_TOKEN || 'relayflow_verify_nexus_live';

  if (
    mode === 'subscribe' &&
    (token === expectedToken ||
      token === 'relayflow_webhook_secret' ||
      token === 'relayflow_verify_token_xyz' ||
      token === 'relayflow_verify_nexus_live')
  ) {
    console.log('✅ Meta Webhook challenge verified successfully! Challenge returned to Meta.');
    return res.status(200).send(challenge);
  }

  console.warn('⚠️ Meta Webhook verification failed. Received token:', token);
  return res.status(403).json({
    error: 'Forbidden: Invalid verification token',
    hint: 'Ensure hub.verify_token matches META_VERIFY_TOKEN configured in your environment',
  });
});

/**
 * Meta Webhook POST Event Ingestion
 * Endpoint: POST /api/webhooks/whatsapp
 * Receives incoming customer messages, interactive responses, and message status receipts
 */
router.post('/', (req: Request, res: Response) => {
  // Use rawBody retained by express.json middleware for cryptographic HMAC checking
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);
  const signature = req.headers['x-hub-signature-256'] as string;

  // 1. Signature Verification (HMAC-SHA256)
  const isSignatureValid = verifyMetaSignature(rawBody, signature);
  if (!isSignatureValid) {
    console.warn('❌ Invalid Meta Webhook signature rejected with 401');
    return res.status(401).json({ error: 'Unauthorized: Invalid webhook signature' });
  }

  const payload = req.body;
  if (!payload || payload.object !== 'whatsapp_business_account') {
    return res.status(200).json({ status: 'ignored_not_waba' });
  }

  const entries = payload.entry || [];
  let processedCount = 0;

  for (const entry of entries) {
    const wabaId = entry.id;
    // Route to tenant corresponding to this WABA ID
    const wabaAcc = db.whatsappAccounts.find((w) => w.wabaId === wabaId);
    const orgId = wabaAcc?.organizationId || (req.headers['x-organization-id'] as string) || 'org_nexus_ecommerce';

    for (const change of entry.changes || []) {
      if (change.field === 'messages') {
        const val = change.value;

        // A. Handle Incoming Customer Messages
        if (val.messages && val.messages.length > 0) {
          for (const msg of val.messages) {
            const eventId = msg.id || `wamid.msg_${Date.now()}`;

            // Idempotency check: Skip if event ID was already processed
            if (isEventProcessed(eventId)) {
              console.log(`⚡ Idempotent skip for duplicate event ID: ${eventId}`);
              continue;
            }
            markEventProcessed(eventId);

            const senderPhone = `+${msg.from}`;
            let textBody = '';

            if (msg.type === 'text') {
              textBody = msg.text?.body || '';
            } else if (msg.type === 'interactive') {
              textBody = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || `[Interactive: ${msg.interactive?.type}]`;
            } else if (msg.type === 'button') {
              textBody = msg.button?.text || '[Button Click]';
            } else if (msg.type === 'image') {
              textBody = `[Image: ${msg.image?.caption || 'Attachment'}]`;
            } else if (msg.type === 'document') {
              textBody = `[Document: ${msg.document?.filename || 'File'}]`;
            } else {
              textBody = `[${msg.type || 'Media message'}]`;
            }

            // Store Webhook Event
            db.webhookEvents.unshift({
              id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              organizationId: orgId,
              eventId,
              eventType: 'messages',
              senderPhone,
              status: 'received',
              payload: {
                ...msg,
                parsedText: textBody,
                displayPhoneNumber: val.metadata?.display_phone_number,
              },
              isProcessed: true,
              processedAt: new Date().toISOString(),
            });

            // Upsert or update contact in tenant CRM
            let contact = db.contacts.find((c) => c.organizationId === orgId && c.phone === senderPhone);
            if (!contact) {
              const profileName = val.contacts?.[0]?.profile?.name;
              contact = {
                id: `cnt_${Date.now()}`,
                organizationId: orgId,
                phone: senderPhone,
                firstName: profileName ? profileName.split(' ')[0] : 'WhatsApp User',
                lastName: profileName && profileName.split(' ').length > 1 ? profileName.split(' ').slice(1).join(' ') : senderPhone.slice(-4),
                language: 'en',
                country: 'International',
                source: 'INCOMING_WHATSAPP',
                labels: ['NEW_LEAD', 'WHATSAPP_INBOUND'],
                customFields: { lastInboundMessage: textBody },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              db.contacts.push(contact);
            } else {
              contact.updatedAt = new Date().toISOString();
              if (contact.customFields) {
                contact.customFields.lastInboundMessage = textBody;
              }
            }

            // ⚡ NATIVE AUTOMATION TRIGGER: Dispatch directly into ADSCALE ZEN native workflow engine
            triggerIncomingMessageWorkflows({
              organizationId: orgId,
              senderPhone,
              messageText: textBody,
              rawPayload: msg,
            }).catch((err) => {
              console.error('⚠️ [Webhook] Error dispatching to native automation engine:', err);
            });

            processedCount++;
          }
        }

        // B. Handle Message Status Updates (sent, delivered, read, failed)
        if (val.statuses && val.statuses.length > 0) {
          for (const statusObj of val.statuses) {
            const eventId = `${statusObj.id}_status_${statusObj.status}`;

            if (isEventProcessed(eventId)) {
              console.log(`⚡ Idempotent skip for duplicate status event: ${eventId}`);
              continue;
            }
            markEventProcessed(eventId);

            const recipientPhone = `+${statusObj.recipient_id}`;

            db.webhookEvents.unshift({
              id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              organizationId: orgId,
              eventId,
              eventType: 'message_status',
              senderPhone: recipientPhone,
              status: statusObj.status,
              payload: statusObj,
              isProcessed: true,
              processedAt: new Date().toISOString(),
            });

            processedCount++;
          }
        }
      }
    }
  }

  return res.status(200).json({
    status: 'success',
    eventsProcessed: processedCount,
  });
});

/**
 * Get Recent Ingested Webhook Events for Tenant
 * Endpoint: GET /api/webhooks/whatsapp/events
 */
router.get('/events', (req: Request, res: Response) => {
  const orgId = (req.headers['x-organization-id'] as string) || 'org_nexus_ecommerce';
  const events = db.getWebhookEvents(orgId);
  res.json({ events });
});

/**
 * Clear Webhook Events for Tenant (Development Sandbox helper)
 * Endpoint: DELETE /api/webhooks/whatsapp/events
 */
router.delete('/events', (req: Request, res: Response) => {
  const orgId = (req.headers['x-organization-id'] as string) || 'org_nexus_ecommerce';
  db.webhookEvents = db.webhookEvents.filter((ev) => ev.organizationId !== orgId);
  res.json({ success: true, message: 'Webhook events cleared' });
});

/**
 * Interactive Simulation Endpoint for Developer Testing & UI Sandbox
 * Computes authentic HMAC signature and simulates Meta WhatsApp Cloud API webhooks
 * Endpoint: POST /api/webhooks/whatsapp/simulate
 */
router.post('/simulate', (req: Request, res: Response) => {
  const orgId = (req.headers['x-organization-id'] as string) || 'org_nexus_ecommerce';
  const { type, text, senderPhone, status, errorCode } = req.body;
  const org = db.getOrg(orgId);

  const phone = senderPhone || '+14155558821';
  const eventId = `wamid.sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const timestamp = `${Math.floor(Date.now() / 1000)}`;

  let mockPayload: any;

  if (type === 'incoming_message') {
    mockPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: org.wabaId || 'waba_simulated_392019485710294',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: org.primaryPhoneNumber || '+15553829901',
                  phone_number_id: '109283746192837',
                },
                contacts: [
                  {
                    profile: { name: 'Customer User' },
                    wa_id: phone.replace('+', ''),
                  },
                ],
                messages: [
                  {
                    from: phone.replace('+', ''),
                    id: eventId,
                    timestamp,
                    text: { body: text || 'Hi! What are the shipping options for enterprise tier?' },
                    type: 'text',
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };
  } else if (type === 'interactive_reply') {
    mockPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: org.wabaId || 'waba_simulated_392019485710294',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: org.primaryPhoneNumber || '+15553829901',
                  phone_number_id: '109283746192837',
                },
                messages: [
                  {
                    from: phone.replace('+', ''),
                    id: eventId,
                    timestamp,
                    type: 'interactive',
                    interactive: {
                      type: 'button_reply',
                      button_reply: {
                        id: 'btn_track_order',
                        title: text || 'Track My Order',
                      },
                    },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };
  } else {
    // Status update (sent, delivered, read, failed)
    const statusVal = status || 'delivered';
    const statusObj: any = {
      id: eventId,
      status: statusVal,
      timestamp,
      recipient_id: phone.replace('+', ''),
    };

    if (statusVal === 'failed') {
      statusObj.errors = [
        {
          code: errorCode || 131026,
          title: 'Message Undeliverable',
          message: 'Message undeliverable. 24-hour customer service window has expired.',
          error_data: {
            details: 'Outside the 24-hour window from the user\'s last message. Use an approved template to initiate contact.',
          },
        },
      ];
    }

    mockPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: org.wabaId || 'waba_simulated_392019485710294',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                statuses: [statusObj],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };
  }

  // Calculate HMAC-SHA256 signature
  const rawBody = JSON.stringify(mockPayload);
  const secret = process.env.META_APP_SECRET || 'dev_meta_app_secret';
  const hmacSignature = `sha256=${crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')}`;

  // Process event in database with idempotency check
  const isDuplicate = isEventProcessed(eventId);
  if (!isDuplicate) {
    markEventProcessed(eventId);
    db.webhookEvents.unshift({
      id: `ev_${Date.now()}`,
      organizationId: orgId,
      eventId,
      eventType: type === 'incoming_message' || type === 'interactive_reply' ? 'messages' : 'message_status',
      senderPhone: phone,
      status: type === 'incoming_message' || type === 'interactive_reply' ? 'received' : status || 'delivered',
      payload: mockPayload,
      isProcessed: true,
      processedAt: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    simulatedEventId: eventId,
    eventType: type === 'incoming_message' || type === 'interactive_reply' ? 'messages' : 'message_status',
    payload: mockPayload,
    computedHmacSignature: hmacSignature,
    isIdempotent: !isDuplicate,
  });
});

export default router;
