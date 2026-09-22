import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Organization Members & RBAC API Route Handler
 * Manages member invitations, role promotions (OWNER, ADMIN, MANAGER, AGENT), and revocations.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const members = [
    { id: 'usr_1', name: 'Alex Rivera', email: 'alex.rivera@nexus-ecommerce.com', role: 'OWNER', status: 'Active' },
    { id: 'usr_2', name: 'Sarah Chen', email: 'sarah.chen@nexus-ecommerce.com', role: 'ADMIN', status: 'Active' },
    { id: 'usr_3', name: 'Devon Vance', email: 'devon.v@nexus-ecommerce.com', role: 'MANAGER', status: 'Active' },
    { id: 'usr_4', name: 'Maya Lin', email: 'maya.lin@nexus-ecommerce.com', role: 'AGENT', status: 'Active' },
  ];

  return NextResponse.json({
    organizationId: params.orgId,
    members,
    total: members.length,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const newMember = {
      id: `usr_${Date.now()}`,
      organizationId: params.orgId,
      email,
      role,
      status: 'INVITED',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to invite member', details: err.message }, { status: 500 });
  }
}
