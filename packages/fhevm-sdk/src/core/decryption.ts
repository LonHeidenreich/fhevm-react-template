/**
 * Decryption utilities for FHEVM
 *
 * This module provides functions to decrypt confidential values
 * using the permit system.
 */

import type { FhevmClient } from './client';

/**
 * Decryption permit
 */
export interface DecryptionPermit {
  signature: string;
  publicKey: string;
}

/**
 * Permit request options
 */
export interface PermitRequestOptions {
  /** Contract address to grant access to */
  contract: string;
  /** User address requesting the permit */
  user: string;
  /** Optional: Specific handles to permit */
  handles?: bigint[];
}

/**
 * Request decryption permit from user
 *
 * This function prompts the user to sign a permit allowing
 * decryption of specific encrypted values.
 *
 * @example
 * ```typescript
 * const permit = await requestDecryptionPermit(client, {
 *   contract: '0x123...',
 *   user: '0xabc...',
 * });
 * ```
 */
export async function requestDecryptionPermit(
  client: FhevmClient,
  options: PermitRequestOptions
): Promise<DecryptionPermit> {
  const { contract, user } = options;

  // Get signer
  const signer = await client.provider.getSigner();

  // Create permit parameters
  const permitParams = {
    domain: {
      name: 'Authorization token',
      version: '1',
      chainId: client.network.chainId,
      verifyingContract: contract,
    },
    types: {
      Permit: [
        { name: 'account', type: 'address' },
        { name: 'publicKey', type: 'bytes' },
      ],
    },
    message: {
      account: user,
      publicKey: client.instance.getPublicKey(),
    },
  };

  // Request signature from user
  const signature = await signer.signTypedData(
    permitParams.domain,
    permitParams.types,
    permitParams.message
  );

  return {
    signature,
    publicKey: client.instance.getPublicKey(),
  };
}

/**
 * Decrypt a single value
 *
 * @example
 * ```typescript
 * const permit = await requestDecryptionPermit(client, {...});
 * const decrypted = await decrypt(client, encryptedHandle, permit);
 * console.log('Value:', decrypted); // 42
 * ```
 */
export async function decrypt(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<bigint> {
  try {
    const response = await fetch(`${client.network.gatewayUrl}/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handle: handle.toString(),
        signature: permit.signature,
        publicKey: permit.publicKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`Decryption failed: ${response.statusText}`);
    }

    const data = await response.json();
    return BigInt(data.value);
  } catch (error) {
    throw new Error(`Failed to decrypt value: ${error}`);
  }
}

/**
 * Decrypt multiple values in batch
 *
 * @example
 * ```typescript
 * const handles = [handle1, handle2, handle3];
 * const decrypted = await decryptBatch(client, handles, permit);
 * console.log('Values:', decrypted); // [42, 100, 255]
 * ```
 */
export async function decryptBatch(
  client: FhevmClient,
  handles: bigint[],
  permit: DecryptionPermit
): Promise<bigint[]> {
  const decryptionPromises = handles.map((handle) =>
    decrypt(client, handle, permit)
  );

  return Promise.all(decryptionPromises);
}

/**
 * Decrypt a boolean value
 *
 * @example
 * ```typescript
 * const decrypted = await decryptBool(client, handle, permit);
 * console.log('Is active:', decrypted); // true
 * ```
 */
export async function decryptBool(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<boolean> {
  const value = await decrypt(client, handle, permit);
  return value !== 0n;
}

/**
 * Decrypt an address value
 *
 * @example
 * ```typescript
 * const decrypted = await decryptAddress(client, handle, permit);
 * console.log('Address:', decrypted); // '0x123...'
 * ```
 */
export async function decryptAddress(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<string> {
  const value = await decrypt(client, handle, permit);
  return '0x' + value.toString(16).padStart(40, '0');
}

/**
 * Decrypt a uint8 value
 */
export async function decryptUint8(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<number> {
  const value = await decrypt(client, handle, permit);
  return Number(value);
}

/**
 * Decrypt a uint16 value
 */
export async function decryptUint16(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<number> {
  const value = await decrypt(client, handle, permit);
  return Number(value);
}

/**
 * Decrypt a uint32 value
 */
export async function decryptUint32(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<number> {
  const value = await decrypt(client, handle, permit);
  return Number(value);
}

/**
 * Decrypt a uint64 value (returns bigint)
 */
export async function decryptUint64(
  client: FhevmClient,
  handle: bigint,
  permit: DecryptionPermit
): Promise<bigint> {
  return await decrypt(client, handle, permit);
}

/**
 * Check if a permit is still valid
 *
 * @example
 * ```typescript
 * const isValid = await isPermitValid(client, permit);
 * if (!isValid) {
 *   // Request new permit
 * }
 * ```
 */
export async function isPermitValid(
  client: FhevmClient,
  permit: DecryptionPermit
): Promise<boolean> {
  try {
    const response = await fetch(`${client.network.gatewayUrl}/permit/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signature: permit.signature,
        publicKey: permit.publicKey,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('Failed to validate permit:', error);
    return false;
  }
}

/**
 * Revoke a previously granted permit
 *
 * @example
 * ```typescript
 * await revokePermit(client, permit);
 * ```
 */
export async function revokePermit(
  client: FhevmClient,
  permit: DecryptionPermit
): Promise<void> {
  try {
    const response = await fetch(`${client.network.gatewayUrl}/permit/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signature: permit.signature,
        publicKey: permit.publicKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to revoke permit: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Failed to revoke permit: ${error}`);
  }
}
