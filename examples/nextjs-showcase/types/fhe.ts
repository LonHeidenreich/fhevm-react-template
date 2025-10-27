/**
 * Global Type Definitions for FHE
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export type ComputationOperation = 'add' | 'subtract' | 'multiply' | 'compare';

export interface EncryptedValue {
  data: string;
  signature: string;
  type: FHEDataType;
  timestamp: string;
}

export interface DecryptionPermit {
  signature: string;
  publicKey: string;
  contractAddress: string;
  expiresAt?: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey?: string;
  keyId: string;
  algorithm: string;
  createdAt: string;
}

export interface FHEConfig {
  network: string;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface EncryptionResult {
  success: boolean;
  encrypted?: EncryptedValue;
  error?: string;
}

export interface DecryptionResult {
  success: boolean;
  decrypted?: {
    value: string;
    handle: string;
    timestamp: string;
  };
  error?: string;
}

export interface ComputationResult {
  success: boolean;
  computation?: {
    operation: string;
    encryptedResult: string;
    operandCount: number;
    timestamp: string;
  };
  error?: string;
}
