/**
 * Encryption utilities for FHEVM
 *
 * This module provides functions to encrypt different types of values
 * for use in confidential smart contracts.
 */

import type { FhevmClient } from './client';

/**
 * Encrypted input for smart contracts
 */
export interface EncryptedInput {
  data: Uint8Array;
  signature: string;
}

/**
 * Encrypt a uint8 value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptUint8(client, 42);
 * await contract.submitValue(encrypted.data, encrypted.signature);
 * ```
 */
export async function encryptUint8(
  client: FhevmClient,
  value: number
): Promise<EncryptedInput> {
  if (value < 0 || value > 255) {
    throw new Error('Value must be between 0 and 255 for uint8');
  }

  const input = client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
  input.add8(value);
  return await input.encrypt();
}

/**
 * Encrypt a uint16 value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptUint16(client, 1000);
 * ```
 */
export async function encryptUint16(
  client: FhevmClient,
  value: number
): Promise<EncryptedInput> {
  if (value < 0 || value > 65535) {
    throw new Error('Value must be between 0 and 65535 for uint16');
  }

  const input = client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
  input.add16(value);
  return await input.encrypt();
}

/**
 * Encrypt a uint32 value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptUint32(client, 1000000);
 * ```
 */
export async function encryptUint32(
  client: FhevmClient,
  value: number
): Promise<EncryptedInput> {
  if (value < 0 || value > 4294967295) {
    throw new Error('Value must be between 0 and 4294967295 for uint32');
  }

  const input = client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
  input.add32(value);
  return await input.encrypt();
}

/**
 * Encrypt a uint64 value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptUint64(client, 1000000000n);
 * ```
 */
export async function encryptUint64(
  client: FhevmClient,
  value: bigint
): Promise<EncryptedInput> {
  if (value < 0n || value > 18446744073709551615n) {
    throw new Error('Value must be between 0 and 2^64-1 for uint64');
  }

  const input = client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
  input.add64(value);
  return await input.encrypt();
}

/**
 * Encrypt a boolean value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptBool(client, true);
 * ```
 */
export async function encryptBool(
  client: FhevmClient,
  value: boolean
): Promise<EncryptedInput> {
  const input = client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
  input.addBool(value);
  return await input.encrypt();
}

/**
 * Encrypt an Ethereum address
 *
 * @example
 * ```typescript
 * const encrypted = await encryptAddress(client, '0x1234...');
 * ```
 */
export async function encryptAddress(
  client: FhevmClient,
  address: string
): Promise<EncryptedInput> {
  if (!address.startsWith('0x') || address.length !== 42) {
    throw new Error('Invalid Ethereum address format');
  }

  const input = client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
  input.addAddress(address);
  return await input.encrypt();
}

/**
 * Encrypt a value with automatic type detection
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt(client, 42); // Auto-detects uint8
 * ```
 */
export async function encrypt(
  client: FhevmClient,
  value: number | bigint | boolean | string
): Promise<EncryptedInput> {
  // Boolean
  if (typeof value === 'boolean') {
    return encryptBool(client, value);
  }

  // Address
  if (typeof value === 'string' && value.startsWith('0x')) {
    return encryptAddress(client, value);
  }

  // Numeric types
  if (typeof value === 'bigint') {
    return encryptUint64(client, value);
  }

  if (typeof value === 'number') {
    if (value >= 0 && value <= 255) {
      return encryptUint8(client, value);
    } else if (value >= 0 && value <= 65535) {
      return encryptUint16(client, value);
    } else if (value >= 0 && value <= 4294967295) {
      return encryptUint32(client, value);
    } else {
      throw new Error('Number value out of range for uint32, use bigint for uint64');
    }
  }

  throw new Error(`Unsupported value type for encryption: ${typeof value}`);
}

/**
 * Create encrypted input builder for batch operations
 *
 * @example
 * ```typescript
 * const builder = createEncryptedInputBuilder(client);
 * builder.add8(42);
 * builder.add16(1000);
 * builder.addBool(true);
 * const encrypted = await builder.encrypt();
 * ```
 */
export function createEncryptedInputBuilder(client: FhevmClient) {
  return client.instance.createEncryptedInput(
    client.network.aclAddress,
    client.address!
  );
}

/**
 * Supported FHE types
 */
export type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

/**
 * Get encryption function for specific FHE type
 */
export function getEncryptionFunction(type: FheType) {
  const functions = {
    uint8: encryptUint8,
    uint16: encryptUint16,
    uint32: encryptUint32,
    uint64: encryptUint64,
    bool: encryptBool,
    address: encryptAddress,
  };

  return functions[type];
}
