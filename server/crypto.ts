import crypto from 'crypto';

// 32-byte key derived from ENCRYPTION_KEY or fallback secure secret for local dev
const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const KEY = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
const ALGORITHM = 'aes-256-gcm';

export interface EncryptedPayload {
  iv: string;
  tag: string;
  ciphertext: string;
}

/**
 * Encrypt sensitive tokens (e.g. Meta WABA System User Access Tokens) at rest using AES-256-GCM.
 */
export function encryptToken(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  // Format: iv:tag:ciphertext
  return `${iv.toString('hex')}:${tag}:${ciphertext}`;
}

/**
 * Decrypt sensitive token stored at rest.
 */
export function decryptToken(encryptedString: string): string {
  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, tagHex, ciphertext] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);

  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  return plaintext;
}

/**
 * Mask token for display (e.g., EAAJ...4x9Z) to prevent frontend leakage.
 */
export function maskSecret(secret: string): string {
  if (!secret || secret.length < 8) return '••••••••';
  return `${secret.slice(0, 4)}••••${secret.slice(-4)}`;
}
