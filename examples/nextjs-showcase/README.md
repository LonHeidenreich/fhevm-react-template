# Next.js FHEVM SDK Showcase

A comprehensive Next.js application demonstrating the full capabilities of the Universal FHEVM SDK for building confidential, privacy-preserving decentralized applications.

## Overview

This showcase provides complete examples of:
- **FHEVM Client Initialization** - Setup and configuration
- **Input Encryption** - Encrypt various data types (uint8, uint16, uint32, bool, address)
- **Contract Interaction** - Send encrypted data to smart contracts
- **Decryption with Permits** - Request permits and decrypt confidential data
- **React Hooks Integration** - Use SDK hooks in React components
- **Real-time State Management** - Handle loading states and errors
- **Type Safety** - Full TypeScript support

## Features

### SDK Integration Examples

1. **Basic Encryption**
   - Encrypt numbers, booleans, and addresses
   - Auto-type detection
   - Error handling and validation

2. **Advanced Decryption**
   - Permit signature requests
   - Batch decryption
   - Permission management

3. **Contract Operations**
   - Type-safe contract calls
   - Gas estimation
   - Transaction monitoring

4. **React Hooks**
   - `useFhevm()` - Access FHEVM client
   - `useEncrypt()` - Encryption operations
   - `useDecrypt()` - Decryption with permits

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
nextjs-showcase/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles
│   ├── providers.tsx              # FHEVM and Web3 providers
│   ├── demo/
│   │   └── page.tsx               # Comprehensive FHE demo
│   ├── examples/
│   │   ├── encryption/page.tsx    # Encryption examples
│   │   ├── decryption/page.tsx    # Decryption examples
│   │   └── contracts/page.tsx     # Contract interaction
│   └── api/                       # API routes
│       ├── fhe/
│       │   ├── route.ts           # FHE operations
│       │   ├── encrypt/route.ts   # Encryption API
│       │   ├── decrypt/route.ts   # Decryption API
│       │   └── compute/route.ts   # Computation API
│       └── keys/route.ts          # Key management
│
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                       # FHE components
│   │   ├── FHEProvider.tsx        # FHE context provider
│   │   ├── EncryptionDemo.tsx     # Encryption demo
│   │   ├── ComputationDemo.tsx    # Computation demo
│   │   └── KeyManager.tsx         # Key management UI
│   └── examples/                  # Use case examples
│       ├── BankingExample.tsx     # Banking use case
│       └── MedicalExample.tsx     # Medical use case
│
├── hooks/                         # Custom React hooks
│   ├── useFHE.ts                  # FHE operations hook
│   ├── useEncryption.ts           # Encryption hook
│   └── useComputation.ts          # Computation hook
│
├── lib/                           # Utility libraries
│   ├── fhe/                       # FHE integration
│   │   ├── client.ts              # Client-side FHE
│   │   ├── server.ts              # Server-side FHE
│   │   ├── keys.ts                # Key management
│   │   └── types.ts               # FHE type definitions
│   └── utils/                     # Utility functions
│       ├── security.ts            # Security utilities
│       └── validation.ts          # Validation functions
│
├── types/                         # TypeScript types
│   ├── fhe.ts                     # FHE type definitions
│   └── api.ts                     # API type definitions
│
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## Usage Examples

### Basic Encryption

```typescript
'use client';

import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

export function EncryptionExample() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42);
    console.log('Encrypted:', encrypted);
  };

  if (!isReady) return <div>Initializing FHEVM...</div>;

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

### Decryption with Permits

```typescript
'use client';

import { useFhevm, useDecrypt } from '@zama/fhevm-sdk/react';

export function DecryptionExample() {
  const { client } = useFhevm();
  const { decrypt, requestPermit, isDecrypting } = useDecrypt(client);

  const handleDecrypt = async (handle: bigint) => {
    // Request permit signature
    const permit = await requestPermit({
      contract: '0x123...',
      user: '0xabc...',
    });

    // Decrypt value
    const decrypted = await decrypt(handle, permit);
    console.log('Decrypted:', decrypted);
  };

  return (
    <button onClick={() => handleDecrypt(123n)} disabled={isDecrypting}>
      Decrypt Value
    </button>
  );
}
```

### Provider Setup

```typescript
'use client';

import { FhevmProvider } from '@zama/fhevm-sdk/react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FhevmProvider network="sepolia">
          {children}
        </FhevmProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## SDK Features Demonstrated

### 1. Core FHE Operations
- **Encryption**: All data types (uint8, uint16, uint32, uint64, bool, address)
- **Computation**: Homomorphic operations (add, subtract, multiply, compare)
- **Decryption**: Secure decryption with permit validation
- **Key Management**: Generate, validate, and manage FHE keys

### 2. API Routes
- `/api/fhe/encrypt` - Encryption endpoint
- `/api/fhe/decrypt` - Decryption with permits
- `/api/fhe/compute` - Homomorphic computations
- `/api/keys` - Key generation and management

### 3. Custom Hooks
- `useFHE()` - Complete FHE operations
- `useEncryption()` - Encryption with state management
- `useComputation()` - Homomorphic computation operations

### 4. Real-World Examples
- **Banking**: Confidential transactions and balance management
- **Medical**: HIPAA-compliant health record storage
- **General**: Encrypted data processing workflows

## Configuration

### FHEVM Network Settings

Edit `lib/fhevm-config.ts`:

```typescript
export const fhevmConfig = {
  network: 'sepolia',
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: '0x...',
};
```

### Web3 Configuration

Edit `lib/wagmi-config.ts`:

```typescript
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Universal FHEVM SDK** - Confidential computing
- **wagmi** - Web3 React hooks
- **RainbowKit** - Wallet connection
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components

## Best Practices

1. **Always check client readiness** before encryption/decryption
2. **Handle errors gracefully** with try-catch blocks
3. **Use loading states** to improve UX
4. **Validate permits** before decryption
5. **Never log encrypted values** in production

## Learn More

- [Universal FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
