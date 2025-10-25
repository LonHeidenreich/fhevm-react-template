# 🔧 Troubleshooting Guide - Universal FHEVM SDK

Common issues and solutions when working with the Universal FHEVM SDK.

**Repository**: https://github.com/LonHeidenreich/fhevm-react-template

**Live Demo**: https://violation-handler.vercel.app/

---

## 🚨 Common Issues

### 1. "Client not initialized" Error

**Problem**:
```
Error: FHEVM client is not initialized
```

**Causes**:
- Client initialization hasn't completed
- Using client before `isReady` is true
- Provider not connected

**Solutions**:

✅ **React - Check ready state**:
```typescript
function Component() {
  const { client, isReady } = useFhevm();

  if (!isReady) {
    return <div>Initializing FHEVM...</div>;
  }

  // Safe to use client here
}
```

✅ **Vanilla JS - Wait for initialization**:
```typescript
let client;

async function init() {
  client = await createFhevmClient({
    network: 'sepolia',
    provider: window.ethereum,
  });
}

async function encrypt(value) {
  if (!client) {
    await init();
  }

  return encrypt(client, value);
}
```

---

### 2. "Provider not found" Error

**Problem**:
```
Error: No Ethereum provider found
```

**Causes**:
- MetaMask or other wallet not installed
- Running in non-browser environment
- Provider not injected yet

**Solutions**:

✅ **Check for provider**:
```typescript
if (!window.ethereum) {
  throw new Error('Please install MetaMask or another Web3 wallet');
}

const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
});
```

✅ **Wait for provider injection**:
```typescript
async function getProvider() {
  if (window.ethereum) {
    return window.ethereum;
  }

  // Wait up to 3 seconds for provider injection
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.ethereum) {
        clearInterval(interval);
        resolve(window.ethereum);
      } else if (attempts++ > 30) {
        clearInterval(interval);
        reject(new Error('No provider found'));
      }
    }, 100);
  });
}
```

✅ **Provide user-friendly message**:
```typescript
function App() {
  const [hasProvider, setHasProvider] = useState(!!window.ethereum);

  if (!hasProvider) {
    return (
      <div>
        <h1>Wallet Required</h1>
        <p>Please install MetaMask to use this app:</p>
        <a href="https://metamask.io/" target="_blank">
          Install MetaMask
        </a>
      </div>
    );
  }

  return <FhevmProvider network="sepolia">...</FhevmProvider>;
}
```

---

### 3. Network Mismatch Error

**Problem**:
```
Error: Please switch to Sepolia network
```

**Causes**:
- Wallet connected to wrong network
- Chain ID mismatch

**Solutions**:

✅ **Check network and prompt switch**:
```typescript
import { useNetwork, useSwitchNetwork } from 'wagmi';

function NetworkGuard({ children }) {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const targetChainId = 11155111; // Sepolia

  if (chain?.id !== targetChainId) {
    return (
      <div>
        <p>Please switch to Sepolia network</p>
        <button onClick={() => switchNetwork?.(targetChainId)}>
          Switch Network
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

✅ **Auto-switch network**:
```typescript
async function ensureCorrectNetwork() {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });

  if (chainId !== '0xaa36a7') { // Sepolia = 0xaa36a7
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added, add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            rpcUrls: ['https://sepolia.infura.io/v3/YOUR_KEY'],
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'SEP',
              decimals: 18,
            },
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      }
    }
  }
}
```

---

### 4. Encryption Fails

**Problem**:
```
Error: Encryption failed
```

**Causes**:
- Invalid value type
- Value out of range
- Client not ready
- Network timeout

**Solutions**:

✅ **Validate input before encryption**:
```typescript
function validateValue(value: number): void {
  if (!Number.isInteger(value)) {
    throw new Error('Value must be an integer');
  }

  if (value < 0) {
    throw new Error('Value must be non-negative');
  }

  if (value > 4294967295) {
    throw new Error('Value too large for uint32');
  }
}

async function safeEncrypt(client: FhevmClient, value: number) {
  validateValue(value);

  try {
    return await encrypt(client, value);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt value. Please try again.');
  }
}
```

✅ **Use type-specific functions**:
```typescript
// ✅ Clear type expectations
const encrypted = await encryptUint32(client, 1000);

// ⚠️ Type detection might fail
const encrypted = await encrypt(client, 'invalid'); // Will throw
```

✅ **Add retry logic**:
```typescript
async function encryptWithRetry(
  client: FhevmClient,
  value: number,
  maxRetries = 3
): Promise<EncryptedInput> {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await encrypt(client, value);
    } catch (error) {
      lastError = error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);

      // Wait before retrying (exponential backoff)
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  throw lastError;
}
```

---

### 5. Decryption Permission Denied

**Problem**:
```
Error: User denied decryption permission
```

**Causes**:
- User rejected signature request
- Invalid permit
- Permit expired

**Solutions**:

✅ **Handle user rejection gracefully**:
```typescript
async function requestPermitSafely(client: FhevmClient) {
  try {
    return await requestDecryptionPermit(client, {
      contract: contractAddress,
      user: userAddress,
    });
  } catch (error) {
    if (error.message.includes('User rejected')) {
      throw new Error('You need to approve the signature to decrypt data');
    }

    throw error;
  }
}
```

✅ **Explain permit request to users**:
```typescript
function DecryptButton() {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDecrypt = async () => {
    if (showExplanation) {
      // User clicked "I understand"
      const permit = await requestPermit({...});
      const decrypted = await decrypt(handle, permit);
      // ...
    } else {
      setShowExplanation(true);
    }
  };

  if (showExplanation) {
    return (
      <div>
        <p>To view encrypted data, you need to sign a permission request.</p>
        <p>This is a free operation and won't cost any gas.</p>
        <button onClick={handleDecrypt}>I Understand - Proceed</button>
      </div>
    );
  }

  return <button onClick={handleDecrypt}>Decrypt</button>;
}
```

---

### 6. Transaction Failures

**Problem**:
```
Error: Transaction reverted
```

**Causes**:
- Insufficient gas
- Contract paused
- Invalid encrypted input
- Wrong function parameters

**Solutions**:

✅ **Estimate gas before submitting**:
```typescript
async function submitWithGasEstimate(encrypted: EncryptedInput) {
  try {
    // Estimate gas
    const gasEstimate = await contract.reportViolation.estimateGas(
      encrypted.data,
      encrypted.signature,
      location,
      description
    );

    // Add 20% buffer
    const gasLimit = gasEstimate * 120n / 100n;

    // Submit with custom gas limit
    return await contract.reportViolation(
      encrypted.data,
      encrypted.signature,
      location,
      description,
      { gasLimit }
    );
  } catch (error) {
    if (error.message.includes('paused')) {
      throw new Error('Contract is currently paused for maintenance');
    }

    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient ETH balance for transaction');
    }

    throw error;
  }
}
```

✅ **Check contract state**:
```typescript
async function checkContractStatus() {
  const isPaused = await contract.paused();

  if (isPaused) {
    throw new Error('Contract is paused. Please try again later.');
  }

  return true;
}

async function submitViolation(data: ViolationData) {
  await checkContractStatus();

  const encrypted = await encrypt(client, data.value);
  return contract.reportViolation(...);
}
```

---

### 7. Module Import Errors

**Problem**:
```
Error: Cannot find module '@zama/fhevm-sdk'
Error: Cannot find module '@zama/fhevm-sdk/react'
```

**Causes**:
- Package not installed
- Wrong import path
- Build/bundler configuration issue

**Solutions**:

✅ **Verify installation**:
```bash
npm list @zama/fhevm-sdk

# If not installed:
npm install @zama/fhevm-sdk
```

✅ **Check import paths**:
```typescript
// ✅ Correct imports
import { createFhevmClient } from '@zama/fhevm-sdk';
import { FhevmProvider, useFhevm } from '@zama/fhevm-sdk/react';

// ❌ Wrong imports
import { createFhevmClient } from '@zama/fhevm-sdk/core'; // Don't use /core
import { useFhevm } from '@zama/fhevm-sdk'; // React hooks are in /react
```

✅ **Next.js - Update next.config.js**:
```javascript
// next.config.js
module.exports = {
  transpilePackages: ['@zama/fhevm-sdk'],
};
```

✅ **Vite - Update vite.config.ts**:
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['@zama/fhevm-sdk'],
  },
});
```

---

### 8. TypeScript Errors

**Problem**:
```
Error: Could not find a declaration file for module '@zama/fhevm-sdk'
```

**Solutions**:

✅ **Ensure types are installed**:
```bash
# SDK includes TypeScript types by default
npm install @zama/fhevm-sdk
```

✅ **Check tsconfig.json**:
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

✅ **Create type declaration if needed**:
```typescript
// types/fhevm-sdk.d.ts
declare module '@zama/fhevm-sdk' {
  export * from '@zama/fhevm-sdk';
}
```

---

### 9. Performance Issues

**Problem**:
- Slow encryption
- High memory usage
- App freezing during operations

**Solutions**:

✅ **Initialize client once**:
```typescript
// ❌ Don't create new client every time
function BadComponent() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    // This runs on every render!
    createFhevmClient({...}).then(setClient);
  });
}

// ✅ Use provider pattern
function App() {
  return (
    <FhevmProvider network="sepolia">
      <GoodComponent />
    </FhevmProvider>
  );
}
```

✅ **Batch operations**:
```typescript
// ❌ Sequential encryption (slow)
for (const value of values) {
  await encrypt(client, value);
}

// ✅ Parallel encryption (fast)
const encrypted = await Promise.all(
  values.map(value => encrypt(client, value))
);
```

✅ **Use web workers for heavy operations**:
```typescript
// worker.ts
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

self.onmessage = async (e) => {
  const { value } = e.data;
  const client = await createFhevmClient({...});
  const encrypted = await encrypt(client, value);
  self.postMessage(encrypted);
};

// main.ts
const worker = new Worker('./worker.ts');

worker.postMessage({ value: 1000 });
worker.onmessage = (e) => {
  console.log('Encrypted:', e.data);
};
```

---

### 10. Build/Deployment Issues

**Problem**:
- Build fails in production
- Module not found in production
- Different behavior in dev vs prod

**Solutions**:

✅ **Vercel deployment**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "installCommand": "npm ci"
}
```

✅ **Environment variables**:
```bash
# .env.local (development)
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.zama.ai

# Add to Vercel environment variables for production
```

✅ **Check build output**:
```bash
# Build locally to test
npm run build

# Check for errors
npm run start
```

---

## 🔍 Debugging Tips

### 1. Enable Console Logging

```typescript
// Add logging to track flow
console.log('[FHEVM] Initializing client...');
const client = await createFhevmClient({...});
console.log('[FHEVM] Client ready:', client);

console.log('[FHEVM] Encrypting value:', value);
const encrypted = await encrypt(client, value);
console.log('[FHEVM] Encrypted:', encrypted);
```

### 2. Use Browser DevTools

```typescript
// Expose client for debugging (dev only)
if (process.env.NODE_ENV === 'development') {
  (window as any).__fhevmClient = client;
}

// Then in console:
// __fhevmClient.network
// await encrypt(__fhevmClient, 100)
```

### 3. Check Network Tab

- Monitor gateway requests
- Verify correct endpoints
- Check request/response payloads
- Look for CORS errors

### 4. Verify Contract State

```typescript
// Check contract is deployed
const code = await provider.getCode(contractAddress);
if (code === '0x') {
  console.error('Contract not deployed at:', contractAddress);
}

// Check contract is not paused
const paused = await contract.paused();
console.log('Contract paused:', paused);
```

---

## 📞 Getting Help

### Before Opening an Issue

1. ✅ Check this troubleshooting guide
2. ✅ Search existing issues on GitHub
3. ✅ Try the live demo to see expected behavior
4. ✅ Verify your environment (Node version, npm version)
5. ✅ Create minimal reproduction

### When Opening an Issue

Include:
- SDK version (`npm list @zama/fhevm-sdk`)
- Node.js version (`node --version`)
- Framework and version (React 19, Next.js 16, etc.)
- Error message and stack trace
- Minimal code to reproduce
- Expected vs actual behavior

### Resources

- **GitHub Issues**: https://github.com/LonHeidenreich/fhevm-react-template/issues
- **Live Demo**: https://violation-handler.vercel.app/
- **SDK Documentation**: [../packages/fhevm-sdk/README.md](../packages/fhevm-sdk/README.md)
- **Best Practices**: [BEST_PRACTICES.md](./BEST_PRACTICES.md)

---

**Still having issues? Open an issue on GitHub with detailed information!** 🔧
