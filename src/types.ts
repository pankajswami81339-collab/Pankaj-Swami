export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
}

export type UserRole = Role | 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT';

export enum PlanTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

export type WhatsAppAccountStatus = 'CONNECTED' | 'DISCONNECTED' | 'RESTRICTED' | 'PENDING_VERIFICATION';

export type PhoneNumberQualityRating = 'GREEN' | 'YELLOW' | 'RED' | 'UNKNOWN';

export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  tier: PlanTier;
  createdAt: string;
  metaBusinessId?: string;
  wabaId?: string;
  wabaStatus: WhatsAppAccountStatus;
  primaryPhoneNumber?: string;
  webhookStatus: 'ACTIVE' | 'PENDING' | 'ERROR';
  accountHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  user: User;
  joinedAt: string;
}

export interface WhatsAppAccount {
  id: string;
  organizationId: string;
  wabaId: string;
  name: string;
  currency: string;
  timezoneId: string;
  status: WhatsAppAccountStatus;
  webhookUrl: string;
  webhookVerified: boolean;
  metaAppId: string;
  phoneNumbersCount: number;
  createdAt: string;
}

export interface WhatsAppPhoneNumber {
  id: string;
  organizationId: string;
  whatsappAccountId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: PhoneNumberQualityRating;
  messagingLimit: string;
  status: 'CONNECTED' | 'FLAGGED' | 'RESTRICTED';
  isDefault: boolean;
  codeVerificationStatus: 'VERIFIED' | 'EXPIRED' | 'NOT_VERIFIED';
}

export interface Contact {
  id: string;
  organizationId: string;
  firstName?: string;
  lastName?: string;
  name: string;
  phone?: string;
  phoneNumber: string;
  email?: string;
  country?: string;
  language?: string;
  source?: string;
  labels: string[];
  customFields?: Record<string, string>;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WebhookEventRecord {
  id: string;
  organizationId: string;
  eventId: string;
  eventType: 'messages' | 'message_status' | 'template_status' | 'account_alerts';
  senderPhone?: string;
  recipientPhone?: string;
  status?: string;
  rawPayload: any;
  isProcessed: boolean;
  receivedAt: string;
}

export interface UsageMetrics {
  contacts: { used: number; limit: number };
  messages: { used: number; limit: number };
  campaigns: { used: number; limit: number };
  workflows: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
  phoneNumbers: { used: number; limit: number };
}

export interface DashboardStats {
  totalContacts: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesRead: number;
  messagesFailed: number;
  activeCampaigns: number;
  whatsappNumbers: number;
  activeAutomations: number;
  deliveryRate: number;
  readRate: number;
  timeSeriesData: {
    date: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  }[];
  campaignsList: {
    id: string;
    name: string;
    audienceCount: number;
    status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED' | 'PAUSED';
    sent: number;
    readRate: number;
  }[];
}

export interface MetaSignupPayload {
  businessName: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  accessToken: string;
}
