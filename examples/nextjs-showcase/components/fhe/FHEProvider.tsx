'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FHEContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  publicKey: string | null;
  initialize: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export function FHEProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate FHE initialization
      // In a real implementation, this would initialize the FHE library
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate or retrieve public key
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'generate' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keys');
      }

      const data = await response.json();
      setPublicKey(data.keys.publicKey);
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Initialization failed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: FHEContextType = {
    isInitialized,
    isLoading,
    error,
    publicKey,
    initialize,
  };

  return <FHEContext.Provider value={value}>{children}</FHEContext.Provider>;
}

export function useFHEContext() {
  const context = useContext(FHEContext);
  if (context === undefined) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
}
