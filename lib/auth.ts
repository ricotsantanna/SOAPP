import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.ENCRYPTION_SECRET || 'socialone_jwt_secret_key_2026';

/**
 * Hashes a plain password using SHA-256 + salt.
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(`socialone_salt_${password}`).toString();
}

/**
 * Verifies if a plain password matches the stored hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;
  return hashPassword(password) === storedHash;
}

/**
 * Simple token generator for user sessions.
 */
export function createSessionToken(userId: number, email: string, role: 'admin' | 'user'): string {
  const payload = {
    userId,
    email,
    role,
    exp: Date.now() + 86400000 * 7, // 7 days
  };
  return CryptoJS.AES.encrypt(JSON.stringify(payload), JWT_SECRET).toString();
}

/**
 * Verifies and decodes a session token.
 */
export function verifySessionToken(token: string): { userId: number; email: string; role: 'admin' | 'user' } | null {
  try {
    const bytes = CryptoJS.AES.decrypt(token, JWT_SECRET);
    const decoded = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    if (decoded && decoded.exp > Date.now()) {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}
