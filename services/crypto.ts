import CryptoJS from "crypto-js";

export function generateSecret(): string {
  // Return a Base64 or hex representation of random bytes
  // Implementation depends on environment (Expo Random, etc.)
  return 'RANDOM_32BYTE_VALUE';
}

export function getHourlyHash(secret: string): number {
  const hourIndex = Math.floor(Date.now() / (1000 * 3600)); // or use UTC logic
  const hmac = CryptoJS.HmacSHA256(hourIndex.toString(), secret);
  // e.g. take first 8 hex chars => parseInt
  const codeInt = parseInt(hmac.toString(CryptoJS.enc.Hex).substring(0, 8), 16);
  return codeInt;
}
