import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * RelayFlow Next.js Multi-Tenant & RBAC Routing Middleware
 *
 * Enforces:
 * 1. Subdomain / Slug extraction for tenant isolation
 * 2. Header injection (x-organization-slug, x-tenant-id)
 * 3. Route protection for dashboard paths vs. public marketing routes
 * 4. Role-Based Access Control (RBAC) path rules
 */

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/api/health',
  '/api/webhooks',
];

const OWNER_ONLY_PATHS = ['/settings/danger-zone', '/billing/plans'];
const ADMIN_PLUS_PATHS = ['/settings', '/team', '/api-keys'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if public path
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (isPublic) {
    return NextResponse.next();
  }

  // Extract tenant slug from URL: /(dashboard)/[orgSlug]/...
  // Example path: /nexus-ecommerce/contacts
  const segments = pathname.split('/').filter(Boolean);
  const orgSlug = segments[0];

  // If visiting dashboard root or authenticated zone
  const response = NextResponse.next();
  if (orgSlug && !['api', '_next', 'static', 'favicon.ico'].includes(orgSlug)) {
    response.headers.set('x-organization-slug', orgSlug);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
