import { useState, useCallback } from 'react';

export interface FHEOperationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useFHE() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encryptValue = useCallback(async (value: any, type: string = 'uint32'): Promise<FHEOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });

      if (!response.ok) {
        throw new Error('Encryption failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const decryptValue = useCallback(async (
    encryptedHandle: string,
    permit: any,
    contractAddress: string
  ): Promise<FHEOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedHandle, permit, contractAddress }),
      });

      if (!response.ok) {
        throw new Error('Decryption failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const computeOnEncrypted = useCallback(async (
    operation: string,
    operands: string[]
  ): Promise<FHEOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, operands }),
      });

      if (!response.ok) {
        throw new Error('Computation failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    encryptValue,
    decryptValue,
    computeOnEncrypted,
    isLoading,
    error,
  };
}
