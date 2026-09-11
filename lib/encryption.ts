import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'socialone_byoai_default_secret_key_2026';

/**
 * Encrypts a plain API key string using AES encryption.
 */
export function encryptApiKey(plainKey: string): string {
  if (!plainKey) return '';
  return CryptoJS.AES.encrypt(plainKey, SECRET_KEY).toString();
}

/**
 * Decrypts an encrypted API key back to its original plain text.
 */
export function decryptApiKey(cipherText: string): string {
  if (!cipherText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || cipherText; // Fallback if plain text was stored
  } catch (error) {
    console.error('Failed to decrypt API key:', error);
    return '';
  }
}

/**
 * Masks an API key for safe display in UI (e.g. sk-proj-...3a8F).
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return '';
  if (apiKey.length <= 8) return '••••••••';
  return `${apiKey.substring(0, 7)}••••••••${apiKey.substring(apiKey.length - 4)}`;
}
