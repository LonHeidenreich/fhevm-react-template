/**
 * API type definitions for FHEVM SDK
 *
 * This module contains TypeScript type definitions for API requests,
 * responses, and error handling.
 */

import { FheType, EncryptedInput, DecryptionPermit } from './fhe';

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data?: T;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Error code if failed */
  errorCode?: string;
}

/**
 * Encryption API request
 */
export interface EncryptionRequest {
  /** Value to encrypt */
  value: number | bigint | boolean | string;
  /** FHE type */
  type: FheType;
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Encryption API response
 */
export interface EncryptionResponse extends ApiResponse<EncryptedInput> {
  /** Encryption timestamp */
  timestamp?: number;
}

/**
 * Decryption API request
 */
export interface DecryptionRequest {
  /** Encrypted handle */
  handle: bigint | string;
  /** Decryption permit */
  permit: DecryptionPermit;
  /** Expected type */
  type?: FheType;
}

/**
 * Decryption API response
 */
export interface DecryptionResponse extends ApiResponse {
  /** Decrypted value */
  value?: any;
  /** Value type */
  type?: FheType;
}

/**
 * Batch encryption request
 */
export interface BatchEncryptionRequest {
  /** Values to encrypt */
  values: Array<{
    value: any;
    type: FheType;
  }>;
}

/**
 * Batch encryption response
 */
export interface BatchEncryptionResponse extends ApiResponse {
  /** Encrypted inputs */
  encrypted?: EncryptedInput[];
}

/**
 * Batch decryption request
 */
export interface BatchDecryptionRequest {
  /** Handles to decrypt */
  handles: Array<bigint | string>;
  /** Decryption permit */
  permit: DecryptionPermit;
  /** Expected types */
  types?: FheType[];
}

/**
 * Batch decryption response
 */
export interface BatchDecryptionResponse extends ApiResponse {
  /** Decrypted values */
  values?: any[];
  /** Failed indices */
  failures?: number[];
}

/**
 * Permit request for EIP-712 signature
 */
export interface PermitSignatureRequest {
  /** Contract address */
  contract: string;
  /** User address */
  user: string;
  /** Optional chain ID */
  chainId?: number;
}

/**
 * Permit signature response
 */
export interface PermitSignatureResponse extends ApiResponse<DecryptionPermit> {
  /** Expiration timestamp */
  expiresAt?: number;
}

/**
 * Computation request for FHE operations
 */
export interface ComputationRequest {
  /** Operation type */
  operation: string;
  /** Operand handles */
  operands: Array<bigint | string>;
  /** Result type */
  resultType: FheType;
}

/**
 * Computation response
 */
export interface ComputationResponse extends ApiResponse {
  /** Result handle */
  resultHandle?: bigint | string;
  /** Gas used */
  gasUsed?: bigint;
}

/**
 * Key management API request
 */
export interface KeyManagementRequest {
  /** Action type */
  action: 'generate' | 'rotate' | 'revoke';
  /** Key identifier */
  keyId?: string;
}

/**
 * Key management API response
 */
export interface KeyManagementResponse extends ApiResponse {
  /** Public key */
  publicKey?: string;
  /** Key identifier */
  keyId?: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /** Service status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Service version */
  version: string;
  /** Gateway status */
  gateway?: {
    available: boolean;
    latency?: number;
  };
  /** Network status */
  network?: {
    chainId: number;
    blockNumber: number;
  };
}

/**
 * Error details
 */
export interface ErrorDetails {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Additional details */
  details?: Record<string, any>;
  /** Stack trace (dev only) */
  stack?: string;
}

/**
 * SDK error codes
 */
export enum SdkErrorCode {
  /** Client not initialized */
  CLIENT_NOT_INITIALIZED = 'CLIENT_NOT_INITIALIZED',
  /** Invalid configuration */
  INVALID_CONFIG = 'INVALID_CONFIG',
  /** Encryption failed */
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  /** Decryption failed */
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  /** Invalid permit */
  INVALID_PERMIT = 'INVALID_PERMIT',
  /** Network error */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Contract error */
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  /** Validation error */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** User rejected */
  USER_REJECTED = 'USER_REJECTED',
  /** Rate limit exceeded */
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  /** Unsupported operation */
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
}

/**
 * SDK error class
 */
export class SdkError extends Error {
  code: SdkErrorCode;
  details?: Record<string, any>;

  constructor(code: SdkErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'SdkError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  /** Transaction pending */
  PENDING = 'pending',
  /** Transaction confirmed */
  CONFIRMED = 'confirmed',
  /** Transaction failed */
  FAILED = 'failed',
  /** Transaction reverted */
  REVERTED = 'reverted',
}

/**
 * Transaction result
 */
export interface TransactionResult {
  /** Transaction hash */
  hash: string;
  /** Transaction status */
  status: TransactionStatus;
  /** Block number */
  blockNumber?: number;
  /** Gas used */
  gasUsed?: bigint;
  /** Logs */
  logs?: any[];
  /** Error if failed */
  error?: string;
}

/**
 * Gateway status
 */
export interface GatewayStatus {
  /** Gateway availability */
  available: boolean;
  /** Gateway URL */
  url: string;
  /** Latency in ms */
  latency?: number;
  /** Last checked timestamp */
  lastChecked: number;
}

/**
 * Network status
 */
export interface NetworkStatus {
  /** Chain ID */
  chainId: number;
  /** Network name */
  name: string;
  /** Current block number */
  blockNumber: number;
  /** Network healthy */
  healthy: boolean;
}
