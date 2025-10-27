/**
 * Type Definitions for FHE Operations
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

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

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: string[];
}

export interface ComputationResult {
  operation: string;
  encryptedResult: string;
  operandCount: number;
  timestamp: string;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}

export interface FHEResponse<T = any> {
  success: boolean;
  data?: T;
  error?: FHEError;
}

export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl: string;
  aclAddress: string;
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    gatewayUrl: 'https://gateway.fhe.dev',
    aclAddress: '0x0000000000000000000000000000000000000000',
  },
  local: {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:8080',
    aclAddress: '0x0000000000000000000000000000000000000000',
  },
};

export interface EncryptionOptions {
  type?: FHEDataType;
  compress?: boolean;
}

export interface DecryptionOptions {
  verify?: boolean;
  timeout?: number;
}
