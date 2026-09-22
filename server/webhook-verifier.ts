import crypto from 'crypto';

// In-memory set for event idempotency (prevents duplicate execution of webhooks)
const processedEventIds = new Set<string>();
const MAX_IDEMPOTENCY_CACHE = 10000;

export function verifyMetaSignature(rawBody: string, signatureHeader?: string, appSecret?: string): boolean {
  const secret = appSecret || process.env.META_APP_SECRET || 'dev_meta_app_secret';
  
  // If no header provided in development mode, allow controlled dev pass-through with warning
  if (!signatureHeader) {
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    return false;
  }

  // Format: sha256=<hash>
  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  const incomingBuffer = Buffer.from(parts[1], 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (incomingBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(incomingBuffer, expectedBuffer);
}

/**
 * Check if a webhook event ID has already been processed to guarantee idempotency.
 */
export function isEventProcessed(eventId: string): boolean {
  return processedEventIds.has(eventId);
}

/**
 * Mark a webhook event as processed.
 */
export function markEventProcessed(eventId: string): void {
  if (processedEventIds.size >= MAX_IDEMPOTENCY_CACHE) {
    // Clear oldest items to avoid unbounded memory
    const iterator = processedEventIds.values();
    for (let i = 0; i < 2000; i++) {
      const item = iterator.next();
      if (item.done) break;
      processedEventIds.delete(item.value);
    }
  }
  processedEventIds.add(eventId);
}
