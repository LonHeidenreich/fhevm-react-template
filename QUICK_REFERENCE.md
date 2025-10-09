# 🚀 Universal FHEVM SDK - Quick Reference Card

## Installation

```bash
npm install @zama/fhevm-sdk
```

## Quick Start (< 10 Lines)

```typescript
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
});

const encrypted = await encrypt(client, 42);
await contract.submit(encrypted.data, encrypted.signature);
```

## React Usage

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

// 1. Wrap app
<FhevmProvider network="sepolia">
  <App />
</FhevmProvider>

// 2. Use hooks
function Component() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async () => {
    const encrypted = await encrypt(42);
    // Use encrypted value...
  };
}
```

## Core Functions

### Initialization
```typescript
const client = await createFhevmClient({ network: 'sepolia' });
```

### Encryption
```typescript
const enc1 = await encrypt(client, 42);         // Auto-detect
const enc2 = await encryptUint32(client, 1000); // Explicit type
const enc3 = await encryptBool(client, true);
const enc4 = await encryptAddress(client, '0x...');
```

### Decryption
```typescript
// 1. Request permit
const permit = await requestDecryptionPermit(client, {
  contract: '0x...',
  user: '0x...',
});

// 2. Decrypt
const value = await decrypt(client, handle, permit);
```

## File Structure

```
fhevm-react-template/
├── packages/fhevm-sdk/       # Universal SDK
│   ├── src/core/             # Framework-agnostic
│   └── src/adapters/react/   # React hooks
├── examples/
│   └── traffic-violation-reporter/  # Real-world example
├── README.md                 # Main docs
├── SUBMISSION.md             # Competition submission
└── demo.mp4                  # Video demo
```

## Key Features

- ✅ Framework-agnostic
- ✅ < 10 lines to start
- ✅ wagmi-like API
- ✅ Full TypeScript
- ✅ Complete FHE flow
- ✅ React/Vue/Node.js support

## Documentation Links

- **Main README**: [README.md](./README.md)
- **SDK Docs**: [packages/fhevm-sdk/README.md](./packages/fhevm-sdk/README.md)
- **Example**: [examples/traffic-violation-reporter/README.md](./examples/traffic-violation-reporter/README.md)
- **Submission**: [SUBMISSION.md](./SUBMISSION.md)

## Commands

```bash
# Install dependencies
npm install

# Build SDK
npm run build:sdk

# Run example
npm run dev:traffic

# Run all checks
npm run ci
```

## Support

- **GitHub**: [Repository Issues]
- **Docs**: [Complete Documentation](./README.md)
- **Examples**: [examples/](./examples/)

---

**Universal FHEVM SDK - Making FHE development simple** 🔐
