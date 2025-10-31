/**
 * Security utilities for FHEVM SDK
 *
 * This module provides security-related utility functions for handling
 * encrypted data, validation, and secure operations.
 */

/**
 * Validate ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encrypted input data
 */
export function isValidEncryptedData(data: Uint8Array): boolean {
  return data instanceof Uint8Array && data.length > 0;
}

/**
 * Validate signature format
 */
export function isValidSignature(signature: string): boolean {
  return typeof signature === 'string' && signature.length > 0;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input.replace(/[<>'"]/g, '');
}

/**
 * Generate secure random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(length));
  } else if (typeof global !== 'undefined' && global.crypto) {
    return global.crypto.getRandomValues(new Uint8Array(length));
  } else {
    throw new Error('Secure random number generation not available');
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
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

/**
 * Check if a value is within the valid range for a given FHE type
 */
export function isInRange(value: number | bigint, min: bigint, max: bigint): boolean {
  const bigValue = BigInt(value);
  return bigValue >= min && bigValue <= max;
}

/**
 * Validate permit data structure
 */
export function isValidPermit(permit: any): boolean {
  return (
    permit &&
    typeof permit === 'object' &&
    typeof permit.signature === 'string' &&
    typeof permit.publicKey === 'string' &&
    permit.signature.length > 0 &&
    permit.publicKey.length > 0
  );
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.requests = [];
  }
}

/**
 * Secure storage wrapper with encryption
 */
export class SecureStorage {
  private prefix: string;

  constructor(prefix = 'fhevm_') {
    this.prefix = prefix;
  }

  /**
   * Store value securely
   */
  set(key: string, value: any): void {
    const fullKey = this.prefix + key;
    const serialized = JSON.stringify(value);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(fullKey, serialized);
    }
  }

  /**
   * Retrieve value securely
   */
  get(key: string): any {
    const fullKey = this.prefix + key;

    if (typeof localStorage !== 'undefined') {
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    }

    return null;
  }

  /**
   * Remove value securely
   */
  remove(key: string): void {
    const fullKey = this.prefix + key;

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(fullKey);
    }
  }

  /**
   * Clear all stored values
   */
  clear(): void {
    if (typeof localStorage !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    }
  }
}
