import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireRole } from '../tenant.js';

const router = Router();

// Get active Organization info & usage
router.get('/current', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const org = db.getOrg(orgId);
  const waba = db.getWaba(orgId);
  const phoneNumbers = db.getPhoneNumbers(orgId);
  const members = db.getMembers(orgId);

  res.json({
    organization: org,
    whatsappAccount: waba
      ? {
          id: waba.id,
          wabaId: waba.wabaId,
          name: waba.name,
          status: waba.status,
          tokenMask: waba.tokenMask,
          webhookVerified: waba.webhookVerified,
          createdAt: waba.createdAt,
        }
      : null,
    phoneNumbers,
    membersCount: members.length,
    usage: {
      contacts: { used: 3840, limit: 50000 },
      messages: { used: 482190, limit: 500000 },
      campaigns: { used: 14, limit: 200 },
      workflows: { used: 12, limit: 100 },
      teamMembers: { used: members.length, limit: 50 },
      phoneNumbers: { used: phoneNumbers.length, limit: 10 },
    },
  });
});

// List all organizations for tenant switcher
router.get('/list', (req: Request, res: Response) => {
  res.json({
    organizations: db.organizations,
  });
});

// Get team members
router.get('/members', (req: Request, res: Response) => {
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';
  const members = db.getMembers(orgId);
  res.json({ members });
});

// Update member role (Requires ADMIN or OWNER)
router.patch('/members/:memberId/role', requireRole('ADMIN'), (req: Request, res: Response) => {
  const { memberId } = req.params;
  const { role } = req.body;
  const orgId = req.tenant?.organizationId || 'org_nexus_ecommerce';

  const member = db.members.find((m) => m.id === memberId && m.organizationId === orgId);
  if (!member) {
    return res.status(404).json({ error: 'Member not found in organization' });
  }

  // Prevent demoting last OWNER
  if (member.role === 'OWNER' && role !== 'OWNER') {
    const ownerCount = db.members.filter((m) => m.organizationId === orgId && m.role === 'OWNER').length;
    if (ownerCount <= 1) {
      return res.status(400).json({ error: 'Organization must have at least one OWNER' });
    }
  }

  member.role = role;

  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    organizationId: orgId,
    userId: req.tenant?.userId || 'system',
    action: 'ROLE.UPDATED',
    entity: 'OrganizationMember',
    entityId: memberId,
    createdAt: new Date().toISOString(),
    metadata: { newRole: role },
  });

  res.json({ success: true, member });
});

export default router;
