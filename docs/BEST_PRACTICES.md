# 💎 Best Practices - FHE Development with Universal FHEVM SDK

This guide covers best practices for building production-ready confidential applications using the Universal FHEVM SDK.

**Repository**: https://github.com/LonHeidenreich/fhevm-react-template

**Live Demo**: https://violation-handler.vercel.app/

---

## 🔐 Security Best Practices

### 1. Never Expose Private Keys

```typescript
// ❌ NEVER do this
const client = await createFhevmClient({
  network: 'sepolia',
  privateKey: '0x1234567890abcdef...', // NEVER hardcode!
});

// ✅ Use environment variables
const client = await createFhevmClient({
  network: 'sepolia',
  privateKey: process.env.PRIVATE_KEY, // Backend only
});

// ✅ Or use browser provider (frontend)
const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum, // User's wallet
});
```

### 2. Validate All Inputs

```typescript
// ✅ Validate before encryption
function encryptValue(value: number) {
  // Validate range
  if (value < 0 || value > 4294967295) {
    throw new Error('Value out of range for uint32');
  }

  // Validate type
  if (!Number.isInteger(value)) {
    throw new Error('Value must be an integer');
  }

  return encrypt(client, value);
}
```

### 3. Handle Permits Securely

```typescript
// ✅ Always request fresh permits
async function decryptValue(handle: string) {
  // Request new permit for each decryption
  const permit = await requestDecryptionPermit(client, {
    contract: contractAddress,
    user: userAddress,
  });

  return decrypt(client, handle, permit);
}

// ❌ Don't reuse old permits
let cachedPermit; // Don't do this
```

### 4. Use HTTPS Only

```typescript
// ✅ Production configuration
const client = await createFhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai', // HTTPS
});

// ❌ Never use HTTP in production
// gatewayUrl: 'http://gateway...' // Insecure!
```

---

## ⚡ Performance Best Practices

### 1. Initialize Client Once

```typescript
// ✅ React - Initialize at app level
function App() {
  return (
    <FhevmProvider network="sepolia">
      <YourApp />
    </FhevmProvider>
  );
}

// ✅ Node.js - Singleton pattern
let fhevmClient: FhevmClient | null = null;

async function getClient() {
  if (!fhevmClient) {
    fhevmClient = await createFhevmClient({
      network: 'sepolia',
      privateKey: process.env.PRIVATE_KEY,
    });
  }
  return fhevmClient;
}
```

### 2. Batch Operations When Possible

```typescript
// ✅ Batch multiple encryptions
async function encryptMultiple(values: number[]) {
  const encrypted = await Promise.all(
    values.map(value => encrypt(client, value))
  );
  return encrypted;
}

// ✅ Submit in single transaction
await contract.submitBatch(
  encrypted.map(e => e.data),
  encrypted.map(e => e.signature)
);
```

### 3. Cache Network Config

```typescript
// ✅ Define once, reuse
const NETWORK_CONFIG = {
  network: 'sepolia',
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  aclAddress: '0x...',
} as const;

const client = await createFhevmClient(NETWORK_CONFIG);
```

### 4. Use Type-Specific Functions

```typescript
// ✅ More efficient - type known at compile time
const encrypted = await encryptUint32(client, 1000);

// ⚠️ Less efficient - type detected at runtime
const encrypted = await encrypt(client, 1000);
```

---

## 🎯 Error Handling Best Practices

### 1. Always Use Try-Catch

```typescript
// ✅ Proper error handling
async function handleEncryption(value: number) {
  try {
    const encrypted = await encrypt(client, value);
    await contract.submit(encrypted.data, encrypted.signature);
    return { success: true };
  } catch (error) {
    console.error('Encryption failed:', error);

    // Handle specific errors
    if (error.message.includes('Client not initialized')) {
      return { success: false, error: 'Please connect your wallet' };
    }

    if (error.message.includes('User rejected')) {
      return { success: false, error: 'Transaction cancelled' };
    }

    return { success: false, error: 'Encryption failed' };
  }
}
```

### 2. Provide User Feedback

```typescript
// ✅ React component with full error handling
function EncryptForm() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting, error } = useEncrypt(client);
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (value: number) => {
    try {
      setStatus('Encrypting...');
      const encrypted = await encrypt(value);

      setStatus('Submitting to blockchain...');
      const tx = await contract.submit(encrypted.data, encrypted.signature);

      setStatus('Waiting for confirmation...');
      await tx.wait();

      setStatus('Success!');
    } catch (err) {
      setStatus('Failed: ' + err.message);
    }
  };

  return (
    <div>
      {!isReady && <p>Initializing FHEVM...</p>}
      {error && <p className="error">{error.message}</p>}
      {status && <p className="status">{status}</p>}
      {/* Form UI */}
    </div>
  );
}
```

### 3. Implement Retry Logic

```typescript
// ✅ Retry with exponential backoff
async function encryptWithRetry(
  client: FhevmClient,
  value: number,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await encrypt(client, value);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      console.log(`Retry ${i + 1}/${maxRetries}...`);
    }
  }
}
```

---

## 🧪 Testing Best Practices

### 1. Mock FHEVM Client for Unit Tests

```typescript
// __mocks__/@zama/fhevm-sdk.ts
export const createFhevmClient = vi.fn().mockResolvedValue({
  instance: {},
  provider: {},
  network: { chainId: 11155111 },
  address: '0x...',
});

export const encrypt = vi.fn().mockResolvedValue({
  data: '0x...',
  signature: '0x...',
});

export const decrypt = vi.fn().mockResolvedValue(42);
```

### 2. Test Error Scenarios

```typescript
// encryption.test.ts
describe('Encryption', () => {
  it('should handle client not initialized', async () => {
    const { encrypt } = useEncrypt(null);

    await expect(encrypt(100)).rejects.toThrow('Client not initialized');
  });

  it('should handle invalid value types', async () => {
    await expect(encrypt(client, 'invalid')).rejects.toThrow();
  });

  it('should handle network errors', async () => {
    // Mock network failure
    vi.mocked(encrypt).mockRejectedValueOnce(new Error('Network error'));

    await expect(encrypt(client, 100)).rejects.toThrow('Network error');
  });
});
```

### 3. Test Loading States

```typescript
// component.test.tsx
describe('EncryptForm', () => {
  it('should show loading state during encryption', async () => {
    const { getByText, findByText } = render(<EncryptForm />);

    const button = getByText('Submit');
    fireEvent.click(button);

    expect(await findByText('Encrypting...')).toBeInTheDocument();
  });

  it('should show ready state when client initializes', async () => {
    const { findByText } = render(<EncryptForm />);

    expect(await findByText('Ready')).toBeInTheDocument();
  });
});
```

---

## 🎨 UX Best Practices

### 1. Show Clear Loading States

```typescript
// ✅ Comprehensive loading states
function EncryptButton() {
  const { isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReady) {
    return <button disabled>Initializing FHEVM...</button>;
  }

  if (isEncrypting) {
    return <button disabled>Encrypting data...</button>;
  }

  if (isSubmitting) {
    return <button disabled>Submitting transaction...</button>;
  }

  return <button onClick={handleClick}>Submit</button>;
}
```

### 2. Provide Transaction Feedback

```typescript
// ✅ Track transaction progress
function TransactionStatus({ txHash }: { txHash: string }) {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    async function watchTransaction() {
      const receipt = await provider.waitForTransaction(txHash);

      if (receipt.status === 1) {
        setStatus('confirmed');
      } else {
        setStatus('failed');
      }
    }

    watchTransaction();
  }, [txHash]);

  return (
    <div className={`status-${status}`}>
      {status === 'pending' && '⏳ Confirming transaction...'}
      {status === 'confirmed' && '✅ Transaction confirmed!'}
      {status === 'failed' && '❌ Transaction failed'}
    </div>
  );
}
```

### 3. Handle Wallet Connection

```typescript
// ✅ Check wallet connection first
function App() {
  const { isConnected, connect } = useAccount();
  const { isReady } = useFhevm();

  if (!isConnected) {
    return (
      <div>
        <h1>Please connect your wallet</h1>
        <button onClick={connect}>Connect Wallet</button>
      </div>
    );
  }

  if (!isReady) {
    return <div>Initializing FHEVM...</div>;
  }

  return <MainApp />;
}
```

---

## 📊 Type Safety Best Practices

### 1. Use TypeScript

```typescript
// ✅ Full type safety
import type { FhevmClient, EncryptedInput } from '@zama/fhevm-sdk';

async function encryptValue(
  client: FhevmClient,
  value: number
): Promise<EncryptedInput> {
  return await encrypt(client, value);
}

// ❌ Avoid 'any'
async function encryptValue(client: any, value: any): Promise<any> {
  return await encrypt(client, value);
}
```

### 2. Define Contract Types

```typescript
// ✅ Type-safe contract interaction
import type { Contract } from 'ethers';

interface ViolationContract extends Contract {
  reportViolation(
    licensePlate: string,
    violationType: string,
    location: string,
    description: string
  ): Promise<TransactionResponse>;

  getViolationCount(): Promise<bigint>;
}

const contract = new Contract(address, abi, signer) as ViolationContract;
```

### 3. Strict Type Checking

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

---

## 🗂️ Code Organization Best Practices

### 1. Separate Concerns

```
src/
├── hooks/
│   ├── useFhevm.ts          # FHEVM client hook
│   └── useContract.ts        # Contract interaction
├── utils/
│   ├── encryption.ts         # Encryption utilities
│   └── validation.ts         # Input validation
├── components/
│   ├── EncryptForm.tsx       # UI components
│   └── DecryptButton.tsx
└── types/
    └── contracts.ts          # Contract types
```

### 2. Create Reusable Utilities

```typescript
// utils/encryption.ts
export async function encryptAndSubmit(
  client: FhevmClient,
  contract: Contract,
  value: number
) {
  const encrypted = await encrypt(client, value);
  return contract.submit(encrypted.data, encrypted.signature);
}

// utils/validation.ts
export function validateUint32(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 4294967295;
}
```

### 3. Use Configuration Files

```typescript
// config/fhevm.ts
export const FHEVM_CONFIG = {
  sepolia: {
    chainId: 11155111,
    gatewayUrl: 'https://gateway.sepolia.zama.ai',
    aclAddress: '0x...',
  },
  localhost: {
    chainId: 31337,
    gatewayUrl: 'http://localhost:8545',
    aclAddress: '0x...',
  },
} as const;

export type NetworkName = keyof typeof FHEVM_CONFIG;
```

---

## 🔍 Debugging Best Practices

### 1. Enable Debug Logging

```typescript
// ✅ Add logging for debugging
async function encryptWithLogging(client: FhevmClient, value: number) {
  console.log('[FHEVM] Starting encryption:', { value });

  try {
    const encrypted = await encrypt(client, value);
    console.log('[FHEVM] Encryption successful:', encrypted);
    return encrypted;
  } catch (error) {
    console.error('[FHEVM] Encryption failed:', error);
    throw error;
  }
}
```

### 2. Monitor Network Requests

```typescript
// ✅ Log gateway requests
const client = await createFhevmClient({
  network: 'sepolia',
  onRequest: (url, options) => {
    console.log('[Gateway] Request:', url, options);
  },
  onResponse: (url, response) => {
    console.log('[Gateway] Response:', url, response.status);
  },
});
```

### 3. Use Browser DevTools

```typescript
// ✅ Expose client for debugging (dev only)
if (process.env.NODE_ENV === 'development') {
  (window as any).__fhevmClient = client;
}

// Then in browser console:
// __fhevmClient.network.chainId
// await __fhevmClient.encrypt(100)
```

---

## 📚 Documentation Best Practices

### 1. Document Complex Logic

```typescript
/**
 * Encrypts a violation report with all sensitive fields
 *
 * This function handles the encryption of:
 * - License plate (euint64)
 * - Violation type (euint8)
 * - Fine amount (euint32)
 *
 * @param client - Initialized FHEVM client
 * @param report - Violation report data
 * @returns Encrypted inputs ready for contract submission
 * @throws {Error} If encryption fails or client not ready
 *
 * @example
 * ```typescript
 * const encrypted = await encryptViolationReport(client, {
 *   licensePlate: 'ABC123',
 *   violationType: 1,
 *   fineAmount: 100
 * });
 * ```
 */
export async function encryptViolationReport(
  client: FhevmClient,
  report: ViolationReport
): Promise<EncryptedReport> {
  // Implementation
}
```

### 2. Maintain Changelog

```markdown
# Changelog

## [1.1.0] - 2025-01-15
### Added
- Batch encryption support
- Permit caching
- Vue adapter

### Fixed
- Memory leak in client initialization
- Permit validation error

### Changed
- Improved error messages
- Faster encryption for uint8
```

---

## ✅ Production Checklist

Before deploying to production:

- [ ] All private keys in environment variables
- [ ] HTTPS only for all endpoints
- [ ] Error handling for all async operations
- [ ] Loading states for all user actions
- [ ] Input validation on client and server
- [ ] TypeScript strict mode enabled
- [ ] Unit tests for critical paths
- [ ] Integration tests for FHE workflows
- [ ] Performance monitoring enabled
- [ ] Security audit completed
- [ ] Documentation up to date
- [ ] Environment configs for all networks

---

## 🎓 Additional Resources

- **Live Example**: https://violation-handler.vercel.app/
- **SDK Documentation**: [../packages/fhevm-sdk/README.md](../packages/fhevm-sdk/README.md)
- **Migration Guide**: [MIGRATION.md](./MIGRATION.md)
- **Framework Guide**: [FRAMEWORKS.md](./FRAMEWORKS.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Follow these best practices to build secure, performant, and maintainable FHE applications!** 💎
