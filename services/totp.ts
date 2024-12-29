import * as Crypto from "expo-crypto";
import base32 from "base32-encode";
import CryptoJS from "crypto-js";

// Base32 decode function
function base32ToHex(base32Str: string): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  
  // Convert each base32 character to 5 bits
  for (let i = 0; i < base32Str.length; i++) {
    const val = base32Chars.indexOf(base32Str.charAt(i).toUpperCase());
    if (val === -1) continue; // Skip non-base32 chars
    bits += val.toString(2).padStart(5, '0');
  }
  
  // Convert bits to hex
  let hex = '';
  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substring(i, i + 4);
    hex += parseInt(chunk, 2).toString(16);
  }
  return hex;
}

// Generate a new secret
export async function generateSecret(): Promise<string> {
  // Generate 20 random bytes (160 bits) for SHA1 HMAC
  const randomBytes = await Crypto.getRandomBytesAsync(20);
  // Convert to base32 for standard TOTP secret format
  return base32(randomBytes, 'RFC4648-HEX', { padding: false });
}

// Generate TOTP code
export function generateTotp(secret: string): string {
  const timeStep = 30; // 30 seconds
  const t = Math.floor(Date.now() / 1000 / timeStep);
  
  // Convert counter to bytes
  const timeHex = t.toString(16).padStart(16, '0');
  
  // Calculate HMAC
  const hmac = CryptoJS.HmacSHA1(
    CryptoJS.enc.Hex.parse(timeHex),
    CryptoJS.enc.Hex.parse(base32ToHex(secret))
  );
  
  const hmacHex = hmac.toString(CryptoJS.enc.Hex);
  
  // TODO: check and fix this if not working as expected
  
  // Get offset
  const offset = parseInt(hmacHex.slice(-1), 16);
  
  // Generate 4-byte code starting from offset
  const code = parseInt(hmacHex.substring(offset * 2, 8), 16) & 0x7fffffff;
  
  // Get 6 digits
  return (code % 1000000).toString().padStart(6, '0');
}

// Generate passphrase
export function generatePassphrase(totp: number): string {
  const adjectives = require("../assets/adjectives.json").adjectives;
  const nouns = require("../assets/nouns.json").nouns;

  const adjectiveIndex = totp % adjectives.length;
  const remaining = Math.floor(totp / adjectives.length);
  const nounIndex = remaining % nouns.length;

  // Combine words
  return `${adjectives[adjectiveIndex]} ${nouns[nounIndex]}`;
}

// Validate TOTP code with a 30-second window
export function validateTotp(token: string, secret: string): boolean {
  const currentCode = generateTotp(secret);
  return token === currentCode;
}
