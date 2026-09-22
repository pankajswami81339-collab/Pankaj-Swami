import { Request, Response, NextFunction } from 'express';

export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT';

export interface TenantContext {
  organizationId: string;
  userId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

// Role Hierarchy: Higher index implies more permissions
const ROLE_HIERARCHY: Record<Role, number> = {
  AGENT: 1,
  MANAGER: 2,
  ADMIN: 3,
  OWNER: 4,
};

export function hasPermission(userRole: Role, minimumRoleRequired: Role): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[minimumRoleRequired] || 0);
}

/**
 * Middleware to enforce tenant isolation from headers or query parameters.
 */
export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const orgId = (req.headers['x-organization-id'] as string) || (req.query.organizationId as string) || 'org_nexus_ecommerce';
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || 'user_alex_rivera';
  const role = ((req.headers['x-user-role'] as string) || 'OWNER') as Role;

  req.tenant = {
    organizationId: orgId,
    userId: userId,
    role: role,
  };

  next();
}

/**
 * Middleware to enforce minimum role requirement.
 */
export function requireRole(minimumRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.tenant) {
      return res.status(401).json({ error: 'Unauthorized: Missing tenant context' });
    }

    if (!hasPermission(req.tenant.role, minimumRole)) {
      return res.status(403).json({
        error: `Forbidden: Action requires at least ${minimumRole} privileges. Current role: ${req.tenant.role}`,
      });
    }

    next();
  };
}
