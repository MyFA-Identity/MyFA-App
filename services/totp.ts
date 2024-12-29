import * as Crypto from "expo-crypto";
import { Buffer } from 'buffer';
import base32Encode from "base32-encode";
import base32Decode from "base32-decode";
import hmac from 'crypto-js/hmac-sha256';
import { useTotpStore } from '../store/totpStore';

function dynamicTruncate(hmacBuf: Buffer): number {
  const offset = hmacBuf[hmacBuf.length - 1] & 0x0f;
  return (
    ((hmacBuf[offset] & 0x7f) << 24) |
    (hmacBuf[offset + 1] << 16) |
    (hmacBuf[offset + 2] << 8) |
    hmacBuf[offset + 3]
  );
}

export async function generateSecret(): Promise<string> {
  // Generate 32 random bytes (256 bits) for SHA256 HMAC
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  // Convert to base32 for standard TOTP secret format
  return base32Encode(randomBytes, 'RFC4648', { padding: false });
}

export async function generateTotp(secret: string): Promise<string> {
  const { config } = useTotpStore.getState();
  const counter = Math.floor(Date.now() / 1000 / config.timeStep);

  // 1. Build an 8-byte counter
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(counter));

  // 2. Decode key from Base32
  const keyBytes = Buffer.from(base32Decode(secret, 'RFC4648'));

  // 3. Compute HMAC (message=counterBuf, key=keyBytes)
  const hmacHex = hmac(counterBuf.toString('hex'), keyBytes.toString('hex')).toString();
  const hmacBuf = Buffer.from(hmacHex, 'hex');

  // 4. Dynamic truncation
  const truncated = dynamicTruncate(hmacBuf);
  const hotp = truncated % 10 ** config.digits;

  return hotp.toString().padStart(config.digits, '0');
}

// Generate passphrase
export function generatePassphrase(totp: string): string {
  const totpNumber = parseInt(totp);
  const adjectives = require("../assets/adjectives.json").adjectives;
  const nouns = require("../assets/nouns.json").nouns;

  const adjectiveIndex = totpNumber % adjectives.length;
  const remaining = Math.floor(totpNumber / adjectives.length);
  const nounIndex = remaining % nouns.length;

  // Combine words
  return `${adjectives[adjectiveIndex]} ${nouns[nounIndex]}`;
}

// Validate TOTP code with the time window
export async function validateTotp(token: string, secret: string): Promise<boolean> {
  const currentCode = await generateTotp(secret);
  return token === currentCode;
}
