/**
 * FHEVM Client - Core client initialization and provider management
 *
 * This module provides the main client for interacting with FHEVM networks.
 * It handles provider setup, network configuration, and FHE instance creation.
 */

import { BrowserProvider, JsonRpcProvider } from 'ethers';
import { createInstance, FhevmInstance, initFhevm } from 'fhevmjs';

/**
 * Network configuration for FHEVM
 */
export interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl: string;
  aclAddress: string;
}

/**
 * Supported FHEVM networks
 */
export const NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    gatewayUrl: 'https://gateway.zama.ai',
    aclAddress: '0x...', // Replace with actual ACL address
  },
  localhost: {
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    gatewayUrl: 'http://localhost:8080',
    aclAddress: '0x...', // Replace with local ACL address
  },
};

/**
 * FHEVM Client configuration options
 */
export interface FhevmClientConfig {
  /** Network name or custom network config */
  network: string | NetworkConfig;
  /** Ethereum provider (window.ethereum, JsonRpcProvider, etc) */
  provider?: any;
  /** Private key for Node.js environments */
  privateKey?: string;
  /** Gateway URL override */
  gatewayUrl?: string;
  /** ACL contract address override */
  aclAddress?: string;
}

/**
 * FHEVM Client instance
 */
export interface FhevmClient {
  /** FHE instance for encryption/decryption */
  instance: FhevmInstance;
  /** Ethers provider */
  provider: BrowserProvider | JsonRpcProvider;
  /** Network configuration */
  network: NetworkConfig;
  /** Current user address */
  address?: string;
}

/**
 * Initialize FHEVM library
 * Must be called once before creating any clients
 */
let fhevmInitialized = false;

export async function initializeFhevm(): Promise<void> {
  if (fhevmInitialized) return;

  await initFhevm();
  fhevmInitialized = true;
}

/**
 * Create FHEVM client
 *
 * @example
 * ```typescript
 * // Browser with MetaMask
 * const client = await createFhevmClient({
 *   network: 'sepolia',
 *   provider: window.ethereum,
 * });
 *
 * // Node.js with private key
 * const client = await createFhevmClient({
 *   network: 'sepolia',
 *   privateKey: process.env.PRIVATE_KEY,
 * });
 * ```
 */
export async function createFhevmClient(
  config: FhevmClientConfig
): Promise<FhevmClient> {
  // Initialize FHEVM library
  await initializeFhevm();

  // Get network configuration
  const networkConfig: NetworkConfig =
    typeof config.network === 'string'
      ? NETWORKS[config.network]
      : config.network;

  if (!networkConfig) {
    throw new Error(`Unknown network: ${config.network}`);
  }

  // Override gateway/ACL if provided
  if (config.gatewayUrl) {
    networkConfig.gatewayUrl = config.gatewayUrl;
  }
  if (config.aclAddress) {
    networkConfig.aclAddress = config.aclAddress;
  }

  // Create provider
  let provider: BrowserProvider | JsonRpcProvider;
  let address: string | undefined;

  if (config.privateKey) {
    // Node.js environment with private key
    provider = new JsonRpcProvider(networkConfig.rpcUrl);
    // TODO: Create wallet from private key and get address
  } else if (config.provider) {
    // Browser environment with injected provider
    provider = new BrowserProvider(config.provider);
    const signer = await provider.getSigner();
    address = await signer.getAddress();
  } else {
    // Default to JSON-RPC provider
    provider = new JsonRpcProvider(networkConfig.rpcUrl);
  }

  // Create FHE instance
  const instance = await createInstance({
    chainId: networkConfig.chainId,
    publicKey: await fetchPublicKey(networkConfig.gatewayUrl),
    gatewayUrl: networkConfig.gatewayUrl,
    aclAddress: networkConfig.aclAddress,
  });

  return {
    instance,
    provider,
    network: networkConfig,
    address,
  };
}

/**
 * Fetch public key from gateway
 * @internal
 */
async function fetchPublicKey(gatewayUrl: string): Promise<string> {
  try {
    const response = await fetch(`${gatewayUrl}/publicKey`);
    if (!response.ok) {
      throw new Error(`Failed to fetch public key: ${response.statusText}`);
    }
    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    throw new Error(`Failed to fetch public key from gateway: ${error}`);
  }
}

/**
 * Get current network from client
 */
export function getNetwork(client: FhevmClient): NetworkConfig {
  return client.network;
}

/**
 * Get provider from client
 */
export function getProvider(client: FhevmClient): BrowserProvider | JsonRpcProvider {
  return client.provider;
}

/**
 * Check if client is ready for operations
 */
export function isClientReady(client: FhevmClient | null): client is FhevmClient {
  return client !== null && client.instance !== null;
}
