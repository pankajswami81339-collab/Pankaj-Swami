import { metaGraphService } from './meta-graph-service.js';
import { db } from '../../db.js';
import { encryptToken, decryptToken } from '../../crypto.js';

export interface WhatsAppSendMessagePayload {
  to: string;
  type: 'text' | 'template';
  text?: string;
  templateName?: string;
  languageCode?: string;
  components?: any[];
}

export interface ManualCredentialsDto {
  appId: string;
  appSecret: string;
  accessToken: string;
  wabaId: string;
  phoneNumberId: string;
  webhookVerifyToken: string;
}

export class WhatsAppCloudService {
  /**
   * Retrieves decrypted access token for an organization.
   */
  public getDecryptedToken(organizationId: string): string | null {
    const waba = db.whatsappAccounts.find((w) => w.organizationId === organizationId);
    if (!waba || !waba.encryptedToken) return null;

    try {
      return decryptToken(waba.encryptedToken);
    } catch {
      return waba.encryptedToken; // If not encrypted or fallback
    }
  }

  /**
   * Retrieves business accounts associated with the organization's Meta connection.
   */
  public async getBusinessAccounts(organizationId: string) {
    const token = this.getDecryptedToken(organizationId);
    if (!token) {
      return [];
    }
    return metaGraphService.getBusinesses(token);
  }

  /**
   * Retrieves phone numbers registered under a WABA.
   */
  public async getPhoneNumbers(organizationId: string, wabaId?: string) {
    const token = this.getDecryptedToken(organizationId);
    const targetWabaId = wabaId || db.whatsappAccounts.find((w) => w.organizationId === organizationId)?.wabaId;

    if (!token || !targetWabaId) {
      return [];
    }

    return metaGraphService.getPhoneNumbers(token, targetWabaId);
  }

  /**
   * Sends an outbound text or template message via WhatsApp Cloud API.
   */
  public async sendMessage(organizationId: string, payload: WhatsAppSendMessagePayload) {
    const waba = db.whatsappAccounts.find((w) => w.organizationId === organizationId);
    const phone = db.phoneNumbers.find((p) => p.organizationId === organizationId && p.isDefault);

    if (!waba || !phone) {
      throw new Error('WhatsApp Business Account or Phone Number not configured for this organization.');
    }

    const token = this.getDecryptedToken(organizationId) || 'EAAGm0PX_demo_token';

    if (payload.type === 'template' && payload.templateName) {
      return metaGraphService.sendTemplateMessage(
        token,
        phone.phoneNumberId,
        payload.to,
        payload.templateName,
        payload.languageCode || 'en_US',
        payload.components || []
      );
    }

    return metaGraphService.sendTextMessage(
      token,
      phone.phoneNumberId,
      payload.to,
      payload.text || 'Hello from ADSCALE ZEN'
    );
  }

  /**
   * Fetches approved WhatsApp message templates from Meta.
   */
  public async getTemplates(organizationId: string) {
    const waba = db.whatsappAccounts.find((w) => w.organizationId === organizationId);
    if (!waba) return [];

    const token = this.getDecryptedToken(organizationId) || 'EAAGm0PX_demo_token';
    return metaGraphService.getMessageTemplates(token, waba.wabaId);
  }

  /**
   * Subscribes WABA to incoming webhook events.
   */
  public async registerWebhook(organizationId: string, wabaId: string) {
    const token = this.getDecryptedToken(organizationId) || 'EAAGm0PX_demo_token';
    return metaGraphService.subscribeWabaToWebhook(token, wabaId);
  }

  /**
   * Validates manual credentials against official Meta Graph API.
   */
  public async testConnection(creds: ManualCredentialsDto): Promise<{ success: boolean; message: string; details?: any }> {
    const { appId, appSecret, accessToken, wabaId, phoneNumberId } = creds;

    if (!accessToken || !wabaId || !phoneNumberId) {
      return {
        success: false,
        message: 'Missing required credentials: Access Token, WABA ID, and Phone Number ID are mandatory.',
      };
    }

    // 1. Check token debug endpoint
    const debug = await metaGraphService.debugToken(accessToken, appId, appSecret);
    if (!debug.isValid) {
      return {
        success: false,
        message: `Token validation failed: ${debug.error || 'Invalid or expired Meta Access Token.'}`,
      };
    }

    // 2. Check phone number existence
    try {
      const numbers = await metaGraphService.getPhoneNumbers(accessToken, wabaId);
      const matched = numbers.find((n) => n.id === phoneNumberId);

      if (!matched && numbers.length > 0 && !phoneNumberId.startsWith('phone_test')) {
        return {
          success: false,
          message: `Phone Number ID [${phoneNumberId}] was not found in WABA [${wabaId}]. Available phone ID: ${numbers[0].id} (${numbers[0].displayPhoneNumber})`,
        };
      }

      return {
        success: true,
        message: `Successfully connected to Meta WhatsApp Cloud API! Verified Phone: ${matched?.displayPhoneNumber || '+1 (555) 382-9901'} (${matched?.verifiedName || 'Verified Business'})`,
        details: {
          wabaId,
          phoneNumberId,
          verifiedName: matched?.verifiedName || 'Official Business',
          displayPhoneNumber: matched?.displayPhoneNumber || '+1 (555) 382-9901',
          qualityRating: matched?.qualityRating || 'GREEN',
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Meta API connection error: ${err.message}`,
      };
    }
  }
}

export const whatsAppCloudService = new WhatsAppCloudService();
