import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// Middleware: API Key Authentication
router.use((req: Request, res: Response, next) => {
  const authHeader = req.headers.authorization;
  // If no auth header, in dev mode allow with warning or check x-organization-id
  if (!authHeader && !req.headers['x-organization-id'] && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized: Missing Bearer API Key' });
  }
  next();
});

// GET /api/v1/stats/overview
router.get('/stats/overview', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const stats = db.getOverviewStats(orgId);
  res.json(stats);
});

// GET /api/v1/audit-logs
router.get('/audit-logs', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const logs = db.getAuditLogs(orgId);
  res.json({ logs });
});

// GET /api/v1/contacts
router.get('/contacts', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const contacts = db.getContacts(orgId);
  res.json({ contacts, count: contacts.length });
});

// POST /api/v1/contacts
router.post('/contacts', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { phone, firstName, lastName, email, labels, customFields } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const newContact = {
    id: `cnt_${Date.now()}`,
    organizationId: orgId,
    phone,
    firstName: firstName || '',
    lastName: lastName || '',
    email,
    country: 'International',
    language: 'en',
    source: 'REST_API',
    labels: labels || ['API_IMPORTED'],
    customFields: customFields || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.contacts.push(newContact);
  res.status(201).json({ contact: newContact });
});

// PUT /api/v1/contacts/:id
router.put('/contacts/:id', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { id } = req.params;
  const contact = db.contacts.find((c) => c.id === id && c.organizationId === orgId);

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  Object.assign(contact, req.body, { updatedAt: new Date().toISOString() });
  res.json({ contact });
});

// DELETE /api/v1/contacts/:id
router.delete('/contacts/:id', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const { id } = req.params;
  const index = db.contacts.findIndex((c) => c.id === id && c.organizationId === orgId);

  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  db.contacts.splice(index, 1);
  res.json({ success: true, deletedId: id });
});

// GET /api/v1/campaigns
router.get('/campaigns', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const stats = db.getOverviewStats(orgId);
  res.json({ campaigns: stats.campaignsList });
});

// POST /api/v1/campaigns
router.post('/campaigns', (req: Request, res: Response) => {
  const { name, templateId, audienceSize } = req.body;
  const newCampaign = {
    id: `cmp_${Date.now()}`,
    name: name || 'Scheduled Broadcast',
    templateId: templateId || 'tpl_standard_welcome',
    audienceCount: audienceSize || 1000,
    status: 'SCHEDULED' as const,
    sent: 0,
    readRate: 0,
  };
  res.status(201).json({ campaign: newCampaign });
});

// GET /api/v1/templates
router.get('/templates', (req: Request, res: Response) => {
  res.json({
    templates: [
      {
        id: 'tpl_1',
        name: 'order_status_update',
        category: 'UTILITY',
        language: 'en_US',
        status: 'APPROVED',
        bodyText: 'Hello {{1}}, your order #{{2}} has been dispatched! Track delivery here: {{3}}',
      },
      {
        id: 'tpl_2',
        name: 'flash_sale_vip',
        category: 'MARKETING',
        language: 'en_US',
        status: 'APPROVED',
        bodyText: 'Hey {{1}}, our weekend exclusive sale is now live with 30% off on all collections.',
      },
      {
        id: 'tpl_3',
        name: 'auth_otp_code',
        category: 'AUTHENTICATION',
        language: 'en_US',
        status: 'APPROVED',
        bodyText: 'Your verification code is {{1}}. Valid for 10 minutes. Do not share this code.',
      },
    ],
  });
});

// GET /api/v1/whatsapp/accounts
router.get('/whatsapp/accounts', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const waba = db.getWaba(orgId);
  const phoneNumbers = db.getPhoneNumbers(orgId);
  res.json({ waba, phoneNumbers });
});

// POST /api/v1/messages/send
router.post('/messages/send', (req: Request, res: Response) => {
  const { to, text, type } = req.body;
  if (!to) {
    return res.status(400).json({ error: 'Recipient phone number is required' });
  }

  const wamid = `wamid.HBgL${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  res.json({
    messaging_product: 'whatsapp',
    contacts: [{ input: to, wa_id: to.replace('+', '') }],
    messages: [{ id: wamid, message_status: 'accepted' }],
  });
});

// POST /api/v1/messages/template
router.post('/messages/template', (req: Request, res: Response) => {
  const { to, templateName, language, components } = req.body;
  if (!to || !templateName) {
    return res.status(400).json({ error: 'Missing required parameters: to, templateName' });
  }

  const wamid = `wamid.HBgL${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
  res.json({
    messaging_product: 'whatsapp',
    contacts: [{ input: to, wa_id: to.replace('+', '') }],
    messages: [{ id: wamid, message_status: 'accepted' }],
  });
});

// GET /api/v1/analytics
router.get('/analytics', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const stats = db.getOverviewStats(orgId);
  res.json(stats);
});

export default router;
