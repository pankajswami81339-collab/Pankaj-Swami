import { Router, Request, Response } from 'express';
import { metaAuthService } from '../services/meta/meta-auth-service.js';
import { metaGraphService } from '../services/meta/meta-graph-service.js';
import { whatsAppCloudService } from '../services/meta/whatsapp-cloud-service.js';
import { metaPageService } from '../services/meta/meta-page-service.js';
import { instagramService } from '../services/meta/instagram-service.js';
import { db } from '../db.js';

const router = Router();

// GET /api/integrations/meta/status
router.get('/status', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const status = metaAuthService.getConnectionStatus(orgId);
  res.json({ success: true, meta: status });
});

// GET /api/integrations/meta/connect
router.get('/connect', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const redirectUri = req.query.redirectUri as string | undefined;

  const { url, state } = metaAuthService.startAuthorization(orgId, redirectUri);

  res.json({
    success: true,
    authUrl: url,
    state,
    scopes: metaAuthService.REQUIRED_SCOPES,
  });
});

// GET /api/integrations/meta/callback
router.get('/callback', async (req: Request, res: Response) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.status(400).json({
      success: false,
      error: error as string,
      description: error_description as string,
    });
  }

  if (!code || !state) {
    return res.status(400).json({
      success: false,
      error: 'Missing code or state parameters from Meta authorization.',
    });
  }

  try {
    const connection = await metaAuthService.handleCallback(code as string, state as string);
    // Redirect back to settings whatsapp page or integrations
    res.redirect('/?tab=settings&sub=whatsapp&meta=connected');
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/integrations/meta/disconnect
router.post('/disconnect', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  metaAuthService.disconnect(orgId);
  res.json({ success: true, message: 'Meta connection revoked and disconnected.' });
});

// POST /api/integrations/meta/reconnect
router.post('/reconnect', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const redirectUri = req.body?.redirectUri as string | undefined;
  const { url, state } = metaAuthService.reconnect(orgId);
  res.json({ success: true, authUrl: url, state });
});

// GET /api/integrations/meta/available-assets
router.get('/available-assets', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const token = whatsAppCloudService.getDecryptedToken(orgId) || 'EAAGm0PX_demo_token';

  try {
    const [businesses, pages, igAccounts] = await Promise.all([
      metaGraphService.getBusinesses(token),
      metaPageService.getPages(orgId),
      instagramService.getAccounts(orgId),
    ]);

    // Fetch WABAs for primary business
    const wabas = await metaGraphService.getWhatsAppBusinessAccounts(token, businesses[0]?.id);
    const phoneNumbers = await metaGraphService.getPhoneNumbers(token, wabas[0]?.id || 'waba_39482716492810');

    res.json({
      success: true,
      businesses,
      whatsappBusinessAccounts: wabas,
      phoneNumbers,
      pages,
      instagramAccounts: igAccounts,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/integrations/meta/select-assets
router.post('/select-assets', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { businessId, wabaId, phoneNumberId, verifiedName, displayPhoneNumber } = req.body;

  if (!wabaId || !phoneNumberId) {
    return res.status(400).json({
      success: false,
      error: 'wabaId and phoneNumberId are required for WhatsApp connection.',
    });
  }

  // Update in DB
  let wabaRec = db.whatsappAccounts.find((w) => w.organizationId === orgId);
  if (wabaRec) {
    wabaRec.wabaId = wabaId;
    wabaRec.name = verifiedName || wabaRec.name;
    wabaRec.status = 'CONNECTED';
  }

  let phoneRec = db.phoneNumbers.find((p) => p.organizationId === orgId);
  if (phoneRec) {
    phoneRec.phoneNumberId = phoneNumberId;
    phoneRec.displayPhoneNumber = displayPhoneNumber || phoneRec.displayPhoneNumber;
    phoneRec.verifiedName = verifiedName || phoneRec.verifiedName;
    phoneRec.status = 'CONNECTED';
  }

  const org = db.getOrg(orgId);
  if (org) {
    org.wabaId = wabaId;
    org.wabaStatus = 'CONNECTED';
    org.primaryPhoneNumber = displayPhoneNumber || org.primaryPhoneNumber;
  }

  res.json({
    success: true,
    message: 'WhatsApp Business assets verified and synced successfully.',
    whatsapp: {
      wabaId,
      phoneNumberId,
      displayPhoneNumber,
      verifiedName,
    },
  });
});

// POST /api/integrations/meta/manual-test
router.post('/manual-test', async (req: Request, res: Response) => {
  const result = await whatsAppCloudService.testConnection(req.body);
  res.json(result);
});

// POST /api/integrations/meta/manual-connect
router.post('/manual-connect', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const result = await metaAuthService.manualConnect(orgId, req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// POST /api/integrations/meta/connect-demo (Instant sandbox test connection)
router.post('/connect-demo', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const connection = metaAuthService.connectDemoMode(orgId);
  res.json({
    success: true,
    message: 'Meta ecosystem and WhatsApp Cloud API connected in sandbox mode.',
    connection,
  });
});

// GET /api/integrations/meta/pages
router.get('/pages', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const pages = await metaPageService.getPages(orgId);
  res.json({ success: true, pages });
});

// POST /api/integrations/meta/pages/:pageId/connect
router.post('/pages/:pageId/connect', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { pageId } = req.params;
  const page = await metaPageService.connectPage(orgId, pageId);
  if (!page) {
    return res.status(404).json({ success: false, error: 'Facebook Page not found' });
  }
  res.json({ success: true, page });
});

// GET /api/integrations/meta/instagram
router.get('/instagram', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const accounts = await instagramService.getAccounts(orgId);
  res.json({ success: true, accounts });
});

// POST /api/integrations/meta/instagram/:instagramId/connect
router.post('/instagram/:instagramId/connect', async (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { instagramId } = req.params;
  const account = await instagramService.connectAccount(orgId, instagramId);
  if (!account) {
    return res.status(404).json({ success: false, error: 'Instagram Account not found' });
  }
  res.json({ success: true, account });
});

export default router;
