/**
 * API Type Definitions
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionRequest {
  value: any;
  type?: string;
}

export interface DecryptionRequest {
  encryptedHandle: string;
  permit: {
    signature: string;
    publicKey: string;
  };
  contractAddress: string;
}

export interface ComputationRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: string[];
}

export interface KeyGenerationRequest {
  operation: 'generate' | 'validate' | 'retrieve';
  address?: string;
  publicKey?: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
}
