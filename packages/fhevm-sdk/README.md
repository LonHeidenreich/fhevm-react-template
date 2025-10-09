# 🔐 Universal FHEVM SDK

Framework-agnostic SDK for building confidential frontends with Fully Homomorphic Encryption (FHE).

## Installation

```bash
npm install @zama/fhevm-sdk
# or
yarn add @zama/fhevm-sdk
# or
pnpm add @zama/fhevm-sdk
```

## Quick Start

```typescript
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

// 1. Initialize client
const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
});

// 2. Encrypt value
const encrypted = await encrypt(client, 42);

// 3. Use in contract
await contract.submitValue(encrypted.data, encrypted.signature);
```

## Core Concepts

### FHEVM Client

The client is the main entry point for all FHE operations:

```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

// Browser with MetaMask
const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
});

// Node.js with private key
const client = await createFhevmClient({
  network: 'sepolia',
  privateKey: process.env.PRIVATE_KEY,
});

// Custom network
const client = await createFhevmClient({
  network: {
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    gatewayUrl: 'https://gateway.zama.ai',
    aclAddress: '0x...',
  },
});
```

### Encryption

Encrypt different types of values:

```typescript
import {
  encrypt,         // Auto-detect type
  encryptUint8,
  encryptUint16,
  encryptUint32,
  encryptUint64,
  encryptBool,
  encryptAddress,
} from '@zama/fhevm-sdk';

// Auto-detect (recommended)
const enc1 = await encrypt(client, 42);        // uint8
const enc2 = await encrypt(client, 1000);      // uint16
const enc3 = await encrypt(client, true);      // bool
const enc4 = await encrypt(client, '0x123...');// address

// Explicit types
const enc5 = await encryptUint32(client, 1000000);
const enc6 = await encryptBool(client, false);
```

### Decryption with Permits

```typescript
import { requestDecryptionPermit, decrypt } from '@zama/fhevm-sdk';

// 1. Request permit from user
const permit = await requestDecryptionPermit(client, {
  contract: contractAddress,
  user: userAddress,
});

// 2. Decrypt value
const decrypted = await decrypt(client, encryptedHandle, permit);
console.log('Value:', decrypted); // 42n (bigint)

// 3. Type-specific decryption
const bool = await decryptBool(client, handle, permit);     // boolean
const addr = await decryptAddress(client, handle, permit);  // string
const num = await decryptUint32(client, handle, permit);    // number
```

## Framework Adapters

### React

```typescript
import { FhevmProvider, useFhevm, useEncrypt, useDecrypt } from '@zama/fhevm-sdk/react';

// 1. Wrap app with provider
function App() {
  return (
    <FhevmProvider network="sepolia">
      <MyComponent />
    </FhevmProvider>
  );
}

// 2. Use hooks
function MyComponent() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);
  const { decrypt, requestPermit } = useDecrypt(client);

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt(value);
    await contract.submit(encrypted.data, encrypted.signature);
  };

  if (!isReady) return <div>Initializing FHEVM...</div>;

  return <button onClick={() => handleSubmit(42)}>Submit</button>;
}
```

### Vue 3

```vue
<script setup lang="ts">
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/vue';

const { client, isReady } = useFhevm({ network: 'sepolia' });
const { encrypt, isEncrypting } = useEncrypt(client);

const handleSubmit = async (value: number) => {
  const encrypted = await encrypt(value);
  // Use encrypted value...
};
</script>

<template>
  <div v-if="!isReady">Initializing FHEVM...</div>
  <button v-else @click="handleSubmit(42)" :disabled="isEncrypting">
    Submit
  </button>
</template>
```

### Node.js (Backend)

```typescript
import { createFhevmClient, decrypt } from '@zama/fhevm-sdk/node';

const client = await createFhevmClient({
  network: 'sepolia',
  privateKey: process.env.PRIVATE_KEY,
});

// Server-side decryption
const decrypted = await decrypt(client, handle);
```

## API Reference

### Client Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `createFhevmClient(config)` | Initialize FHEVM client | `Promise<FhevmClient>` |
| `initializeFhevm()` | Initialize FHEVM library (called automatically) | `Promise<void>` |
| `getNetwork(client)` | Get network configuration | `NetworkConfig` |
| `getProvider(client)` | Get ethers provider | `Provider` |
| `isClientReady(client)` | Check if client is ready | `boolean` |

### Encryption Functions

| Function | Input Type | Returns |
|----------|------------|---------|
| `encrypt(client, value)` | `number \| bigint \| boolean \| string` | `Promise<EncryptedInput>` |
| `encryptUint8(client, value)` | `number` (0-255) | `Promise<EncryptedInput>` |
| `encryptUint16(client, value)` | `number` (0-65535) | `Promise<EncryptedInput>` |
| `encryptUint32(client, value)` | `number` (0-4294967295) | `Promise<EncryptedInput>` |
| `encryptUint64(client, value)` | `bigint` | `Promise<EncryptedInput>` |
| `encryptBool(client, value)` | `boolean` | `Promise<EncryptedInput>` |
| `encryptAddress(client, value)` | `string` | `Promise<EncryptedInput>` |

### Decryption Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `requestDecryptionPermit(client, opts)` | Request user permission | `Promise<DecryptionPermit>` |
| `decrypt(client, handle, permit)` | Decrypt value | `Promise<bigint>` |
| `decryptBool(client, handle, permit)` | Decrypt boolean | `Promise<boolean>` |
| `decryptAddress(client, handle, permit)` | Decrypt address | `Promise<string>` |
| `decryptUint8/16/32(client, handle, permit)` | Decrypt number | `Promise<number>` |
| `decryptUint64(client, handle, permit)` | Decrypt uint64 | `Promise<bigint>` |
| `decryptBatch(client, handles, permit)` | Decrypt multiple | `Promise<bigint[]>` |
| `isPermitValid(client, permit)` | Check permit validity | `Promise<boolean>` |
| `revokePermit(client, permit)` | Revoke permit | `Promise<void>` |

### React Hooks

| Hook | Description | Returns |
|------|-------------|---------|
| `useFhevm()` | Access FHEVM client | `{ client, isReady, isInitializing, error }` |
| `useEncrypt(client)` | Encryption functions | `{ encrypt, encryptUint32, ..., isEncrypting, error }` |
| `useDecrypt(client)` | Decryption functions | `{ decrypt, requestPermit, isDecrypting, error }` |

## Types

### FhevmClient

```typescript
interface FhevmClient {
  instance: FhevmInstance;
  provider: BrowserProvider | JsonRpcProvider;
  network: NetworkConfig;
  address?: string;
}
```

### NetworkConfig

```typescript
interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  gatewayUrl: string;
  aclAddress: string;
}
```

### EncryptedInput

```typescript
interface EncryptedInput {
  data: Uint8Array;
  signature: string;
}
```

### DecryptionPermit

```typescript
interface DecryptionPermit {
  signature: string;
  publicKey: string;
}
```

## Advanced Usage

### Batch Encryption

```typescript
import { createEncryptedInputBuilder } from '@zama/fhevm-sdk';

const builder = createEncryptedInputBuilder(client);
builder.add8(42);
builder.add16(1000);
builder.addBool(true);

const encrypted = await builder.encrypt();
await contract.submitBatch(encrypted.data, encrypted.signature);
```

### Batch Decryption

```typescript
import { decryptBatch } from '@zama/fhevm-sdk';

const handles = [handle1, handle2, handle3];
const decrypted = await decryptBatch(client, handles, permit);
console.log('Values:', decrypted); // [42n, 1000n, 1n]
```

### Custom Error Handling

```typescript
try {
  const encrypted = await encrypt(client, 42);
  await contract.submit(encrypted.data, encrypted.signature);
} catch (error) {
  if (error.message.includes('User rejected')) {
    console.log('User canceled the operation');
  } else if (error.message.includes('encryption failed')) {
    console.log('Encryption error, retry?');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Permit Caching

```typescript
// Cache permit for multiple decryptions
const permit = await requestDecryptionPermit(client, {
  contract: contractAddress,
  user: userAddress,
});

// Check validity before reusing
if (await isPermitValid(client, permit)) {
  const value1 = await decrypt(client, handle1, permit);
  const value2 = await decrypt(client, handle2, permit);
} else {
  // Request new permit
}
```

## Examples

### Complete Form Submission

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import { useContract } from 'wagmi';

function ConfidentialForm() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);
  const [formData, setFormData] = useState({ amount: 0, isActive: false });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Encrypt form data
    const encryptedAmount = await encrypt(formData.amount);
    const encryptedStatus = await encrypt(formData.isActive);

    // Submit to contract
    const tx = await contract.submitData(
      encryptedAmount.data,
      encryptedAmount.signature,
      encryptedStatus.data,
      encryptedStatus.signature
    );

    await tx.wait();
    alert('Submitted successfully!');
  };

  if (!isReady) return <div>Connecting to FHEVM...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
      />
      <label>
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
        Active
      </label>
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit Confidential Data'}
      </button>
    </form>
  );
}
```

### View Encrypted Data

```typescript
function ViewConfidentialData({ contractAddress, dataId }) {
  const { client } = useFhevm();
  const { decrypt, requestPermit, isDecrypting } = useDecrypt(client);
  const [decryptedData, setDecryptedData] = useState(null);

  const handleView = async () => {
    // Request permit
    const permit = await requestPermit({
      contract: contractAddress,
      user: userAddress,
    });

    // Get encrypted handle from contract
    const handle = await contract.getDataHandle(dataId);

    // Decrypt
    const value = await decrypt(handle, permit);
    setDecryptedData(value.toString());
  };

  return (
    <div>
      <button onClick={handleView} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'View Confidential Data'}
      </button>
      {decryptedData && <p>Value: {decryptedData}</p>}
    </div>
  );
}
```

## Best Practices

1. **Always check `isReady`** before using the client
2. **Handle loading states** with `isEncrypting` / `isDecrypting`
3. **Cache permits** when performing multiple decryptions
4. **Validate permits** before reusing
5. **Never log encrypted data** - contains cryptographic material
6. **Use type-specific functions** when you know the type
7. **Handle errors gracefully** with try/catch blocks
8. **Test on testnet** before deploying to mainnet

## Troubleshooting

### Client initialization fails

```typescript
// Check if provider is available
if (!(window as any).ethereum) {
  alert('Please install MetaMask');
}

// Ensure correct network
const { chainId } = await provider.getNetwork();
console.log('Current chain:', chainId);
```

### Encryption fails

```typescript
// Validate input ranges
if (value < 0 || value > 255) {
  throw new Error('Value out of range for uint8');
}

// Check client is ready
if (!isClientReady(client)) {
  throw new Error('Client not initialized');
}
```

### Decryption fails

```typescript
// Check permit validity
const isValid = await isPermitValid(client, permit);
if (!isValid) {
  // Request new permit
  const newPermit = await requestDecryptionPermit(...);
}

// Ensure correct handle type
const handle = BigInt(handleString);
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](../../LICENSE)

---

**Part of Universal FHEVM SDK Competition Submission**

For more examples, see [examples/](../../examples/) directory.
