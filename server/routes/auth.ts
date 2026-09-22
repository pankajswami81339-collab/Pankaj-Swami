import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// Get Current User & Memberships
router.get('/me', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || 'user_alex_rivera';
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  const userMemberships = db.members.filter((m) => m.userId === user.id);

  const orgs = userMemberships.map((m) => {
    const org = db.organizations.find((o) => o.id === m.organizationId);
    return {
      organization: org,
      role: m.role,
    };
  });

  res.json({
    user,
    organizations: orgs,
  });
});

// Login Simulator
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email) || db.users[0];

  res.json({
    success: true,
    token: `jwt_${Buffer.from(user.id).toString('base64')}_${Date.now()}`,
    user,
  });
});

// Register Simulator
router.post('/register', (req: Request, res: Response) => {
  const { name, email, organizationName } = req.body;

  const newUser = {
    id: `user_${Date.now()}`,
    name: name || 'Enterprise Admin',
    email: email || `user_${Date.now()}@example.com`,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  const newOrg = {
    id: `org_${Date.now()}`,
    name: organizationName || 'My WhatsApp Enterprise',
    slug: (organizationName || 'my-enterprise').toLowerCase().replace(/[^a-z0-9]/g, '-'),
    tier: 'STARTER' as const,
    createdAt: new Date().toISOString(),
    wabaStatus: 'PENDING_VERIFICATION' as const,
    webhookStatus: 'PENDING' as const,
    accountHealth: 'HEALTHY' as const,
  };
  db.organizations.push(newOrg);

  db.members.push({
    id: `mem_${Date.now()}`,
    organizationId: newOrg.id,
    userId: newUser.id,
    role: 'OWNER',
    joinedAt: new Date().toISOString(),
  });

  res.json({
    success: true,
    user: newUser,
    organization: newOrg,
  });
});

// Google & Gmail Sign In / Sign Up
router.post('/google', (req: Request, res: Response) => {
  const { email, name, avatarUrl, organizationName } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required for Google authentication' });
  }

  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  let org = undefined;

  if (!user) {
    user = {
      id: `user_google_${Date.now()}`,
      name: name || email.split('@')[0].replace('.', ' '),
      email: email.toLowerCase(),
      avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=00d2b4&color=fff`,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);

    // Create organization for new Google user
    const defaultOrgName = organizationName || `${user.name}'s Workspace`;
    org = {
      id: `org_${Date.now()}`,
      name: defaultOrgName,
      slug: defaultOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      tier: 'STARTER' as const,
      createdAt: new Date().toISOString(),
      wabaStatus: 'PENDING_VERIFICATION' as const,
      webhookStatus: 'PENDING' as const,
      accountHealth: 'HEALTHY' as const,
    };
    db.organizations.push(org);

    db.members.push({
      id: `mem_${Date.now()}`,
      organizationId: org.id,
      userId: user.id,
      role: 'OWNER',
      joinedAt: new Date().toISOString(),
    });
  } else {
    const membership = db.members.find((m) => m.userId === user!.id);
    if (membership) {
      org = db.organizations.find((o) => o.id === membership.organizationId);
    }
    if (!org) {
      org = db.organizations[0];
    }
  }

  res.json({
    success: true,
    token: `google_jwt_${Buffer.from(user.id).toString('base64')}_${Date.now()}`,
    user,
    organization: org,
  });
});

export default router;
