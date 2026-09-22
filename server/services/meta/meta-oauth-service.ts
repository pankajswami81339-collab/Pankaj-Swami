import crypto from 'crypto';
import { db } from '../../db.js';
import { metaPageService } from './meta-page-service.js';
import { instagramService } from './instagram-service.js';

export interface MetaConnectionState {
  organizationId: string;
  provider: string;
  status: 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'RECONNECT';
  externalUserId?: string;
  accessTokenEncrypted?: string;
  tokenExpiresAt?: string;
  scopes: string[];
  businesses: {
    id: string;
    name: string;
    verificationStatus: string;
  }[];
  whatsapp: {
    wabaId: string;
    name: string;
    currency: string;
    timezone: string;
    phoneNumbers: {
      phoneNumberId: string;
      displayPhoneNumber: string;
      verifiedName: string;
      qualityRating: 'GREEN' | 'YELLOW' | 'RED';
      messagingLimit: string;
      status: string;
    }[];
  } | null;
  connectedPagesCount: number;
  connectedInstagramCount: number;
  connectedAt?: string;
  errorMessage?: string;
}

class MetaOAuthService {
  private oauthStates: Map<string, { organizationId: string; createdAt: number }> = new Map();
  private connections: Map<string, MetaConnectionState> = new Map();

  // Official Meta Scopes
  public readonly REQUIRED_SCOPES = [
    'whatsapp_business_management',
    'whatsapp_business_messaging',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_metadata',
    'instagram_basic',
    'instagram_manage_messages',
    'business_management',
  ];

  constructor() {
    // Seed initial connection for demo org
    this.connections.set('org_nexus_ecommerce', {
      organizationId: 'org_nexus_ecommerce',
      provider: 'META',
      status: 'CONNECTED',
      externalUserId: 'meta_usr_918237461',
      scopes: this.REQUIRED_SCOPES,
      businesses: [
        {
          id: 'biz_827361928374',
          name: 'Nexus E-Commerce Global Inc.',
          verificationStatus: 'VERIFIED',
        },
      ],
      whatsapp: {
        wabaId: 'waba_39482716492810',
        name: 'ADSCALE ZEN Official WhatsApp',
        currency: 'USD',
        timezone: 'America/New_York',
        phoneNumbers: [
          {
            phoneNumberId: '109283746592819',
            displayPhoneNumber: '+1 (555) 382-9901',
            verifiedName: 'Nexus E-Commerce Support',
            qualityRating: 'GREEN',
            messagingLimit: 'TIER_10K',
            status: 'CONNECTED',
          },
        ],
      },
      connectedPagesCount: 1,
      connectedInstagramCount: 1,
      connectedAt: '2026-03-10T10:00:00Z',
    });
  }

  /**
   * Generates secure OAuth authorization URL.
   */
  public generateAuthorizationUrl(organizationId: string, redirectUri?: string): { url: string; state: string } {
    const state = crypto.randomBytes(24).toString('hex');
    this.oauthStates.set(state, { organizationId, createdAt: Date.now() });

    // Clean old states (> 15 mins)
    const now = Date.now();
    for (const [key, val] of this.oauthStates.entries()) {
      if (now - val.createdAt > 15 * 60 * 1000) {
        this.oauthStates.delete(key);
      }
    }

    const appId = process.env.META_APP_ID || '109283746592819';
    const callbackUrl = redirectUri || process.env.META_REDIRECT_URI || 'https://adscalezen.online/api/integrations/meta/callback';
    const scopeParam = encodeURIComponent(this.REQUIRED_SCOPES.join(','));

    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&state=${state}&scope=${scopeParam}&response_type=code`;

    return { url, state };
  }

  /**
   * Handles OAuth Callback with code and state.
   */
  public async handleOAuthCallback(code: string, state: string): Promise<MetaConnectionState> {
    const stateRecord = this.oauthStates.get(state);
    if (!stateRecord) {
      throw new Error('Invalid or expired OAuth state parameter.');
    }

    const orgId = stateRecord.organizationId;
    this.oauthStates.delete(state);

    // In production: exchange code with Meta graph API:
    // https://graph.facebook.com/v19.0/oauth/access_token?client_id=...&client_secret=...&code=...

    const connection: MetaConnectionState = {
      organizationId: orgId,
      provider: 'META',
      status: 'CONNECTED',
      externalUserId: `meta_usr_${Date.now().toString().slice(-6)}`,
      accessTokenEncrypted: 'enc_token_' + crypto.randomBytes(16).toString('hex'),
      tokenExpiresAt: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
      scopes: this.REQUIRED_SCOPES,
      businesses: [
        {
          id: `biz_${Date.now()}`,
          name: 'ADSCALE Enterprise Business',
          verificationStatus: 'VERIFIED',
        },
      ],
      whatsapp: {
        wabaId: `waba_${Date.now()}`,
        name: 'ADSCALE ZEN Verified WhatsApp',
        currency: 'USD',
        timezone: 'UTC',
        phoneNumbers: [
          {
            phoneNumberId: `phone_${Date.now()}`,
            displayPhoneNumber: '+1 (555) 728-1920',
            verifiedName: 'ADSCALE Enterprise Support',
            qualityRating: 'GREEN',
            messagingLimit: 'TIER_10K',
            status: 'CONNECTED',
          },
        ],
      },
      connectedPagesCount: 1,
      connectedInstagramCount: 1,
      connectedAt: new Date().toISOString(),
    };

    this.connections.set(orgId, connection);

    // Connect pages & instagram
    await metaPageService.connectPage(orgId, '109283748291029');
    await instagramService.connectAccount(orgId, '17841400293810293');

    return connection;
  }

  public getConnectionStatus(organizationId: string): MetaConnectionState {
    const conn = this.connections.get(organizationId);
    if (!conn) {
      return {
        organizationId,
        provider: 'META',
        status: 'NOT_CONNECTED',
        scopes: this.REQUIRED_SCOPES,
        businesses: [],
        whatsapp: null,
        connectedPagesCount: 0,
        connectedInstagramCount: 0,
      };
    }
    return conn;
  }

  public disconnect(organizationId: string): boolean {
    this.connections.delete(organizationId);
    return true;
  }

  public connectDemoMode(organizationId: string): MetaConnectionState {
    const conn: MetaConnectionState = {
      organizationId,
      provider: 'META',
      status: 'CONNECTED',
      externalUserId: 'meta_usr_demo_83921',
      scopes: this.REQUIRED_SCOPES,
      businesses: [
        {
          id: 'biz_demo_39281',
          name: 'ADSCALE ZEN Global Enterprise',
          verificationStatus: 'VERIFIED',
        },
      ],
      whatsapp: {
        wabaId: 'waba_demo_93810',
        name: 'ADSCALE ZEN Official WhatsApp',
        currency: 'USD',
        timezone: 'America/New_York',
        phoneNumbers: [
          {
            phoneNumberId: 'phone_demo_29381',
            displayPhoneNumber: '+1 (555) 382-9901',
            verifiedName: 'ADSCALE ZEN Verified Assistant',
            qualityRating: 'GREEN',
            messagingLimit: 'TIER_10K',
            status: 'CONNECTED',
          },
        ],
      },
      connectedPagesCount: 2,
      connectedInstagramCount: 1,
      connectedAt: new Date().toISOString(),
    };

    this.connections.set(organizationId, conn);
    metaPageService.connectPage(organizationId, '109283748291029');
    instagramService.connectAccount(organizationId, '17841400293810293');
    return conn;
  }
}

export const metaOAuthService = new MetaOAuthService();
