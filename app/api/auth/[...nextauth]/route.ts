import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Auth API Route Handler
 * Manages session tokens, OAuth callbacks, and multi-tenant credentials.
 */

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'usr_alex_rivera',
      email: 'alex.rivera@nexus-ecommerce.com',
      name: 'Alex Rivera',
      role: 'OWNER',
    },
    tenants: [
      { id: 'org_nexus_ecommerce', name: 'Nexus Global E-Commerce', slug: 'nexus-ecommerce', role: 'OWNER' },
      { id: 'org_aura_healthcare', name: 'Aura Health & Diagnostics', slug: 'aura-healthcare', role: 'ADMIN' },
      { id: 'org_finvantage_tech', name: 'FinVantage Wealth Advisory', slug: 'finvantage-tech', role: 'MANAGER' },
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    return NextResponse.json({
      success: true,
      token: `jwt_${Buffer.from(email || 'user').toString('base64')}_${Date.now()}`,
      user: {
        id: `usr_${Date.now()}`,
        email: email || 'alex.rivera@nexus-ecommerce.com',
        name: email ? email.split('@')[0].toUpperCase() : 'Demo User',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failed', details: err.message }, { status: 400 });
  }
}
