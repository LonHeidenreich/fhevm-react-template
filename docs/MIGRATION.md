# 🔄 Migration Guide - From fhevm-react-template to Universal FHEVM SDK

This guide helps you migrate from the original `fhevm-react-template` to the Universal FHEVM SDK.

**Repository**: https://github.com/LonHeidenreich/fhevm-react-template

**Live Demo**: https://violation-handler.vercel.app/

---

## 📋 Overview

### What Changed?

**Before** (fhevm-react-template):
- Manual FHEVM setup with fhevmjs
- 30+ lines of boilerplate code
- Framework-specific implementation
- Complex provider management
- Manual error handling

**After** (Universal FHEVM SDK):
- Simple SDK installation
- < 10 lines to get started
- Framework-agnostic core
- Built-in error handling
- React hooks (+ Vue/Node.js support)

---

## 🚀 Quick Migration Steps

### Step 1: Install Universal FHEVM SDK

```bash
# Remove old dependencies (optional)
npm uninstall fhevmjs

# Install Universal FHEVM SDK
npm install @zama/fhevm-sdk
```

### Step 2: Update Imports

**Before**:
```typescript
import { initFhevm, createInstance } from 'fhevmjs';
import { BrowserProvider } from 'ethers';
```

**After**:
```typescript
import { createFhevmClient, encrypt, decrypt } from '@zama/fhevm-sdk';
// Or for React
import { FhevmProvider, useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
```

### Step 3: Simplify Initialization

**Before** (30+ lines):
```typescript
import { initFhevm, createInstance } from 'fhevmjs';
import { BrowserProvider } from 'ethers';

// Initialize FHEVM
await initFhevm();

// Setup provider
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();

// Fetch public key
const response = await fetch(`${gatewayUrl}/public-key`);
const publicKey = await response.text();

// Create instance
const instance = await createInstance({
  chainId: 11155111,
  publicKey,
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  aclAddress: '0x...',
});
```

**After** (5 lines):
```typescript
import { createFhevmClient } from '@zama/fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
});
```

### Step 4: Update Encryption

**Before**:
```typescript
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add32(1000);
const encrypted = await input.encrypt();

await contract.submit(encrypted.handles[0], encrypted.inputProof);
```

**After**:
```typescript
const encrypted = await encrypt(client, 1000);

await contract.submit(encrypted.data, encrypted.signature);
```

### Step 5: Update Decryption

**Before**:
```typescript
// Request permit
const eip712Domain = {
  name: 'Authorization token',
  version: '1',
  chainId: 11155111,
  verifyingContract: contractAddress,
};

const eip712Types = {
  Reencrypt: [
    { name: 'publicKey', type: 'bytes' },
  ],
};

const signature = await signer.signTypedData(
  eip712Domain,
  eip712Types,
  { publicKey: instance.getPublicKey() }
);

// Decrypt
const handle = await contract.getHandle();
const decrypted = instance.decrypt(contractAddress, handle);
```

**After**:
```typescript
const permit = await requestDecryptionPermit(client, {
  contract: contractAddress,
  user: userAddress,
});

const handle = await contract.getHandle();
const decrypted = await decrypt(client, handle, permit);
```

---

## 🎯 Complete Migration Examples

### Example 1: React Component Migration

**Before** (fhevm-react-template):

```typescript
import { useEffect, useState } from 'react';
import { initFhevm, createInstance } from 'fhevmjs';
import { BrowserProvider } from 'ethers';

function EncryptionForm() {
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [encrypting, setEncrypting] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initFhevm();
        const provider = new BrowserProvider(window.ethereum);
        const publicKeyResponse = await fetch('https://gateway.sepolia.zama.ai/public-key');
        const publicKey = await publicKeyResponse.text();

        const fhevmInstance = await createInstance({
          chainId: 11155111,
          publicKey,
          gatewayUrl: 'https://gateway.sepolia.zama.ai',
          aclAddress: '0x...',
        });

        setInstance(fhevmInstance);
        setLoading(false);
      } catch (error) {
        console.error('Init failed:', error);
      }
    }
    init();
  }, []);

  const handleEncrypt = async (value) => {
    setEncrypting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const input = instance.createEncryptedInput(contractAddress, address);
      input.add32(value);
      const encrypted = await input.encrypt();

      await contract.submit(encrypted.handles[0], encrypted.inputProof);
    } finally {
      setEncrypting(false);
    }
  };

  if (loading) return <div>Initializing FHEVM...</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleEncrypt(1000);
    }}>
      <button disabled={encrypting}>
        {encrypting ? 'Encrypting...' : 'Submit'}
      </button>
    </form>
  );
}
```

**After** (Universal FHEVM SDK):

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

function EncryptionForm() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async (value) => {
    const encrypted = await encrypt(value);
    await contract.submit(encrypted.data, encrypted.signature);
  };

  if (!isReady) return <div>Initializing FHEVM...</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleEncrypt(1000);
    }}>
      <button disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit'}
      </button>
    </form>
  );
}

// App.tsx - Wrap with provider
function App() {
  return (
    <FhevmProvider network="sepolia">
      <EncryptionForm />
    </FhevmProvider>
  );
}
```

**Improvement**:
- 65% less code
- Built-in loading states
- Automatic error handling
- Cleaner, more readable

---

### Example 2: Decryption Migration

**Before**:

```typescript
import { useState } from 'react';

function DecryptButton({ contractAddress, handle }) {
  const [decrypted, setDecrypted] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDecrypt = async () => {
    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create permit
      const eip712 = {
        domain: {
          name: 'Authorization token',
          version: '1',
          chainId: 11155111,
          verifyingContract: contractAddress,
        },
        types: {
          Reencrypt: [{ name: 'publicKey', type: 'bytes' }],
        },
        message: {
          publicKey: instance.getPublicKey(),
        },
      };

      const signature = await signer.signTypedData(
        eip712.domain,
        eip712.types,
        eip712.message
      );

      // Request re-encryption
      const response = await fetch(`${gatewayUrl}/reencrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle,
          signature,
          publicKey: instance.getPublicKey(),
        }),
      });

      const { reencrypted } = await response.json();
      const value = instance.decrypt(contractAddress, reencrypted);
      setDecrypted(value);
    } catch (error) {
      console.error('Decryption failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={loading}>
        {loading ? 'Decrypting...' : 'Decrypt'}
      </button>
      {decrypted && <p>Value: {decrypted}</p>}
    </div>
  );
}
```

**After**:

```typescript
import { useFhevm, useDecrypt } from '@zama/fhevm-sdk/react';
import { useAccount } from 'wagmi';

function DecryptButton({ contractAddress, handle }) {
  const { client } = useFhevm();
  const { address } = useAccount();
  const { decrypt, requestPermit, isDecrypting } = useDecrypt(client);
  const [decrypted, setDecrypted] = useState(null);

  const handleDecrypt = async () => {
    const permit = await requestPermit({
      contract: contractAddress,
      user: address,
    });

    const value = await decrypt(handle, permit);
    setDecrypted(value);
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {decrypted && <p>Value: {decrypted}</p>}
    </div>
  );
}
```

**Improvement**:
- 70% less code
- Simplified permit flow
- Better error handling
- Built-in loading states

---

## 📊 Migration Comparison

### Lines of Code

| Feature | Before | After | Reduction |
|---------|--------|-------|-----------|
| Initialization | 30+ lines | 5 lines | 83% |
| Encryption | 8 lines | 2 lines | 75% |
| Decryption | 25 lines | 4 lines | 84% |
| **Total** | **63+ lines** | **11 lines** | **83%** |

### Dependencies

**Before**:
```json
{
  "dependencies": {
    "fhevmjs": "^0.5.0",
    "ethers": "^6.4.0"
  }
}
```

**After**:
```json
{
  "dependencies": {
    "@zama/fhevm-sdk": "^1.0.0"
  }
}
```

### Features

| Feature | Before | After |
|---------|--------|-------|
| Client initialization | Manual | Automatic |
| Error handling | Manual | Built-in |
| Loading states | Manual | Built-in |
| Type safety | Partial | Full |
| Framework support | React only | React/Vue/Node.js |
| Documentation | Basic | Comprehensive |

---

## 🔍 Migration Checklist

### Pre-Migration

- [ ] Review current FHEVM implementation
- [ ] Identify all encryption/decryption points
- [ ] Document custom configurations
- [ ] Backup current code
- [ ] Review SDK documentation

### During Migration

- [ ] Install `@zama/fhevm-sdk`
- [ ] Update imports
- [ ] Replace client initialization
- [ ] Update encryption calls
- [ ] Update decryption calls
- [ ] Add FhevmProvider (React)
- [ ] Update error handling
- [ ] Update loading states

### Post-Migration

- [ ] Test all encryption functionality
- [ ] Test all decryption functionality
- [ ] Verify permit flow works
- [ ] Test error scenarios
- [ ] Update tests
- [ ] Update documentation
- [ ] Remove old dependencies (optional)

---

## 🛠️ Troubleshooting

### Issue: "Client not initialized"

**Before**:
```typescript
// Instance might not be ready
const encrypted = await encrypt(instance, value);
```

**After**:
```typescript
// Check ready state
const { client, isReady } = useFhevm();

if (!isReady) {
  return <div>Initializing...</div>;
}
```

### Issue: "Encryption type mismatch"

**Before**:
```typescript
input.add32(value); // Must specify type
```

**After**:
```typescript
await encrypt(client, value); // Auto-detects type
// Or specify: encryptUint32(client, value)
```

### Issue: "Permit signature failed"

**Before**:
```typescript
// Complex EIP-712 signature
const signature = await signer.signTypedData(...);
```

**After**:
```typescript
// Simplified permit request
const permit = await requestPermit({ contract, user });
```

---

## 📚 Additional Resources

- **SDK Documentation**: [packages/fhevm-sdk/README.md](../packages/fhevm-sdk/README.md)
- **Live Example**: https://violation-handler.vercel.app/
- **Integration Guide**: [examples/traffic-violation-reporter/SDK_INTEGRATION.md](../examples/traffic-violation-reporter/SDK_INTEGRATION.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 💡 Best Practices After Migration

1. **Use Built-in Hooks**: Leverage `useFhevm`, `useEncrypt`, `useDecrypt`
2. **Handle Loading States**: Use `isReady`, `isEncrypting`, `isDecrypting`
3. **Error Handling**: Wrap in try/catch and use error states
4. **Type Safety**: Use TypeScript for full type support
5. **Test Thoroughly**: Verify all FHE operations work correctly

---

**Migration Complete!** 🎉

Your code is now simpler, more maintainable, and production-ready with the Universal FHEVM SDK.
