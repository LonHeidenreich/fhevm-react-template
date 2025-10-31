/**
 * FHE-specific type definitions
 *
 * This module contains TypeScript type definitions for Fully Homomorphic
 * Encryption operations, data types, and structures.
 */

/**
 * Supported FHE data types
 */
export type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

/**
 * Encrypted input result from encryption operations
 */
export interface EncryptedInput {
  /** Encrypted data as byte array */
  data: Uint8Array;
  /** Signature for encrypted data */
  signature: string;
}

/**
 * Decryption permit for accessing encrypted data
 */
export interface DecryptionPermit {
  /** EIP-712 signature for decryption permission */
  signature: string;
  /** Public key used for permit */
  publicKey: string;
}

/**
 * Options for requesting decryption permit
 */
export interface PermitRequestOptions {
  /** Contract address containing encrypted data */
  contract: string;
  /** User address requesting decryption (optional, defaults to signer) */
  user?: string;
}

/**
 * FHE operation result with metadata
 */
export interface FheOperationResult<T = any> {
  /** Operation result value */
  value: T;
  /** Gas used for operation */
  gasUsed?: bigint;
  /** Transaction hash if applicable */
  transactionHash?: string;
}

/**
 * Encrypted handle reference for on-chain encrypted values
 */
export type EncryptedHandle = bigint | string;

/**
 * Batch encryption builder interface
 */
export interface EncryptedInputBuilder {
  /** Add uint8 value */
  add8(value: number): EncryptedInputBuilder;
  /** Add uint16 value */
  add16(value: number): EncryptedInputBuilder;
  /** Add uint32 value */
  add32(value: number): EncryptedInputBuilder;
  /** Add uint64 value */
  add64(value: bigint): EncryptedInputBuilder;
  /** Add boolean value */
  addBool(value: boolean): EncryptedInputBuilder;
  /** Add address value */
  addAddress(value: string): EncryptedInputBuilder;
  /** Finalize and encrypt all values */
  encrypt(): Promise<EncryptedInput>;
}

/**
 * FHE computation types
 */
export type FheComputationType =
  | 'add'
  | 'sub'
  | 'mul'
  | 'div'
  | 'and'
  | 'or'
  | 'xor'
  | 'not'
  | 'eq'
  | 'ne'
  | 'lt'
  | 'le'
  | 'gt'
  | 'ge'
  | 'shl'
  | 'shr';

/**
 * FHE computation request
 */
export interface FheComputationRequest {
  /** Type of computation */
  operation: FheComputationType;
  /** Operands for computation */
  operands: EncryptedHandle[];
  /** Result type */
  resultType: FheType;
}

/**
 * Encryption function type
 */
export type EncryptionFunction = (value: any) => Promise<EncryptedInput>;

/**
 * Decryption function type
 */
export type DecryptionFunction = (
  handle: EncryptedHandle,
  permit: DecryptionPermit
) => Promise<any>;

/**
 * FHE instance configuration
 */
export interface FhevmInstanceConfig {
  /** Chain ID */
  chainId: number;
  /** Gateway public key */
  publicKey: string;
  /** Gateway URL */
  gatewayUrl: string;
  /** ACL contract address */
  aclAddress: string;
}

/**
 * Encrypted value metadata
 */
export interface EncryptedValueMetadata {
  /** FHE type of encrypted value */
  type: FheType;
  /** Encryption timestamp */
  timestamp: number;
  /** Contract address if applicable */
  contract?: string;
  /** Original value hash (for verification) */
  hash?: string;
}

/**
 * Batch decryption result
 */
export interface BatchDecryptionResult {
  /** Decrypted values */
  values: any[];
  /** Failed indices */
  failures?: number[];
  /** Error messages for failures */
  errors?: Record<number, string>;
}

/**
 * Permit cache entry
 */
export interface PermitCacheEntry {
  /** Cached permit */
  permit: DecryptionPermit;
  /** Contract address */
  contract: string;
  /** User address */
  user: string;
  /** Expiration timestamp */
  expiresAt: number;
}

/**
 * FHE transaction options
 */
export interface FheTransactionOptions {
  /** Gas limit */
  gasLimit?: bigint | number;
  /** Gas price */
  gasPrice?: bigint | string;
  /** Transaction value */
  value?: bigint | string;
  /** Nonce */
  nonce?: number;
}

/**
 * Encrypted event log
 */
export interface EncryptedEventLog {
  /** Event name */
  event: string;
  /** Contract address */
  address: string;
  /** Block number */
  blockNumber: number;
  /** Transaction hash */
  transactionHash: string;
  /** Encrypted data handles */
  encryptedData: Record<string, EncryptedHandle>;
  /** Non-encrypted data */
  data: Record<string, any>;
}
