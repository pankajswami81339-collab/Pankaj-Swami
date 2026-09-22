export interface InstagramAccountRecord {
  id: string;
  instagramId: string;
  username: string;
  name: string;
  profilePictureUrl?: string;
  followersCount?: number;
  isConnected: boolean;
  connectedAt?: string;
}

export class InstagramService {
  private accounts: Map<string, InstagramAccountRecord[]> = new Map();

  constructor() {
    this.accounts.set('org_nexus_ecommerce', [
      {
        id: 'ig_adscale_zen',
        instagramId: '17841400293810293',
        username: 'adscale.zen',
        name: 'ADSCALE ZEN Official',
        followersCount: 28900,
        isConnected: false,
      },
    ]);
  }

  public async getAccounts(organizationId: string): Promise<InstagramAccountRecord[]> {
    return this.accounts.get(organizationId) || [];
  }

  public async connectAccount(organizationId: string, instagramId: string): Promise<InstagramAccountRecord | null> {
    const list = this.accounts.get(organizationId) || [];
    const target = list.find((a) => a.instagramId === instagramId);
    if (!target) return null;

    target.isConnected = true;
    target.connectedAt = new Date().toISOString();
    return target;
  }

  public async disconnectAccount(organizationId: string, instagramId: string): Promise<boolean> {
    const list = this.accounts.get(organizationId) || [];
    const target = list.find((a) => a.instagramId === instagramId);
    if (!target) return false;

    target.isConnected = false;
    return true;
  }

  public async handleWebhook(organizationId: string, payload: any): Promise<void> {
    console.log(`[InstagramService] Ingested Instagram Direct message for org ${organizationId}:`, payload?.id);
  }
}

export const instagramService = new InstagramService();
