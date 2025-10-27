/**
 * Security Utilities for FHE Operations
 */

/**
 * Validate input data before encryption
 */
export function validateInput(value: any, type: string): boolean {
  switch (type) {
    case 'uint8':
      return Number.isInteger(value) && value >= 0 && value <= 255;
    case 'uint16':
      return Number.isInteger(value) && value >= 0 && value <= 65535;
    case 'uint32':
      return Number.isInteger(value) && value >= 0 && value <= 4294967295;
    case 'uint64':
      return typeof value === 'bigint' || (Number.isInteger(value) && value >= 0);
    case 'bool':
      return typeof value === 'boolean';
    case 'address':
      return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
    default:
      return false;
  }
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Check if a permit has expired
 */
export function isPermitExpired(permit: any): boolean {
  if (!permit.expiresAt) {
    return false;
  }
  return new Date(permit.expiresAt) < new Date();
}

/**
 * Generate a secure random nonce
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Node.js environment
    const crypto = require('crypto');
    crypto.randomFillSync(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Filter out old requests
    const recentRequests = requests.filter(time => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      return true;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return false;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

/**
 * Validate permit signature (placeholder)
 */
export function validatePermitSignature(permit: any, message: string): boolean {
  // In a real implementation, this would verify the cryptographic signature
  return permit && permit.signature && permit.publicKey;
}

/**
 * Hash data for integrity verification
 */
export async function hashData(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js environment
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

/**
 * Secure comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
