import { encryptToken, maskSecret } from './crypto.js';

export interface DbUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface DbOrg {
  id: string;
  name: string;
  slug: string;
  tier: 'FREE' | 'STARTER' | 'GROWTH' | 'BUSINESS' | 'ENTERPRISE';
  createdAt: string;
  metaBusinessId?: string;
  wabaId?: string;
  wabaStatus: 'CONNECTED' | 'DISCONNECTED' | 'RESTRICTED' | 'PENDING_VERIFICATION';
  primaryPhoneNumber?: string;
  webhookStatus: 'ACTIVE' | 'PENDING' | 'ERROR';
  accountHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface DbMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT';
  joinedAt: string;
}

export interface DbWhatsAppAccount {
  id: string;
  organizationId: string;
  wabaId: string;
  name: string;
  currency: string;
  timezoneId: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'RESTRICTED' | 'PENDING_VERIFICATION';
  encryptedToken: string;
  tokenMask: string;
  metaAppId: string;
  webhookVerifyToken: string;
  webhookVerified: boolean;
  createdAt: string;
}

export interface DbPhoneNumber {
  id: string;
  organizationId: string;
  whatsappAccountId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: 'GREEN' | 'YELLOW' | 'RED';
  messagingLimit: string;
  status: 'CONNECTED' | 'FLAGGED' | 'RESTRICTED';
  isDefault: boolean;
  codeVerificationStatus: 'VERIFIED' | 'EXPIRED' | 'NOT_VERIFIED';
}

export interface DbContact {
  id: string;
  organizationId: string;
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
  country: string;
  language: string;
  source: string;
  labels: string[];
  customFields?: Record<string, string>;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbWebhookEvent {
  id: string;
  organizationId: string;
  eventId: string;
  eventType: string;
  senderPhone?: string;
  status?: string;
  payload: any;
  isProcessed: boolean;
  processedAt: string;
}

export interface DbAuditLog {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress?: string;
  createdAt: string;
  metadata?: any;
}

class InMemDatabase {
  users: DbUser[] = [];
  organizations: DbOrg[] = [];
  members: DbMember[] = [];
  whatsappAccounts: DbWhatsAppAccount[] = [];
  phoneNumbers: DbPhoneNumber[] = [];
  contacts: DbContact[] = [];
  webhookEvents: DbWebhookEvent[] = [];
  auditLogs: DbAuditLog[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Seed Users
    const alex: DbUser = {
      id: 'user_alex_rivera',
      email: 'alex.rivera@nexus-ecommerce.com',
      name: 'Alex Rivera',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      createdAt: '2026-01-15T08:00:00.000Z',
    };
    const maya: DbUser = {
      id: 'user_maya_patel',
      email: 'maya.patel@nexus-ecommerce.com',
      name: 'Maya Patel',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      createdAt: '2026-01-16T10:00:00.000Z',
    };
    const jordan: DbUser = {
      id: 'user_jordan_lee',
      email: 'jordan.lee@nexus-ecommerce.com',
      name: 'Jordan Lee',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      createdAt: '2026-02-01T12:00:00.000Z',
    };
    const sam: DbUser = {
      id: 'user_sam_taylor',
      email: 'sam.taylor@nexus-ecommerce.com',
      name: 'Sam Taylor',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      createdAt: '2026-02-10T14:00:00.000Z',
    };
    this.users.push(alex, maya, jordan, sam);

    // 2. Seed Organizations
    const org1: DbOrg = {
      id: 'org_nexus_ecommerce',
      name: 'Nexus Global E-Commerce',
      slug: 'nexus-ecommerce',
      tier: 'BUSINESS',
      createdAt: '2026-01-15T08:30:00.000Z',
      metaBusinessId: 'bm_920194810293847',
      wabaId: 'waba_392019485710294',
      wabaStatus: 'CONNECTED',
      primaryPhoneNumber: '+1 (555) 382-9901',
      webhookStatus: 'ACTIVE',
      accountHealth: 'HEALTHY',
    };

    const org2: DbOrg = {
      id: 'org_aura_healthcare',
      name: 'Aura Health & Diagnostics',
      slug: 'aura-healthcare',
      tier: 'GROWTH',
      createdAt: '2026-02-01T09:00:00.000Z',
      metaBusinessId: 'bm_817263548192039',
      wabaId: 'waba_518293049182736',
      wabaStatus: 'CONNECTED',
      primaryPhoneNumber: '+1 (555) 479-2210',
      webhookStatus: 'ACTIVE',
      accountHealth: 'HEALTHY',
    };

    const org3: DbOrg = {
      id: 'org_finvantage_tech',
      name: 'FinVantage Wealth Advisory',
      slug: 'finvantage-tech',
      tier: 'ENTERPRISE',
      createdAt: '2026-03-01T11:00:00.000Z',
      metaBusinessId: 'bm_627381920394857',
      wabaId: 'waba_719283049581726',
      wabaStatus: 'PENDING_VERIFICATION',
      primaryPhoneNumber: '+1 (555) 603-7744',
      webhookStatus: 'PENDING',
      accountHealth: 'HEALTHY',
    };

    this.organizations.push(org1, org2, org3);

    // 3. Seed Memberships with all 4 Roles
    this.members.push(
      { id: 'mem_1', organizationId: org1.id, userId: alex.id, role: 'OWNER', joinedAt: '2026-01-15' },
      { id: 'mem_2', organizationId: org1.id, userId: maya.id, role: 'ADMIN', joinedAt: '2026-01-16' },
      { id: 'mem_3', organizationId: org1.id, userId: jordan.id, role: 'MANAGER', joinedAt: '2026-02-01' },
      { id: 'mem_4', organizationId: org1.id, userId: sam.id, role: 'AGENT', joinedAt: '2026-02-10' },
      // Alex also owns Org 2 & 3
      { id: 'mem_5', organizationId: org2.id, userId: alex.id, role: 'OWNER', joinedAt: '2026-02-01' },
      { id: 'mem_6', organizationId: org3.id, userId: alex.id, role: 'OWNER', joinedAt: '2026-03-01' }
    );

    // 4. Seed WhatsApp Accounts
    const rawMetaToken = 'EAAGm0PX4ZB9wBAK19x8ZAcE3Lz8N7c2Y0Pq1';
    const encryptedToken = encryptToken(rawMetaToken);

    this.whatsappAccounts.push({
      id: 'waba_acc_1',
      organizationId: org1.id,
      wabaId: org1.wabaId!,
      name: 'Nexus Official WhatsApp Business',
      currency: 'USD',
      timezoneId: 'America/New_York',
      status: 'CONNECTED',
      encryptedToken: encryptedToken,
      tokenMask: maskSecret(rawMetaToken),
      metaAppId: 'meta_app_991823901928',
      webhookVerifyToken: 'relayflow_verify_nexus_live',
      webhookVerified: true,
      createdAt: '2026-01-18T14:30:00.000Z',
    });

    // 5. Seed Phone Numbers
    this.phoneNumbers.push(
      {
        id: 'phone_1',
        organizationId: org1.id,
        whatsappAccountId: 'waba_acc_1',
        phoneNumberId: '109283746192837',
        displayPhoneNumber: '+1 (555) 382-9901',
        verifiedName: 'Nexus E-Commerce Official',
        qualityRating: 'GREEN',
        messagingLimit: 'TIER_100K',
        status: 'CONNECTED',
        isDefault: true,
        codeVerificationStatus: 'VERIFIED',
      },
      {
        id: 'phone_2',
        organizationId: org1.id,
        whatsappAccountId: 'waba_acc_1',
        phoneNumberId: '109283746192838',
        displayPhoneNumber: '+1 (555) 890-3412',
        verifiedName: 'Nexus VIP Concierge',
        qualityRating: 'GREEN',
        messagingLimit: 'TIER_10K',
        status: 'CONNECTED',
        isDefault: false,
        codeVerificationStatus: 'VERIFIED',
      }
    );

    // 6. Seed Sample Contacts
    this.contacts.push(
      {
        id: 'cnt_1',
        organizationId: org1.id,
        phone: '+14155552671',
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.r@gmail.com',
        country: 'United States',
        language: 'en',
        source: 'INCOMING_WHATSAPP',
        labels: ['VIP', 'HIGH_INTENT', 'CART_ABANDONED'],
        customFields: { order_id: 'NX-8921', lifetime_value: '$1,420' },
        assignedAgentId: sam.id,
        createdAt: '2026-03-01T10:00:00.000Z',
        updatedAt: '2026-03-18T16:20:00.000Z',
      },
      {
        id: 'cnt_2',
        organizationId: org1.id,
        phone: '+447911123456',
        firstName: 'Marcus',
        lastName: 'Vance',
        email: 'm.vance@techlead.co.uk',
        country: 'United Kingdom',
        language: 'en',
        source: 'CAMPAIGN_MARCH',
        labels: ['B2B', 'ENTERPRISE_DEMO'],
        customFields: { company_size: '50-200', requirement: 'API_AUTOMATION' },
        assignedAgentId: jordan.id,
        createdAt: '2026-03-05T12:00:00.000Z',
        updatedAt: '2026-03-19T09:40:00.000Z',
      },
      {
        id: 'cnt_3',
        organizationId: org1.id,
        phone: '+919876543210',
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav@sharma-ventures.in',
        country: 'India',
        language: 'en',
        source: 'WEBSITE_WIDGET',
        labels: ['ACTIVE_ORDER', 'PAID'],
        customFields: { invoice_id: 'INV-4412' },
        assignedAgentId: maya.id,
        createdAt: '2026-03-10T14:15:00.000Z',
        updatedAt: '2026-03-20T08:10:00.000Z',
      }
    );

    // 7. Seed Initial Webhook Events
    this.webhookEvents.push(
      {
        id: 'ev_1',
        organizationId: org1.id,
        eventId: 'wamid.HBgLMTQxNTU1NTI2NzEVAgASGBQzQURB',
        eventType: 'messages',
        senderPhone: '+14155552671',
        status: 'received',
        payload: {
          object: 'whatsapp_business_account',
          entry: [{
            id: org1.wabaId,
            changes: [{
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '+15553829901', phone_number_id: '109283746192837' },
                messages: [{
                  from: '14155552671',
                  id: 'wamid.HBgLMTQxNTU1NTI2NzEVAgASGBQzQURB',
                  timestamp: '1774092000',
                  text: { body: 'Hello! Can you check shipping status for my order NX-8921?' },
                  type: 'text'
                }]
              },
              field: 'messages'
            }]
          }],
        },
        isProcessed: true,
        processedAt: '2026-03-20T10:14:00.000Z',
      },
      {
        id: 'ev_2',
        organizationId: org1.id,
        eventId: 'wamid.HBgLMTQxNTU1NTI2NzEVAgASGBQzQURC_status_read',
        eventType: 'message_status',
        senderPhone: '+14155552671',
        status: 'read',
        payload: {
          object: 'whatsapp_business_account',
          entry: [{
            id: org1.wabaId,
            changes: [{
              value: {
                messaging_product: 'whatsapp',
                statuses: [{
                  id: 'wamid.HBgLMTQxNTU1NTI2NzEVAgASGBQzQURC',
                  status: 'read',
                  timestamp: '1774092040',
                  recipient_id: '14155552671'
                }]
              },
              field: 'messages'
            }]
          }]
        },
        isProcessed: true,
        processedAt: '2026-03-20T10:14:45.000Z',
      }
    );

    // 8. Seed Initial Audit Logs
    this.auditLogs.push(
      {
        id: 'aud_1',
        organizationId: org1.id,
        userId: alex.id,
        action: 'WABA.CONNECTED',
        entity: 'WhatsAppAccount',
        entityId: 'waba_acc_1',
        ipAddress: '192.168.1.45',
        createdAt: '2026-01-18T14:30:00.000Z',
        metadata: { wabaId: org1.wabaId, method: 'META_EMBEDDED_SIGNUP' },
      },
      {
        id: 'aud_2',
        organizationId: org1.id,
        userId: maya.id,
        action: 'WEBHOOK.VERIFIED',
        entity: 'Webhook',
        entityId: 'webhook_default',
        ipAddress: '192.168.1.60',
        createdAt: '2026-01-18T14:35:00.000Z',
        metadata: { verifyToken: 'relayflow_verify_nexus_live' },
      },
      {
        id: 'aud_3',
        organizationId: org1.id,
        userId: alex.id,
        action: 'ROLE.UPDATED',
        entity: 'OrganizationMember',
        entityId: 'mem_3',
        ipAddress: '192.168.1.45',
        createdAt: '2026-02-01T12:00:00.000Z',
        metadata: { targetUser: 'Jordan Lee', newRole: 'MANAGER' },
      }
    );
  }

  // Helper getters
  getOrg(id: string) {
    return this.organizations.find((o) => o.id === id) || this.organizations[0];
  }

  getWaba(orgId: string) {
    return this.whatsappAccounts.find((w) => w.organizationId === orgId);
  }

  getPhoneNumbers(orgId: string) {
    return this.phoneNumbers.filter((p) => p.organizationId === orgId);
  }

  getMembers(orgId: string) {
    const orgMembers = this.members.filter((m) => m.organizationId === orgId);
    return orgMembers.map((m) => {
      const user = this.users.find((u) => u.id === m.userId);
      return {
        ...m,
        user: user || { id: m.userId, name: 'Unknown', email: '', isEmailVerified: true, createdAt: '' },
      };
    });
  }

  getContacts(orgId: string) {
    return this.contacts.filter((c) => c.organizationId === orgId);
  }

  getWebhookEvents(orgId: string) {
    return this.webhookEvents
      .filter((e) => e.organizationId === orgId)
      .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());
  }

  getAuditLogs(orgId: string) {
    return this.auditLogs
      .filter((a) => a.organizationId === orgId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOverviewStats(orgId: string) {
    const contactsCount = this.getContacts(orgId).length;
    const phoneCount = this.getPhoneNumbers(orgId).length;

    return {
      totalContacts: contactsCount * 1420 + 3840,
      messagesSent: 482190,
      messagesDelivered: 472100,
      messagesRead: 419200,
      messagesFailed: 1890,
      activeCampaigns: 4,
      whatsappNumbers: phoneCount,
      activeAutomations: 12,
      deliveryRate: 97.9,
      readRate: 88.8,
      timeSeriesData: [
        { date: 'Mon', sent: 68000, delivered: 66800, read: 59200, failed: 210 },
        { date: 'Tue', sent: 74200, delivered: 72900, read: 65100, failed: 180 },
        { date: 'Wed', sent: 82100, delivered: 80800, read: 72300, failed: 320 },
        { date: 'Thu', sent: 79500, delivered: 78100, read: 69800, failed: 240 },
        { date: 'Fri', sent: 94000, delivered: 92300, read: 83500, failed: 410 },
        { date: 'Sat', sent: 51200, delivered: 50400, read: 44100, failed: 190 },
        { date: 'Sun', sent: 33190, delivered: 32800, read: 25200, failed: 340 },
      ],
      campaignsList: [
        { id: 'cmp_1', name: 'Spring Flash Sale VIP Broadcast', audienceCount: 24500, status: 'ACTIVE' as const, sent: 24500, readRate: 89.2 },
        { id: 'cmp_2', name: 'Cart Recovery Automation v2', audienceCount: 8120, status: 'ACTIVE' as const, sent: 8120, readRate: 92.4 },
        { id: 'cmp_3', name: 'Product Drop Notification #4', audienceCount: 14200, status: 'COMPLETED' as const, sent: 14200, readRate: 86.8 },
        { id: 'cmp_4', name: 'B2B Demo Scheduling Flow', audienceCount: 1890, status: 'SCHEDULED' as const, sent: 0, readRate: 0 },
      ],
    };
  }
}

export const db = new InMemDatabase();
