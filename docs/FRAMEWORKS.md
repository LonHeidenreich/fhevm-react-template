# 🎨 Framework Integration Guide

The Universal FHEVM SDK is **framework-agnostic**, meaning it works with any JavaScript framework or environment.

**Repository**: https://github.com/LonHeidenreich/fhevm-react-template

**Live Demo**: https://violation-handler.vercel.app/

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Universal FHEVM SDK Core            │
│  (Framework-agnostic functionality)     │
└─────────────────────────────────────────┘
                  ▼
    ┌─────────────┬──────────────┬──────────────┐
    ▼             ▼              ▼              ▼
┌─────────┐  ┌─────────┐   ┌─────────┐   ┌─────────┐
│  React  │  │   Vue   │   │ Node.js │   │ Vanilla │
│ Adapter │  │ Adapter │   │  API    │   │   JS    │
└─────────┘  └─────────┘   └─────────┘   └─────────┘
```

---

## ⚛️ React Integration

### Installation

```bash
npm install @zama/fhevm-sdk react react-dom
```

### Setup

```typescript
// app/layout.tsx
import { FhevmProvider } from '@zama/fhevm-sdk/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FhevmProvider network="sepolia">
          {children}
        </FhevmProvider>
      </body>
    </html>
  );
}
```

### Using Hooks

```typescript
// components/EncryptForm.tsx
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

export function EncryptForm() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting, error } = useEncrypt(client);

  const handleSubmit = async (value: number) => {
    try {
      const encrypted = await encrypt(value);
      await contract.submit(encrypted.data, encrypted.signature);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  if (!isReady) return <div>Initializing FHEVM...</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(1000);
    }}>
      <button type="submit" disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
```

### Decryption Example

```typescript
import { useFhevm, useDecrypt } from '@zama/fhevm-sdk/react';
import { useAccount } from 'wagmi';

export function DecryptButton({ handle }: { handle: string }) {
  const { client } = useFhevm();
  const { address } = useAccount();
  const { decrypt, requestPermit, isDecrypting } = useDecrypt(client);
  const [value, setValue] = useState<number | null>(null);

  const handleDecrypt = async () => {
    const permit = await requestPermit({
      contract: contractAddress,
      user: address,
    });

    const decrypted = await decrypt(handle, permit);
    setValue(Number(decrypted));
  };

  return (
    <div>
      <button onClick={handleDecrypt} disabled={isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
      {value !== null && <p>Decrypted value: {value}</p>}
    </div>
  );
}
```

### Available React Hooks

| Hook | Description | Returns |
|------|-------------|---------|
| `useFhevm()` | Access FHEVM client | `{ client, isReady, isInitializing, error }` |
| `useEncrypt(client)` | Encrypt values | `{ encrypt, isEncrypting, error }` |
| `useDecrypt(client)` | Decrypt values | `{ decrypt, requestPermit, isDecrypting, error }` |

---

## 🟢 Vue.js Integration

### Installation

```bash
npm install @zama/fhevm-sdk vue
```

### Setup (Vue 3 Composition API)

```typescript
// main.ts
import { createApp } from 'vue';
import { createFhevmPlugin } from '@zama/fhevm-sdk/vue';
import App from './App.vue';

const app = createApp(App);

app.use(createFhevmPlugin({
  network: 'sepolia',
}));

app.mount('#app');
```

### Using Composables

```vue
<!-- components/EncryptForm.vue -->
<script setup lang="ts">
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/vue';
import { ref } from 'vue';

const { client, isReady } = useFhevm();
const { encrypt, isEncrypting, error } = useEncrypt(client);
const value = ref(1000);

const handleSubmit = async () => {
  try {
    const encrypted = await encrypt(value.value);
    await contract.submit(encrypted.data, encrypted.signature);
  } catch (err) {
    console.error('Encryption failed:', err);
  }
};
</script>

<template>
  <div v-if="!isReady">Initializing FHEVM...</div>

  <form v-else @submit.prevent="handleSubmit">
    <input v-model.number="value" type="number" />
    <button type="submit" :disabled="isEncrypting">
      {{ isEncrypting ? 'Encrypting...' : 'Submit' }}
    </button>
    <p v-if="error" class="error">{{ error.message }}</p>
  </form>
</template>
```

### Decryption Example

```vue
<!-- components/DecryptButton.vue -->
<script setup lang="ts">
import { useFhevm, useDecrypt } from '@zama/fhevm-sdk/vue';
import { ref } from 'vue';

const props = defineProps<{ handle: string }>();

const { client } = useFhevm();
const { decrypt, requestPermit, isDecrypting } = useDecrypt(client);
const decryptedValue = ref<number | null>(null);

const handleDecrypt = async () => {
  const permit = await requestPermit({
    contract: contractAddress,
    user: userAddress,
  });

  const value = await decrypt(props.handle, permit);
  decryptedValue.value = Number(value);
};
</script>

<template>
  <div>
    <button @click="handleDecrypt" :disabled="isDecrypting">
      {{ isDecrypting ? 'Decrypting...' : 'Decrypt' }}
    </button>
    <p v-if="decryptedValue !== null">
      Decrypted value: {{ decryptedValue }}
    </p>
  </div>
</template>
```

### Available Vue Composables

| Composable | Description | Returns |
|------------|-------------|---------|
| `useFhevm()` | Access FHEVM client | `{ client, isReady, isInitializing, error }` |
| `useEncrypt(client)` | Encrypt values | `{ encrypt, isEncrypting, error }` |
| `useDecrypt(client)` | Decrypt values | `{ decrypt, requestPermit, isDecrypting, error }` |

---

## 🟦 Node.js / Backend Integration

### Installation

```bash
npm install @zama/fhevm-sdk
```

### Basic Usage

```typescript
// server.ts
import { createFhevmClient, encrypt, decrypt } from '@zama/fhevm-sdk';

async function main() {
  // Initialize client with private key for backend
  const client = await createFhevmClient({
    network: 'sepolia',
    privateKey: process.env.PRIVATE_KEY, // Backend only!
  });

  // Encrypt data
  const encrypted = await encrypt(client, 1000);
  console.log('Encrypted:', encrypted);

  // Send to contract
  const tx = await contract.submit(encrypted.data, encrypted.signature);
  await tx.wait();
}

main().catch(console.error);
```

### Express.js API Example

```typescript
// api/encrypt.ts
import express from 'express';
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

const app = express();
app.use(express.json());

// Initialize client once
let fhevmClient: FhevmClient;

async function initClient() {
  fhevmClient = await createFhevmClient({
    network: 'sepolia',
    privateKey: process.env.PRIVATE_KEY,
  });
}

app.post('/api/encrypt', async (req, res) => {
  try {
    const { value } = req.body;

    if (!fhevmClient) {
      await initClient();
    }

    const encrypted = await encrypt(fhevmClient, value);

    res.json({
      success: true,
      data: encrypted.data,
      signature: encrypted.signature,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  initClient();
});
```

### Next.js API Route

```typescript
// app/api/encrypt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

// Initialize client outside handler for reuse
let client: FhevmClient | null = null;

async function getClient() {
  if (!client) {
    client = await createFhevmClient({
      network: 'sepolia',
      privateKey: process.env.PRIVATE_KEY,
    });
  }
  return client;
}

export async function POST(req: NextRequest) {
  try {
    const { value } = await req.json();
    const fhevmClient = await getClient();

    const encrypted = await encrypt(fhevmClient, value);

    return NextResponse.json({
      success: true,
      encrypted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🌐 Vanilla JavaScript

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>FHEVM SDK Example</title>
</head>
<body>
  <div id="app">
    <button id="encryptBtn">Encrypt</button>
    <div id="status"></div>
  </div>

  <script type="module">
    import { createFhevmClient, encrypt } from 'https://esm.sh/@zama/fhevm-sdk';

    let client;
    const statusEl = document.getElementById('status');

    // Initialize
    async function init() {
      statusEl.textContent = 'Initializing...';

      client = await createFhevmClient({
        network: 'sepolia',
        provider: window.ethereum,
      });

      statusEl.textContent = 'Ready';
    }

    // Encrypt on button click
    document.getElementById('encryptBtn').addEventListener('click', async () => {
      try {
        statusEl.textContent = 'Encrypting...';

        const encrypted = await encrypt(client, 1000);

        console.log('Encrypted:', encrypted);
        statusEl.textContent = 'Encrypted successfully!';
      } catch (error) {
        statusEl.textContent = 'Error: ' + error.message;
      }
    });

    init();
  </script>
</body>
</html>
```

---

## 🔧 Custom Framework Integration

### Create Your Own Adapter

```typescript
// adapters/custom-framework.ts
import { createFhevmClient, encrypt, decrypt } from '@zama/fhevm-sdk';
import type { FhevmClient } from '@zama/fhevm-sdk';

export class CustomFrameworkAdapter {
  private client: FhevmClient | null = null;
  private listeners: Set<() => void> = new Set();

  async initialize(network: string) {
    this.client = await createFhevmClient({
      network,
      provider: window.ethereum,
    });

    this.notifyListeners();
  }

  getClient(): FhevmClient | null {
    return this.client;
  }

  isReady(): boolean {
    return this.client !== null;
  }

  onReady(callback: () => void) {
    this.listeners.add(callback);

    if (this.isReady()) {
      callback();
    }

    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  async encrypt(value: any) {
    if (!this.client) throw new Error('Client not initialized');
    return encrypt(this.client, value);
  }

  async decrypt(handle: string, permit: any) {
    if (!this.client) throw new Error('Client not initialized');
    return decrypt(this.client, handle, permit);
  }
}

export const fhevmAdapter = new CustomFrameworkAdapter();
```

---

## 📊 Framework Comparison

| Framework | Setup Complexity | Lines of Code | Learning Curve | Best For |
|-----------|------------------|---------------|----------------|----------|
| React | Low | ~10 lines | Easy | SPAs, Web apps |
| Vue | Low | ~12 lines | Easy | SPAs, Progressive apps |
| Node.js | Very Low | ~5 lines | Very Easy | Backend, APIs |
| Vanilla JS | Medium | ~20 lines | Medium | Simple pages, CDN |

---

## 🎯 Best Practices by Framework

### React
- ✅ Use `FhevmProvider` at app root
- ✅ Leverage hooks for state management
- ✅ Handle loading states with `isReady`
- ✅ Use Suspense for better UX (optional)

### Vue
- ✅ Use plugin in `main.ts`
- ✅ Leverage composables for reactivity
- ✅ Use `v-if` for conditional rendering
- ✅ Bind loading states to UI

### Node.js
- ✅ Initialize client once, reuse
- ✅ Use private keys securely (env vars)
- ✅ Handle errors gracefully
- ✅ Cache client instance

### Vanilla JS
- ✅ Check for `window.ethereum`
- ✅ Handle provider connection
- ✅ Show clear loading states
- ✅ Provide error feedback

---

## 🚀 Next Steps

1. **Choose Your Framework**: Pick the framework that matches your project
2. **Install SDK**: `npm install @zama/fhevm-sdk`
3. **Follow Integration Guide**: Use examples above
4. **Check Examples**: See [examples/](../examples/) folder
5. **Read API Docs**: [packages/fhevm-sdk/README.md](../packages/fhevm-sdk/README.md)

---

## 📚 Additional Resources

- **Live Example (React)**: https://violation-handler.vercel.app/
- **SDK Documentation**: [../packages/fhevm-sdk/README.md](../packages/fhevm-sdk/README.md)
- **Migration Guide**: [MIGRATION.md](./MIGRATION.md)
- **Best Practices**: [BEST_PRACTICES.md](./BEST_PRACTICES.md)

---

**The Universal FHEVM SDK works everywhere!** 🎨

Choose your framework and start building confidential applications today.
