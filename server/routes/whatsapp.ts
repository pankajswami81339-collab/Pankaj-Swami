import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { WhatsAppMetaService } from '../whatsapp-service.js';
import { requireRole } from '../tenant.js';

const router = Router();

/**
 * Get WhatsApp Account & Phone Numbers for Tenant
 * Endpoint: GET /api/v1/whatsapp/accounts
 */
router.get('/accounts', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const waba = db.getWaba(orgId);
  const phoneNumbers = db.getPhoneNumbers(orgId);
  const org = db.getOrg(orgId);

  res.json({
    account: waba
      ? {
          id: waba.id,
          wabaId: waba.wabaId,
          name: waba.name,
          currency: waba.currency,
          timezoneId: waba.timezoneId,
          status: waba.status,
          tokenMask: waba.tokenMask,
          webhookVerified: waba.webhookVerified,
          metaAppId: waba.metaAppId,
          createdAt: waba.createdAt,
        }
      : null,
    phoneNumbers,
    health: {
      status: org?.accountHealth || 'HEALTHY',
      webhookStatus: org?.webhookStatus || 'ACTIVE',
      qualityRating: phoneNumbers[0]?.qualityRating || 'GREEN',
      messagingLimit: phoneNumbers[0]?.messagingLimit || 'TIER_100K',
      lastHealthCheck: new Date().toISOString(),
      metaGraphApiLatencyMs: 142,
    },
  });
});

/**
 * Generate Meta OAuth 2.0 Authorization URL for Embedded Signup
 * Endpoint: GET /api/v1/whatsapp/oauth/url
 */
router.get('/oauth/url', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const redirectUri = (req.query.redirectUri as string) || `${req.protocol}://${req.get('host')}/api/v1/whatsapp/oauth/callback`;
  const oauthConfig = WhatsAppMetaService.generateOAuthAuthorizationUrl(orgId, redirectUri);
  res.json(oauthConfig);
});

/**
 * Meta OAuth Redirect Callback Handler (Browser Redirect)
 * Endpoint: GET /api/v1/whatsapp/oauth/callback
 */
router.get('/oauth/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const stateParam = req.query.state as string;

    if (!code) {
      return res.status(400).send('OAuth callback error: Missing code parameter');
    }

    let organizationId = 'org_nexus_ecommerce';
    if (stateParam) {
      try {
        const decoded = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf8'));
        if (decoded.orgId) organizationId = decoded.orgId;
      } catch (e) {
        console.warn('Could not parse OAuth state:', e);
      }
    }

    const redirectUri = `${req.protocol}://${req.get('host')}/api/v1/whatsapp/oauth/callback`;
    const result = await WhatsAppMetaService.handleOAuthCallback({
      organizationId,
      code,
      redirectUri,
    });

    const org = db.getOrg(organizationId);
    const orgSlug = org?.slug || 'nexus-ecommerce';

    // Redirect to dashboard with success banner
    return res.redirect(`/${orgSlug}/whatsapp?oauth_connected=true&waba_id=${result.waba.wabaId}`);
  } catch (error: any) {
    console.error('OAuth redirect processing error:', error);
    return res.status(500).json({ error: error.message || 'OAuth exchange failed' });
  }
});

/**
 * Meta OAuth Code Exchange (Programmatic API)
 * Endpoint: POST /api/v1/whatsapp/oauth/callback
 */
router.post('/oauth/callback', requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing required code parameter' });
    }

    const defaultRedirect = `${req.protocol}://${req.get('host')}/api/v1/whatsapp/oauth/callback`;
    const result = await WhatsAppMetaService.handleOAuthCallback({
      organizationId: orgId,
      code,
      redirectUri: redirectUri || defaultRedirect,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'OAuth code exchange failed' });
  }
});

/**
 * Meta Embedded Signup Token Exchange (Popup SDK flow)
 * Endpoint: POST /api/v1/whatsapp/meta-embedded-signup
 */
router.post('/meta-embedded-signup', requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
    const { wabaId, phoneNumberId, displayPhoneNumber, verifiedName, systemUserToken, code } = req.body;

    if (!wabaId || !phoneNumberId || !displayPhoneNumber) {
      return res.status(400).json({
        error: 'Missing required parameters: wabaId, phoneNumberId, displayPhoneNumber',
      });
    }

    const result = await WhatsAppMetaService.completeEmbeddedSignup({
      organizationId: orgId,
      wabaId,
      phoneNumberId,
      displayPhoneNumber,
      verifiedName: verifiedName || 'WhatsApp Verified Business',
      systemUserToken,
      code,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Meta Embedded Signup exchange error:', error);
    res.status(500).json({ error: error.message || 'Failed to exchange Meta credentials' });
  }
});

/**
 * Sync Phone Numbers directly from Meta Graph API
 * Endpoint: POST /api/v1/whatsapp/phone-numbers/sync
 */
router.post('/phone-numbers/sync', requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
    const result = await WhatsAppMetaService.syncPhoneNumbers(orgId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to synchronize phone numbers' });
  }
});

/**
 * Set Primary Default WhatsApp Phone Number
 * Endpoint: POST /api/v1/whatsapp/phone-numbers/:id/default
 */
router.post('/phone-numbers/:id/default', requireRole('ADMIN'), async (req: Request, res: Response) => {
  try {
    const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
    const { id } = req.params;
    const result = await WhatsAppMetaService.setDefaultPhoneNumber(orgId, id);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to set default phone number' });
  }
});

/**
 * Disconnect WhatsApp Account
 * Endpoint: POST /api/v1/whatsapp/disconnect
 */
router.post('/disconnect', requireRole('OWNER'), async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const result = await WhatsAppMetaService.disconnectAccount(orgId);
  res.json(result);
});

export default router;
