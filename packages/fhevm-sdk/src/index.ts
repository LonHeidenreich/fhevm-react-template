/**
 * Universal FHEVM SDK
 *
 * A framework-agnostic SDK for building confidential frontends with
 * Fully Homomorphic Encryption (FHE).
 *
 * @packageDocumentation
 */

// Core exports
export {
  createFhevmClient,
  initializeFhevm,
  getNetwork,
  getProvider,
  isClientReady,
  NETWORKS,
  type FhevmClient,
  type FhevmClientConfig,
  type NetworkConfig,
} from './core/client';

export {
  encrypt,
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptBool,
  encryptAddress,
  createEncryptedInputBuilder,
  getEncryptionFunction,
  type EncryptedInput,
  type FheType,
} from './core/encryption';

export {
  decrypt,
  decryptBool,
  decryptAddress,
  decryptUint8,
  decryptUint16,
  decryptUint32,
  decryptUint64,
  decryptBatch,
  requestDecryptionPermit,
  isPermitValid,
  revokePermit,
  type DecryptionPermit,
  type PermitRequestOptions,
} from './core/decryption';

/**
 * Quick start example
 *
 * @example
 * ```typescript
 * import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';
 *
 * // 1. Initialize client
 * const client = await createFhevmClient({
 *   network: 'sepolia',
 *   provider: window.ethereum,
 * });
 *
 * // 2. Encrypt value
 * const encrypted = await encrypt(client, 42);
 *
 * // 3. Use in contract
 * await contract.submitValue(encrypted.data, encrypted.signature);
 * ```
 */
