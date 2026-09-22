import { db } from '../../db.js';

export interface FacebookPageRecord {
  id: string;
  pageId: string;
  name: string;
  category: string;
  fanCount?: number;
  isConnected: boolean;
  connectedAt?: string;
}

export class MetaPageService {
  private pages: Map<string, FacebookPageRecord[]> = new Map();

  constructor() {
    // Seed default demo page for org
    this.pages.set('org_nexus_ecommerce', [
      {
        id: 'pg_adscale_growth',
        pageId: '109283748291029',
        name: 'ADSCALE Growth Solutions',
        category: 'Marketing Agency & Automation',
        fanCount: 14820,
        isConnected: false,
      },
      {
        id: 'pg_nexus_store',
        pageId: '204918274910283',
        name: 'Nexus Official Store',
        category: 'E-commerce & Retail',
        fanCount: 38400,
        isConnected: false,
      },
    ]);
  }

  public async getPages(organizationId: string): Promise<FacebookPageRecord[]> {
    return this.pages.get(organizationId) || [];
  }

  public async connectPage(organizationId: string, pageId: string): Promise<FacebookPageRecord | null> {
    const list = this.pages.get(organizationId) || [];
    const target = list.find((p) => p.pageId === pageId);
    if (!target) return null;

    target.isConnected = true;
    target.connectedAt = new Date().toISOString();
    return target;
  }

  public async disconnectPage(organizationId: string, pageId: string): Promise<boolean> {
    const list = this.pages.get(organizationId) || [];
    const target = list.find((p) => p.pageId === pageId);
    if (!target) return false;

    target.isConnected = false;
    return true;
  }

  public async handlePageWebhook(organizationId: string, payload: any): Promise<void> {
    console.log(`[MetaPageService] Ingested Facebook Page message for org ${organizationId}:`, payload?.id);
  }
}

export const metaPageService = new MetaPageService();
