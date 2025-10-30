import { useState, useCallback } from 'react';

export interface EncryptionOptions {
  type?: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
}

export function useEncryption() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const encrypt = useCallback(async (value: any, options: EncryptionOptions = {}) => {
    const { type = 'uint32' } = options;

    setIsEncrypting(true);
    setError(null);
    setEncryptedData(null);

    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Encryption failed');
      }

      const data = await response.json();
      setEncryptedData(data.encrypted);
      return data.encrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const encryptBatch = useCallback(async (values: Array<{ value: any; type?: string }>) => {
    setIsEncrypting(true);
    setError(null);

    try {
      const promises = values.map(({ value, type = 'uint32' }) =>
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, type }),
        }).then(r => r.json())
      );

      const results = await Promise.all(promises);
      const encryptedBatch = results.map(r => r.encrypted);
      setEncryptedData(encryptedBatch);
      return encryptedBatch;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Batch encryption failed');
      setError(error);
      throw error;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEncryptedData(null);
    setError(null);
  }, []);

  return {
    encrypt,
    encryptBatch,
    reset,
    isEncrypting,
    encryptedData,
    error,
  };
}
