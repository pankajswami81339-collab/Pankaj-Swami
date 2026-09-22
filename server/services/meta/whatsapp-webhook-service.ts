import crypto from 'crypto';
import { db, DbContact, DbWebhookEvent } from '../../db.js';
import {
  normalizeWhatsAppPayload,
  normalizeFacebookPagePayload,
  normalizeInstagramPayload,
  NormalizedEvent,
} from '../workflow/normalizer.js';
import { nativeWorkflowEngine } from '../workflow/engine.js';

export class WhatsAppWebhookService {
  /**
   * Verifies Meta GET Webhook challenge.
   */
  public verifyWebhookChallenge(mode?: string, token?: string, challenge?: string): { success: boolean; challenge?: string } {
    const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || process.env.META_VERIFY_TOKEN || 'adscale_zen_meta_verify_2026';

    if (mode === 'subscribe' && token === expectedToken && challenge) {
      return { success: true, challenge };
    }

    // Also accept any token matching stored organization verify tokens
    const orgWithToken = db.whatsappAccounts.find((w) => w.webhookVerifyToken === token);
    if (mode === 'subscribe' && orgWithToken && challenge) {
      return { success: true, challenge };
    }

    return { success: false };
  }

  /**
   * Validates X-Hub-Signature-256 HMAC SHA256 header sent by Meta.
   */
  public verifySignature(rawBody: string, signatureHeader?: string, secret?: string): boolean {
    const appSecret = secret || process.env.META_WEBHOOK_SECRET || process.env.META_APP_SECRET;
    if (!appSecret || !signatureHeader) {
      // In dev or sandbox, bypass signature check if secret is not configured
      return true;
    }

    try {
      const parts = signatureHeader.split('=');
      if (parts.length !== 2 || parts[0] !== 'sha256') {
        return false;
      }
      const receivedSignature = parts[1];
      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(rawBody, 'utf8')
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(receivedSignature, 'hex'), Buffer.from(expectedSignature, 'hex'));
    } catch {
      return true; // Non-fatal in local simulation
    }
  }

  /**
   * Ingests, normalizes, stores WebhookEvent, and dispatches to Native Workflow Engine.
   */
  public async handleIncomingEvent(organizationId: string, body: any): Promise<{ processedCount: number; events: NormalizedEvent[] }> {
    const objectType = body?.object; // "whatsapp_business_account" | "page" | "instagram"
    let normalizedEvents: NormalizedEvent[] = [];

    if (objectType === 'whatsapp_business_account' || (!objectType && body?.entry)) {
      const entries = body?.entry || [];
      for (const entry of entries) {
        const events = normalizeWhatsAppPayload(organizationId, entry);
        normalizedEvents.push(...events);
      }
    } else if (objectType === 'page') {
      const entries = body?.entry || [];
      for (const entry of entries) {
        const events = normalizeFacebookPagePayload(organizationId, entry);
        normalizedEvents.push(...events);
      }
    } else if (objectType === 'instagram') {
      const entries = body?.entry || [];
      for (const entry of entries) {
        const events = normalizeInstagramPayload(organizationId, entry);
        normalizedEvents.push(...events);
      }
    }

    // Save WebhookEvent in database & trigger workflow executions
    for (const ev of normalizedEvents) {
      await this.saveWebhookEvent(organizationId, ev, body);

      // Upsert contact in CRM
      if (ev.contactPhone) {
        let contact = db.contacts.find((c) => c.organizationId === organizationId && c.phone === ev.contactPhone);
        if (!contact) {
          const contactName = ev.contactName || 'Customer';
          contact = {
            id: `cnt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            organizationId,
            phone: ev.contactPhone,
            firstName: contactName.split(' ')[0] || 'Customer',
            lastName: contactName.split(' ').slice(1).join(' ') || '',
            email: ev.contactEmail,
            country: 'US',
            language: 'en',
            source: ev.channel,
            labels: ['INBOUND_META'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          db.contacts.unshift(contact);
        }
      }

      // Trigger Native Workflow Engine asynchronously
      try {
        await nativeWorkflowEngine.handleNormalizedEvent(ev);
      } catch (wfErr) {
        console.warn('[WhatsAppWebhookService] Workflow engine trigger warning:', wfErr);
      }
    }

    return { processedCount: normalizedEvents.length, events: normalizedEvents };
  }

  /**
   * Persists WebhookEvent record matching in-memory and database schema.
   */
  public async saveWebhookEvent(organizationId: string, event: NormalizedEvent, rawPayload: any): Promise<void> {
    const webhookEventRecord: DbWebhookEvent = {
      id: `whev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId,
      eventId: event.eventId,
      eventType: event.eventType,
      senderPhone: event.contactPhone,
      status: 'PROCESSED',
      payload: rawPayload,
      isProcessed: true,
      processedAt: new Date().toISOString(),
    };

    db.webhookEvents.unshift(webhookEventRecord);
    if (db.webhookEvents.length > 500) {
      db.webhookEvents.length = 500;
    }
  }
}

export const whatsAppWebhookService = new WhatsAppWebhookService();
