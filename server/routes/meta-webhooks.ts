import { Router, Request, Response } from 'express';
import { whatsAppWebhookService } from '../services/meta/whatsapp-webhook-service.js';

const router = Router();

// GET /api/webhooks/meta - Meta Hub Challenge Verification
router.get('/', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'] as string | undefined;
  const token = req.query['hub.verify_token'] as string | undefined;
  const challenge = req.query['hub.challenge'] as string | undefined;

  const result = whatsAppWebhookService.verifyWebhookChallenge(mode, token, challenge);

  if (result.success && result.challenge) {
    console.log('✅ [Meta Webhook Verification] Challenge accepted.');
    return res.status(200).send(result.challenge);
  }

  console.warn('⚠️ [Meta Webhook Verification] Challenge rejected for token:', token);
  return res.sendStatus(403);
});

// POST /api/webhooks/meta - Ingestion Router (WhatsApp, Facebook Pages, Instagram)
router.post('/', async (req: Request, res: Response) => {
  // Always respond with 200 OK immediately to satisfy Meta's strict 3-second SLA
  res.status(200).json({ status: 'EVENT_RECEIVED' });

  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);

  // Validate signature if configured
  const isValid = whatsAppWebhookService.verifySignature(rawBody, signature);
  if (!isValid) {
    console.warn('⚠️ [Meta Webhook] Invalid X-Hub-Signature-256 detected.');
    return;
  }

  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';

  try {
    const result = await whatsAppWebhookService.handleIncomingEvent(orgId, req.body);
    console.log(`📡 [Meta Webhook] Successfully processed ${result.processedCount} events for org ${orgId}`);
  } catch (err) {
    console.error('❌ [Meta Webhook Error]:', err);
  }
});

export default router;
