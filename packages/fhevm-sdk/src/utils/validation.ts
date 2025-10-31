/**
 * Validation utilities for FHEVM SDK
 *
 * This module provides validation functions for FHE types, ranges,
 * and data integrity checks.
 */

import { FheType } from '../types/fhe';

/**
 * FHE type ranges
 */
export const FHE_RANGES = {
  uint8: { min: 0n, max: 255n },
  uint16: { min: 0n, max: 65535n },
  uint32: { min: 0n, max: 4294967295n },
  uint64: { min: 0n, max: 18446744073709551615n },
  bool: { min: 0n, max: 1n },
} as const;

/**
 * Validate value is within range for FHE type
 */
export function validateFheValue(value: number | bigint | boolean, type: FheType): void {
  if (type === 'bool') {
    if (typeof value !== 'boolean' && value !== 0 && value !== 1) {
      throw new Error('Boolean value must be true, false, 0, or 1');
    }
    return;
  }

  if (type === 'address') {
    if (typeof value !== 'string') {
      throw new Error('Address value must be a string');
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      throw new Error('Invalid Ethereum address format');
    }
    return;
  }

  const bigValue = BigInt(value);
  const range = FHE_RANGES[type as keyof typeof FHE_RANGES];

  if (!range) {
    throw new Error(`Unknown FHE type: ${type}`);
  }

  if (bigValue < range.min || bigValue > range.max) {
    throw new Error(
      `Value ${bigValue} out of range for ${type} (${range.min} - ${range.max})`
    );
  }
}

/**
 * Infer FHE type from value
 */
export function inferFheType(value: number | bigint | boolean | string): FheType {
  if (typeof value === 'boolean') {
    return 'bool';
  }

  if (typeof value === 'string') {
    if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return 'address';
    }
    throw new Error('String value must be a valid Ethereum address');
  }

  const bigValue = BigInt(value);

  if (bigValue < 0n) {
    throw new Error('Negative values are not supported');
  }

  if (bigValue <= FHE_RANGES.uint8.max) return 'uint8';
  if (bigValue <= FHE_RANGES.uint16.max) return 'uint16';
  if (bigValue <= FHE_RANGES.uint32.max) return 'uint32';
  if (bigValue <= FHE_RANGES.uint64.max) return 'uint64';

  throw new Error('Value too large for supported FHE types');
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(config: any): void {
  if (!config) {
    throw new Error('Network configuration is required');
  }

  if (typeof config.chainId !== 'number' || config.chainId <= 0) {
    throw new Error('Invalid chainId');
  }

  if (typeof config.rpcUrl !== 'string' || !config.rpcUrl.startsWith('http')) {
    throw new Error('Invalid RPC URL');
  }

  if (typeof config.gatewayUrl !== 'string' || !config.gatewayUrl.startsWith('http')) {
    throw new Error('Invalid gateway URL');
  }

  if (typeof config.aclAddress !== 'string' || !config.aclAddress.startsWith('0x')) {
    throw new Error('Invalid ACL address');
  }
}

/**
 * Validate encrypted input structure
 */
export function validateEncryptedInput(input: any): void {
  if (!input) {
    throw new Error('Encrypted input is required');
  }

  if (!(input.data instanceof Uint8Array)) {
    throw new Error('Encrypted data must be Uint8Array');
  }

  if (input.data.length === 0) {
    throw new Error('Encrypted data cannot be empty');
  }

  if (typeof input.signature !== 'string' || input.signature.length === 0) {
    throw new Error('Signature is required');
  }
}

/**
 * Validate permit options
 */
export function validatePermitOptions(options: any): void {
  if (!options) {
    throw new Error('Permit options are required');
  }

  if (typeof options.contract !== 'string' || !options.contract.startsWith('0x')) {
    throw new Error('Invalid contract address');
  }

  if (options.user && (typeof options.user !== 'string' || !options.user.startsWith('0x'))) {
    throw new Error('Invalid user address');
  }
}

/**
 * Validate decryption permit
 */
export function validateDecryptionPermit(permit: any): void {
  if (!permit) {
    throw new Error('Decryption permit is required');
  }

  if (typeof permit.signature !== 'string' || permit.signature.length === 0) {
    throw new Error('Permit signature is required');
  }

  if (typeof permit.publicKey !== 'string' || permit.publicKey.length === 0) {
    throw new Error('Permit public key is required');
  }
}

/**
 * Validate encrypted handle
 */
export function validateEncryptedHandle(handle: any): bigint {
  if (handle === null || handle === undefined) {
    throw new Error('Encrypted handle is required');
  }

  try {
    return BigInt(handle);
  } catch {
    throw new Error('Invalid encrypted handle format');
  }
}

/**
 * Validate batch of handles
 */
export function validateHandleBatch(handles: any[]): bigint[] {
  if (!Array.isArray(handles)) {
    throw new Error('Handles must be an array');
  }

  if (handles.length === 0) {
    throw new Error('Handle array cannot be empty');
  }

  return handles.map((handle, index) => {
    try {
      return validateEncryptedHandle(handle);
    } catch (error) {
      throw new Error(`Invalid handle at index ${index}: ${error}`);
    }
  });
}

/**
 * Sanitize and validate contract ABI
 */
export function validateContractABI(abi: any): void {
  if (!Array.isArray(abi)) {
    throw new Error('Contract ABI must be an array');
  }

  if (abi.length === 0) {
    throw new Error('Contract ABI cannot be empty');
  }
}

/**
 * Validate transaction parameters
 */
export function validateTxParams(params: any): void {
  if (!params) {
    throw new Error('Transaction parameters are required');
  }

  if (params.value !== undefined && typeof params.value !== 'bigint' && typeof params.value !== 'string') {
    throw new Error('Transaction value must be bigint or string');
  }

  if (params.gasLimit !== undefined && typeof params.gasLimit !== 'bigint' && typeof params.gasLimit !== 'number') {
    throw new Error('Gas limit must be bigint or number');
  }
}
