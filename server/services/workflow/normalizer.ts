export type ChannelType = 'whatsapp' | 'facebook' | 'instagram' | 'webhook' | 'manual_test';
export type NormalizedEventType = 'INCOMING_MESSAGE' | 'KEYWORD_RECEIVED' | 'NEW_CONTACT' | 'WEBHOOK_EVENT' | 'CAMPAIGN_EVENT';

export interface NormalizedEvent {
  eventId: string;
  provider: 'meta' | 'webhook' | 'api' | 'manual';
  channel: ChannelType;
  eventType: NormalizedEventType;
  organizationId: string;
  externalAccountId?: string;
  contactId?: string;
  conversationId?: string;
  contactPhone: string;
  contactName?: string;
  contactEmail?: string;
  messageText: string;
  externalMessageId?: string;
  mediaUrl?: string;
  mediaType?: string;
  buttonPayload?: string;
  timestamp: string;
  rawPayload?: any;
}

/**
 * Normalizes WhatsApp webhook payload into a standard NormalizedEvent.
 */
export function normalizeWhatsAppPayload(
  organizationId: string,
  entry: any
): NormalizedEvent[] {
  const events: NormalizedEvent[] = [];

  try {
    const changes = entry?.changes || [];
    for (const change of changes) {
      if (change.field === 'messages') {
        const value = change.value;
        const contacts = value?.contacts || [];
        const messages = value?.messages || [];
        const metadata = value?.metadata;

        for (const msg of messages) {
          const contact = contacts.find((c: any) => c.wa_id === msg.from);
          let messageText = '';

          if (msg.type === 'text') {
            messageText = msg.text?.body || '';
          } else if (msg.type === 'button') {
            messageText = msg.button?.text || msg.button?.payload || '';
          } else if (msg.type === 'interactive') {
            messageText =
              msg.interactive?.button_reply?.title ||
              msg.interactive?.list_reply?.title ||
              '';
          }

          events.push({
            eventId: msg.id || `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            provider: 'meta',
            channel: 'whatsapp',
            eventType: 'INCOMING_MESSAGE',
            organizationId,
            externalAccountId: metadata?.phone_number_id,
            contactPhone: msg.from || '',
            contactName: contact?.profile?.name || 'WhatsApp Customer',
            messageText,
            externalMessageId: msg.id,
            timestamp: new Date().toISOString(),
            rawPayload: msg,
          });
        }
      }
    }
  } catch (err) {
    console.error('❌ [Normalizer] Error normalizing WhatsApp event:', err);
  }

  return events;
}

/**
 * Normalizes Facebook Page Messenger event.
 */
export function normalizeFacebookPagePayload(
  organizationId: string,
  entry: any
): NormalizedEvent[] {
  const events: NormalizedEvent[] = [];
  try {
    const messaging = entry?.messaging || [];
    for (const msg of messaging) {
      if (msg.message && !msg.message.is_echo) {
        events.push({
          eventId: msg.message.mid || `fb_${Date.now()}`,
          provider: 'meta',
          channel: 'facebook',
          eventType: 'INCOMING_MESSAGE',
          organizationId,
          externalAccountId: entry.id,
          contactPhone: msg.sender?.id || '',
          contactName: `Facebook User ${msg.sender?.id?.slice(-4) || ''}`,
          messageText: msg.message.text || '',
          externalMessageId: msg.message.mid,
          timestamp: new Date().toISOString(),
          rawPayload: msg,
        });
      }
    }
  } catch (err) {
    console.error('❌ [Normalizer] Error normalizing Facebook event:', err);
  }
  return events;
}

/**
 * Normalizes Instagram Direct Message event.
 */
export function normalizeInstagramPayload(
  organizationId: string,
  entry: any
): NormalizedEvent[] {
  const events: NormalizedEvent[] = [];
  try {
    const messaging = entry?.messaging || [];
    for (const msg of messaging) {
      if (msg.message && !msg.message.is_echo) {
        events.push({
          eventId: msg.message.mid || `ig_${Date.now()}`,
          provider: 'meta',
          channel: 'instagram',
          eventType: 'INCOMING_MESSAGE',
          organizationId,
          externalAccountId: entry.id,
          contactPhone: msg.sender?.id || '',
          contactName: `Instagram User @${msg.sender?.id?.slice(-4) || ''}`,
          messageText: msg.message.text || '',
          externalMessageId: msg.message.mid,
          timestamp: new Date().toISOString(),
          rawPayload: msg,
        });
      }
    }
  } catch (err) {
    console.error('❌ [Normalizer] Error normalizing Instagram event:', err);
  }
  return events;
}
