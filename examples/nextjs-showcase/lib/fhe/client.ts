/**
 * Client-side FHE Operations
 * Handles encryption and decryption on the client side
 */

export interface FHEClientConfig {
  network?: string;
  gatewayUrl?: string;
}

export class FHEClient {
  private config: FHEClientConfig;
  private publicKey: string | null = null;

  constructor(config: FHEClientConfig = {}) {
    this.config = {
      network: config.network || 'sepolia',
      gatewayUrl: config.gatewayUrl || 'https://gateway.fhe.dev',
    };
  }

  async initialize(): Promise<void> {
    try {
      // In a real implementation, this would initialize the FHE library
      // and retrieve cryptographic keys
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'generate' }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize FHE client');
      }

      const data = await response.json();
      this.publicKey = data.keys.publicKey;
    } catch (error) {
      console.error('FHE client initialization error:', error);
      throw error;
    }
  }

  async encrypt(value: any, type: string = 'uint32'): Promise<any> {
    if (!this.publicKey) {
      throw new Error('FHE client not initialized');
    }

    const response = await fetch('/api/fhe/encrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, type }),
    });

    if (!response.ok) {
      throw new Error('Encryption failed');
    }

    return response.json();
  }

  async decrypt(encryptedHandle: string, permit: any, contractAddress: string): Promise<any> {
    const response = await fetch('/api/fhe/decrypt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedHandle, permit, contractAddress }),
    });

    if (!response.ok) {
      throw new Error('Decryption failed');
    }

    return response.json();
  }

  getPublicKey(): string | null {
    return this.publicKey;
  }

  isInitialized(): boolean {
    return this.publicKey !== null;
  }
}

// Singleton instance
let clientInstance: FHEClient | null = null;

export function createFHEClient(config?: FHEClientConfig): FHEClient {
  if (!clientInstance) {
    clientInstance = new FHEClient(config);
  }
  return clientInstance;
}

export function getFHEClient(): FHEClient | null {
  return clientInstance;
}
