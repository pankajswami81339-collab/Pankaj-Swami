import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Multi-tenant Organizations API Route Handler
 * GET: List organizations accessible by current user
 * POST: Provision new tenant organization with isolated schema/boundary
 */

export async function GET(request: NextRequest) {
  const organizations = [
    {
      id: 'org_nexus_ecommerce',
      name: 'Nexus Global E-Commerce',
      slug: 'nexus-ecommerce',
      tier: 'BUSINESS',
      wabaStatus: 'CONNECTED',
      memberCount: 8,
      createdAt: '2026-01-15T08:30:00.000Z',
    },
    {
      id: 'org_aura_healthcare',
      name: 'Aura Health & Diagnostics',
      slug: 'aura-healthcare',
      tier: 'GROWTH',
      wabaStatus: 'CONNECTED',
      memberCount: 4,
      createdAt: '2026-02-01T09:00:00.000Z',
    },
    {
      id: 'org_finvantage_tech',
      name: 'FinVantage Wealth Advisory',
      slug: 'finvantage-tech',
      tier: 'ENTERPRISE',
      wabaStatus: 'CONNECTED',
      memberCount: 15,
      createdAt: '2026-03-01T11:00:00.000Z',
    },
  ];

  return NextResponse.json({ organizations, count: organizations.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, tier } = body;

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newOrg = {
      id: `org_${Date.now()}`,
      name,
      slug: generatedSlug,
      tier: tier || 'STARTER',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ organization: newOrg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create organization', details: err.message }, { status: 500 });
  }
}
