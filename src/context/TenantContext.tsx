import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization, WhatsAppAccount, WhatsAppPhoneNumber, WebhookEventRecord, DashboardStats, MetaSignupPayload, Contact, PlanTier } from '../types.js';

interface TenantContextType {
  currentOrg: Organization;
  organizations: Organization[];
  whatsappAccount: WhatsAppAccount | null;
  phoneNumbers: WhatsAppPhoneNumber[];
  contacts: Contact[];
  stats: DashboardStats;
  webhookEvents: WebhookEventRecord[];
  isLoading: boolean;
  switchTenant: (orgId: string) => void;
  switchOrg: (orgId: string) => void;
  completeMetaSignup: (payload: MetaSignupPayload) => Promise<boolean>;
  disconnectWhatsApp: () => Promise<boolean>;
  syncPhoneNumbers: () => Promise<WhatsAppPhoneNumber[]>;
  setDefaultPhoneNumber: (phoneNumberId: string) => Promise<void>;
  simulateWebhook: (params: { type: 'incoming_message' | 'delivery_receipt' | 'read_receipt' | 'interactive_reply' | 'failed_receipt'; text?: string; status?: string; errorCode?: number }) => Promise<void>;
  refreshTenantData: () => Promise<void>;
}

const DEFAULT_ORGS: Organization[] = [
  {
    id: 'org_nexus_ecommerce',
    name: 'Nexus Global E-Commerce',
    slug: 'nexus-ecommerce',
    tier: PlanTier.BUSINESS,
    createdAt: '2026-01-15T08:30:00.000Z',
    metaBusinessId: 'bm_920194810293847',
    wabaId: 'waba_392019485710294',
    wabaStatus: 'CONNECTED',
    primaryPhoneNumber: '+1 (555) 382-9901',
    webhookStatus: 'ACTIVE',
    accountHealth: 'HEALTHY',
  },
  {
    id: 'org_aura_healthcare',
    name: 'Aura Health & Diagnostics',
    slug: 'aura-healthcare',
    tier: PlanTier.GROWTH,
    createdAt: '2026-02-01T09:00:00.000Z',
    metaBusinessId: 'bm_817263548192039',
    wabaId: 'waba_518293049182736',
    wabaStatus: 'CONNECTED',
    primaryPhoneNumber: '+1 (555) 479-2210',
    webhookStatus: 'ACTIVE',
    accountHealth: 'HEALTHY',
  },
  {
    id: 'org_finvantage_tech',
    name: 'FinVantage Wealth Advisory',
    slug: 'finvantage-tech',
    tier: PlanTier.ENTERPRISE,
    createdAt: '2026-03-01T11:00:00.000Z',
    metaBusinessId: 'bm_627381920394857',
    wabaId: 'waba_719283049581726',
    wabaStatus: 'PENDING_VERIFICATION',
    primaryPhoneNumber: '+1 (555) 603-7744',
    webhookStatus: 'PENDING',
    accountHealth: 'HEALTHY',
  },
];

const DEFAULT_CONTACTS: Contact[] = [
  {
    id: 'cnt_1',
    organizationId: 'org_nexus_ecommerce',
    name: 'Elena Rostova',
    phoneNumber: '+1 (415) 555-2671',
    country: 'US',
    labels: ['VIP', 'CART_ABANDONED'],
    createdAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'cnt_2',
    organizationId: 'org_nexus_ecommerce',
    name: 'Marcus Chen',
    phoneNumber: '+1 (415) 555-8912',
    country: 'US',
    labels: ['HIGH_INTENT', 'WHOLESALE'],
    createdAt: '2026-02-12T11:30:00.000Z',
  },
  {
    id: 'cnt_3',
    organizationId: 'org_nexus_ecommerce',
    name: 'Sarah Miller',
    phoneNumber: '+1 (415) 555-4029',
    country: 'US',
    labels: ['SUPPORT_PENDING'],
    createdAt: '2026-02-14T09:15:00.000Z',
  },
  {
    id: 'cnt_4',
    organizationId: 'org_nexus_ecommerce',
    name: 'David Kim',
    phoneNumber: '+1 (415) 555-7381',
    country: 'US',
    labels: ['ENTERPRISE_LEAD'],
    createdAt: '2026-02-16T14:20:00.000Z',
  },
];

const INITIAL_STATS: DashboardStats = {
  totalContacts: 18450,
  messagesSent: 482190,
  messagesDelivered: 472100,
  messagesRead: 419200,
  messagesFailed: 1890,
  activeCampaigns: 4,
  whatsappNumbers: 2,
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
    { id: 'cmp_1', name: 'Spring Flash Sale VIP Broadcast', audienceCount: 24500, status: 'ACTIVE', sent: 24500, readRate: 89.2 },
    { id: 'cmp_2', name: 'Cart Recovery Automation v2', audienceCount: 8120, status: 'ACTIVE', sent: 8120, readRate: 92.4 },
    { id: 'cmp_3', name: 'Product Drop Notification #4', audienceCount: 14200, status: 'COMPLETED', sent: 14200, readRate: 86.8 },
    { id: 'cmp_4', name: 'B2B Demo Scheduling Flow', audienceCount: 1890, status: 'SCHEDULED', sent: 0, readRate: 0 },
  ],
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(DEFAULT_ORGS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(DEFAULT_ORGS[0]);
  const [whatsappAccount, setWhatsappAccount] = useState<WhatsAppAccount | null>({
    id: 'waba_acc_1',
    organizationId: DEFAULT_ORGS[0].id,
    wabaId: DEFAULT_ORGS[0].wabaId!,
    name: 'Nexus Official WhatsApp Business',
    currency: 'USD',
    timezoneId: 'America/New_York',
    status: 'CONNECTED',
    webhookUrl: 'https://api.adscalezen.online/api/webhooks/whatsapp',
    webhookVerified: true,
    metaAppId: 'meta_app_991823901928',
    phoneNumbersCount: 2,
    createdAt: '2026-01-18T14:30:00.000Z',
  });
  const [phoneNumbers, setPhoneNumbers] = useState<WhatsAppPhoneNumber[]>([
    {
      id: 'phone_1',
      organizationId: DEFAULT_ORGS[0].id,
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
      organizationId: DEFAULT_ORGS[0].id,
      whatsappAccountId: 'waba_acc_1',
      phoneNumberId: '109283746192838',
      displayPhoneNumber: '+1 (555) 890-3412',
      verifiedName: 'Nexus VIP Concierge',
      qualityRating: 'GREEN',
      messagingLimit: 'TIER_10K',
      status: 'CONNECTED',
      isDefault: false,
      codeVerificationStatus: 'VERIFIED',
    },
  ]);
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEventRecord[]>([
    {
      id: 'ev_init_1',
      organizationId: DEFAULT_ORGS[0].id,
      eventId: 'wamid.HBgLMTQxNTU1NTI2NzEVAgASGBQzQURB',
      eventType: 'messages',
      senderPhone: '+14155552671',
      status: 'received',
      rawPayload: { body: 'Hello! Can you check shipping status for my order NX-8921?' },
      isProcessed: true,
      receivedAt: new Date(Date.now() - 360000).toISOString(),
    },
    {
      id: 'ev_init_2',
      organizationId: DEFAULT_ORGS[0].id,
      eventId: 'wamid.HBgLMTQxNTU1NTI2NzEVAgASGBQzQURB_status_read',
      eventType: 'message_status',
      senderPhone: '+14155552671',
      status: 'read',
      rawPayload: { status: 'read', timestamp: '1774092040' },
      isProcessed: true,
      receivedAt: new Date(Date.now() - 320000).toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const switchTenant = (orgId: string) => {
    const selected = organizations.find((o) => o.id === orgId);
    if (selected) {
      setCurrentOrg(selected);
      // Adjust numbers & stats for chosen tenant
      if (selected.id === 'org_aura_healthcare') {
        setPhoneNumbers([
          {
            id: 'phone_aura',
            organizationId: selected.id,
            whatsappAccountId: 'waba_aura',
            phoneNumberId: '817263910293847',
            displayPhoneNumber: '+1 (555) 479-2210',
            verifiedName: 'Aura Medical Care',
            qualityRating: 'GREEN',
            messagingLimit: 'TIER_10K',
            status: 'CONNECTED',
            isDefault: true,
            codeVerificationStatus: 'VERIFIED',
          },
        ]);
        setStats({
          ...INITIAL_STATS,
          totalContacts: 6420,
          messagesSent: 128400,
          messagesDelivered: 127100,
          messagesRead: 119800,
          whatsappNumbers: 1,
        });
      } else if (selected.id === 'org_finvantage_tech') {
        setPhoneNumbers([
          {
            id: 'phone_fin',
            organizationId: selected.id,
            whatsappAccountId: 'waba_fin',
            phoneNumberId: '918273645102938',
            displayPhoneNumber: '+1 (555) 603-7744',
            verifiedName: 'FinVantage Wealth',
            qualityRating: 'GREEN',
            messagingLimit: 'TIER_10K',
            status: 'CONNECTED',
            isDefault: true,
            codeVerificationStatus: 'VERIFIED',
          },
        ]);
        setStats({
          ...INITIAL_STATS,
          totalContacts: 2890,
          messagesSent: 42100,
          messagesDelivered: 41200,
          messagesRead: 38400,
          whatsappNumbers: 1,
        });
      } else {
        setPhoneNumbers([
          {
            id: 'phone_1',
            organizationId: selected.id,
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
        ]);
        setStats(INITIAL_STATS);
      }
    }
  };

  const completeMetaSignup = async (payload: MetaSignupPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const updatedOrg: Organization = {
        ...currentOrg,
        wabaId: payload.wabaId,
        wabaStatus: 'CONNECTED',
        primaryPhoneNumber: payload.displayPhoneNumber,
        webhookStatus: 'ACTIVE',
        accountHealth: 'HEALTHY',
      };
      setCurrentOrg(updatedOrg);

      setWhatsappAccount({
        id: `waba_${Date.now()}`,
        organizationId: currentOrg.id,
        wabaId: payload.wabaId,
        name: payload.verifiedName,
        currency: 'USD',
        timezoneId: 'UTC',
        status: 'CONNECTED',
        webhookUrl: 'https://api.adscalezen.online/api/webhooks/whatsapp',
        webhookVerified: true,
        metaAppId: 'meta_app_official_8892',
        phoneNumbersCount: 1,
        createdAt: new Date().toISOString(),
      });

      setPhoneNumbers([
        {
          id: `phone_${Date.now()}`,
          organizationId: currentOrg.id,
          whatsappAccountId: `waba_${Date.now()}`,
          phoneNumberId: payload.phoneNumberId,
          displayPhoneNumber: payload.displayPhoneNumber,
          verifiedName: payload.verifiedName,
          qualityRating: 'GREEN',
          messagingLimit: 'TIER_10K',
          status: 'CONNECTED',
          isDefault: true,
          codeVerificationStatus: 'VERIFIED',
        },
      ]);

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWhatsApp = async (): Promise<boolean> => {
    setCurrentOrg({
      ...currentOrg,
      wabaStatus: 'DISCONNECTED',
      webhookStatus: 'PENDING',
    });
    if (whatsappAccount) {
      setWhatsappAccount({
        ...whatsappAccount,
        status: 'DISCONNECTED',
      });
    }
    return true;
  };

  const syncPhoneNumbers = async (): Promise<WhatsAppPhoneNumber[]> => {
    setIsLoading(true);
    try {
      // Simulate live network round-trip to Meta Graph API
      await new Promise((resolve) => setTimeout(resolve, 450));
      
      const refreshed: WhatsAppPhoneNumber[] = phoneNumbers.map((p) => ({
        ...p,
        qualityRating: 'GREEN',
        status: 'CONNECTED',
        codeVerificationStatus: 'VERIFIED',
      }));

      // Ensure at least one primary exists
      if (refreshed.length === 0) {
        refreshed.push({
          id: `phone_${Date.now()}`,
          organizationId: currentOrg.id,
          whatsappAccountId: whatsappAccount?.id || `waba_${Date.now()}`,
          phoneNumberId: '109283746192837',
          displayPhoneNumber: currentOrg.primaryPhoneNumber || '+1 (555) 382-9901',
          verifiedName: `${currentOrg.name} Support`,
          qualityRating: 'GREEN',
          messagingLimit: 'TIER_100K',
          status: 'CONNECTED',
          isDefault: true,
          codeVerificationStatus: 'VERIFIED',
        });
      }

      setPhoneNumbers(refreshed);
      return refreshed;
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPhoneNumber = async (phoneNumberId: string) => {
    setPhoneNumbers((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.phoneNumberId === phoneNumberId || p.id === phoneNumberId,
      }))
    );
    const target = phoneNumbers.find((p) => p.phoneNumberId === phoneNumberId || p.id === phoneNumberId);
    if (target) {
      setCurrentOrg({
        ...currentOrg,
        primaryPhoneNumber: target.displayPhoneNumber,
      });
    }
  };

  const simulateWebhook = async (params: {
    type: 'incoming_message' | 'delivery_receipt' | 'read_receipt' | 'interactive_reply' | 'failed_receipt';
    text?: string;
    status?: string;
    errorCode?: number;
  }) => {
    const eventId = `wamid.sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let eventType: 'messages' | 'message_status' = 'messages';
    let status = 'received';
    let rawPayload: any = {};

    if (params.type === 'incoming_message') {
      eventType = 'messages';
      status = 'received';
      rawPayload = {
        from: '14158902184',
        id: eventId,
        text: { body: params.text || 'Simulated WhatsApp customer inquiry' },
        type: 'text',
      };
    } else if (params.type === 'interactive_reply') {
      eventType = 'messages';
      status = 'received';
      rawPayload = {
        from: '14158902184',
        id: eventId,
        type: 'interactive',
        interactive: {
          type: 'button_reply',
          button_reply: { id: 'btn_confirm', title: params.text || 'Confirm Order' },
        },
      };
    } else {
      eventType = 'message_status';
      if (params.type === 'delivery_receipt') status = 'delivered';
      else if (params.type === 'read_receipt') status = 'read';
      else if (params.type === 'failed_receipt') status = 'failed';
      else status = params.status || 'delivered';

      rawPayload = {
        id: eventId,
        recipient_id: '14158902184',
        status,
        timestamp: `${Math.floor(Date.now() / 1000)}`,
        errors: params.type === 'failed_receipt' ? [{ code: params.errorCode || 131026, title: 'Service Window Expired' }] : undefined,
      };
    }

    const newEvent: WebhookEventRecord = {
      id: `ev_${Date.now()}`,
      organizationId: currentOrg.id,
      eventId,
      eventType,
      senderPhone: '+1 (415) 890-2184',
      status,
      rawPayload,
      isProcessed: true,
      receivedAt: new Date().toISOString(),
    };

    setWebhookEvents((prev) => [newEvent, ...prev.slice(0, 19)]);

    // Update live metrics slightly to reflect real-time activity
    setStats((prev) => ({
      ...prev,
      messagesDelivered: prev.messagesDelivered + (params.type === 'delivery_receipt' ? 1 : 0),
      messagesRead: prev.messagesRead + (params.type === 'read_receipt' ? 1 : 0),
      messagesFailed: prev.messagesFailed + (params.type === 'failed_receipt' ? 1 : 0),
    }));
  };

  const refreshTenantData = async () => {
    // Refresh handler
  };

  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);

  return (
    <TenantContext.Provider
      value={{
        currentOrg,
        organizations,
        whatsappAccount,
        phoneNumbers,
        contacts,
        stats,
        webhookEvents,
        isLoading,
        switchTenant,
        switchOrg: switchTenant,
        completeMetaSignup,
        disconnectWhatsApp,
        syncPhoneNumbers,
        setDefaultPhoneNumber,
        simulateWebhook,
        refreshTenantData,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
