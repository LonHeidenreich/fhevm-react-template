/**
 * React adapter for Universal FHEVM SDK
 *
 * This module provides React hooks and context for easy integration
 * of FHEVM functionality into React applications.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { FhevmClient, FhevmClientConfig } from '../../core/client';
import { createFhevmClient, isClientReady } from '../../core/client';
import { encrypt, encryptUint8, encryptUint16, encryptUint32, encryptBool, encryptAddress } from '../../core/encryption';
import { decrypt, requestDecryptionPermit, type DecryptionPermit, type PermitRequestOptions } from '../../core/decryption';

/**
 * FHEVM Context
 */
interface FhevmContextValue {
  client: FhevmClient | null;
  isReady: boolean;
  isInitializing: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isReady: false,
  isInitializing: false,
  error: null,
});

/**
 * FHEVM Provider Props
 */
export interface FhevmProviderProps {
  /** Network configuration */
  network: string;
  /** Child components */
  children: React.ReactNode;
  /** Optional provider override */
  provider?: any;
  /** Optional gateway URL override */
  gatewayUrl?: string;
  /** Optional ACL address override */
  aclAddress?: string;
}

/**
 * FHEVM Provider Component
 *
 * Wrap your app with this provider to enable FHEVM hooks.
 *
 * @example
 * ```typescript
 * function App() {
 *   return (
 *     <FhevmProvider network="sepolia">
 *       <MyComponent />
 *     </FhevmProvider>
 *   );
 * }
 * ```
 */
export function FhevmProvider({ network, children, provider, gatewayUrl, aclAddress }: FhevmProviderProps) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setIsInitializing(true);
        setError(null);

        const config: FhevmClientConfig = {
          network,
          provider: provider || (window as any).ethereum,
          gatewayUrl,
          aclAddress,
        };

        const fhevmClient = await createFhevmClient(config);

        if (mounted) {
          setClient(fhevmClient);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize FHEVM'));
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [network, provider, gatewayUrl, aclAddress]);

  const value: FhevmContextValue = {
    client,
    isReady: isClientReady(client),
    isInitializing,
    error,
  };

  return <FhevmContext.Provider value={value}>{children}</FhevmContext.Provider>;
}

/**
 * Use FHEVM client
 *
 * Access the FHEVM client from context.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { client, isReady } = useFhevm();
 *
 *   if (!isReady) return <div>Initializing...</div>;
 *
 *   return <div>Client ready!</div>;
 * }
 * ```
 */
export function useFhevm() {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }
  return context;
}

/**
 * Use encryption hook
 *
 * Provides encryption functions with loading states.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { client } = useFhevm();
 *   const { encrypt, isEncrypting, error } = useEncrypt(client);
 *
 *   const handleSubmit = async () => {
 *     const encrypted = await encrypt(42);
 *     // Use encrypted value...
 *   };
 *
 *   return <button onClick={handleSubmit} disabled={isEncrypting}>Submit</button>;
 * }
 * ```
 */
export function useEncrypt(client: FhevmClient | null) {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptValue = useCallback(
    async (value: number | bigint | boolean | string) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsEncrypting(true);
        setError(null);
        return await encrypt(client, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptUint8Value = useCallback(
    async (value: number) => {
      if (!client) throw new Error('FHEVM client not initialized');
      try {
        setIsEncrypting(true);
        setError(null);
        return await encryptUint8(client, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptUint16Value = useCallback(
    async (value: number) => {
      if (!client) throw new Error('FHEVM client not initialized');
      try {
        setIsEncrypting(true);
        setError(null);
        return await encryptUint16(client, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptUint32Value = useCallback(
    async (value: number) => {
      if (!client) throw new Error('FHEVM client not initialized');
      try {
        setIsEncrypting(true);
        setError(null);
        return await encryptUint32(client, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptBoolValue = useCallback(
    async (value: boolean) => {
      if (!client) throw new Error('FHEVM client not initialized');
      try {
        setIsEncrypting(true);
        setError(null);
        return await encryptBool(client, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const encryptAddressValue = useCallback(
    async (value: string) => {
      if (!client) throw new Error('FHEVM client not initialized');
      try {
        setIsEncrypting(true);
        setError(null);
        return await encryptAddress(client, value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  return {
    encrypt: encryptValue,
    encryptUint8: encryptUint8Value,
    encryptUint16: encryptUint16Value,
    encryptUint32: encryptUint32Value,
    encryptBool: encryptBoolValue,
    encryptAddress: encryptAddressValue,
    isEncrypting,
    error,
  };
}

/**
 * Use decryption hook
 *
 * Provides decryption functions with permit management.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { client } = useFhevm();
 *   const { decrypt, requestPermit, isDecrypting } = useDecrypt(client);
 *
 *   const handleDecrypt = async (handle: bigint) => {
 *     const permit = await requestPermit({
 *       contract: '0x123...',
 *       user: '0xabc...',
 *     });
 *     const value = await decrypt(handle, permit);
 *     console.log('Decrypted:', value);
 *   };
 *
 *   return <button onClick={() => handleDecrypt(handle)}>Decrypt</button>;
 * }
 * ```
 */
export function useDecrypt(client: FhevmClient | null) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isRequestingPermit, setIsRequestingPermit] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestPermit = useCallback(
    async (options: PermitRequestOptions): Promise<DecryptionPermit> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsRequestingPermit(true);
        setError(null);
        return await requestDecryptionPermit(client, options);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Permit request failed');
        setError(error);
        throw error;
      } finally {
        setIsRequestingPermit(false);
      }
    },
    [client]
  );

  const decryptValue = useCallback(
    async (handle: bigint, permit: DecryptionPermit): Promise<bigint> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);
        return await decrypt(client, handle, permit);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  return {
    decrypt: decryptValue,
    requestPermit,
    isDecrypting,
    isRequestingPermit,
    error,
  };
}

/**
 * Export types for consumers
 */
export type { FhevmClient, DecryptionPermit, PermitRequestOptions };
