# 🎥 Video Demo Instructions

## Overview

The **demo.mp4** file should be a comprehensive video walkthrough (5-10 minutes) demonstrating the Universal FHEVM SDK and its capabilities.

## Required Content

### 1. Introduction (30 seconds)
- Project overview
- Competition goals
- What makes this SDK universal and framework-agnostic

### 2. Quick Start Demo (2 minutes)
**Show the < 10 lines of code setup:**

```typescript
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

// Initialize
const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
});

// Encrypt
const encrypted = await encrypt(client, 42);

// Use in contract
await contract.submit(encrypted.data, encrypted.signature);
```

**Demonstrate:**
- Opening a new project
- Installing the SDK: `npm install @zama/fhevm-sdk`
- Writing the quick start code
- Running it successfully

### 3. Complete FHEVM Flow (3 minutes)

**Walk through:**

#### Initialization
```typescript
const client = await createFhevmClient({
  network: 'sepolia',
  provider: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai',
});
```

#### Input Encryption
```typescript
const encryptedAmount = await encryptUint32(client, 1000);
const encryptedAddress = await encryptAddress(client, '0x123...');
const encryptedBool = await encryptBool(client, true);
```

#### Contract Interaction
```typescript
await contract.submitConfidentialData(
  encryptedAmount.data,
  encryptedAmount.signature
);
```

#### Decryption with Permits
```typescript
// Request permit
const permit = await requestDecryptionPermit(client, {
  contract: contractAddress,
  user: userAddress,
});

// Decrypt value
const decryptedValue = await decrypt(client, handle, permit);
console.log('Decrypted:', decryptedValue); // 1000
```

### 4. Framework Integration (2 minutes)

**Show SDK usage in different frameworks:**

#### React Example
```typescript
import { FhevmProvider, useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

function App() {
  return (
    <FhevmProvider network="sepolia">
      <MyComponent />
    </FhevmProvider>
  );
}

function MyComponent() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);

  // Use encrypt function...
}
```

#### Vanilla JavaScript (Framework-Agnostic)
```javascript
import { createFhevmClient, encrypt } from '@zama/fhevm-sdk';

const client = await createFhevmClient({ network: 'sepolia' });
const encrypted = await encrypt(client, 42);
```

### 5. Traffic Violation Reporter Walkthrough (2 minutes)

**Demonstrate the real-world example:**

1. Open the Traffic Violation Reporter application
2. Show the UI with glassmorphism design
3. Connect wallet with RainbowKit
4. Fill out violation report form
5. Click submit - show encryption happening
6. Show MetaMask transaction confirmation
7. Show transaction success
8. Demonstrate viewing statistics
9. Show payment submission flow
10. Demonstrate decryption with permit

**Highlight:**
- How simple the code is using SDK hooks
- Loading states (`isEncrypting`, `isDecrypting`)
- Error handling
- User experience with FHE

### 6. Design Decisions (1 minute)

**Explain key architectural choices:**

1. **Framework-Agnostic Core**: Why we separated core from adapters
2. **wagmi-like API**: Inspiration and developer experience
3. **Single Package**: Why wrapping dependencies matters
4. **Type Safety**: Benefits of full TypeScript support
5. **Modular Architecture**: How to extend for Vue, Node.js, etc.

### 7. Code Structure Overview (30 seconds)

**Show the repository structure:**
```
packages/fhevm-sdk/
├── src/
│   ├── core/          # Framework-agnostic core
│   ├── adapters/      # React, Vue, Node.js
│   └── index.ts       # Main exports
examples/
├── nextjs-showcase/   # Full demo
└── traffic-violation-reporter/  # Real-world example
```

### 8. Conclusion (30 seconds)
- Summary of SDK benefits
- Competition deliverables checklist
- Thank you and future roadmap

## Recording Tips

### Setup
1. **Clean Development Environment**
   - Close unnecessary applications
   - Clear terminal history
   - Have code examples ready
   - Test everything before recording

2. **Screen Recording Settings**
   - Resolution: 1920x1080 (1080p)
   - Frame rate: 30fps minimum
   - Audio: Clear voice, no background noise
   - Cursor highlighting recommended

3. **Code Editor**
   - Use large font size (18-20pt)
   - Use a clean theme (e.g., GitHub Dark, One Dark Pro)
   - Enable word wrap
   - Show minimap for context

### Recording Flow

```bash
# Terminal commands to demonstrate

# 1. Quick Start
mkdir fhevm-quick-start && cd fhevm-quick-start
npm init -y
npm install @zama/fhevm-sdk ethers

# 2. Create demo file
code index.ts

# 3. Run the code
npx ts-node index.ts

# 4. Show Traffic Violation Reporter
cd ../examples/traffic-violation-reporter
npm install
npm run dev

# 5. Open browser to localhost:3000
```

### Presentation Tips

1. **Speak Clearly**: Explain what you're doing as you do it
2. **Show, Don't Just Tell**: Actually run the code, don't just show it
3. **Highlight Key Points**: Pause on important concepts
4. **Demonstrate Errors**: Show error handling working
5. **Real-Time Coding**: Write some code live to show simplicity

## Video Editing

### Required Elements
- **Title Slide**: "Universal FHEVM SDK - Competition Submission"
- **Chapter Markers**: Use chapters for each section
- **Code Highlights**: Zoom in on important code
- **Transitions**: Smooth transitions between sections
- **Background Music**: Optional, low volume, non-distracting

### Tools Recommendations
- **Recording**: OBS Studio, QuickTime, Camtasia
- **Editing**: DaVinci Resolve, iMovie, Camtasia
- **Compression**: HandBrake (H.264, CRF 23)

## Final Checklist

Before finalizing demo.mp4:

- [ ] Video length: 5-10 minutes
- [ ] Quality: 1080p, 30fps minimum
- [ ] Audio: Clear voice, good levels
- [ ] Shows quick start (< 10 lines)
- [ ] Demonstrates complete FHE flow
- [ ] Shows framework-agnostic usage
- [ ] Walks through Traffic Violation Reporter
- [ ] Explains design decisions
- [ ] All code shown actually works
- [ ] No sensitive information visible
- [ ] File size < 100MB (for easy sharing)
- [ ] Format: MP4 (H.264 codec)

## Script Template

```
[TITLE SLIDE]
"Universal FHEVM SDK - A Framework-Agnostic Toolkit for Confidential Frontends"

[INTRODUCTION]
"Hi, I'm [NAME] and this is my submission for the Zama FHEVM SDK Competition.
Today I'll show you a universal SDK that makes FHE development simple,
consistent, and framework-agnostic."

[QUICK START]
"Let's start with the most important part - how easy it is to get started.
Here's a complete example in less than 10 lines of code..."
[Show the code and run it]

[COMPLETE FLOW]
"Now let me walk you through the complete FHEVM flow..."
[Demonstrate each step]

[FRAMEWORK INTEGRATION]
"One of the key features is framework-agnosticism. Let me show you
how the same SDK works in React, Vue, and vanilla JavaScript..."
[Show examples]

[REAL-WORLD EXAMPLE]
"To demonstrate real-world usage, I built a Traffic Violation Reporter
application. Let me walk you through it..."
[Show the app in action]

[DESIGN DECISIONS]
"Let me explain some key design decisions..."
[Discuss architecture]

[CONCLUSION]
"This SDK delivers on all competition criteria: it's easy to use,
complete, reusable, and well-documented. Thank you for watching!"
```

## Export Settings

```
Format: MP4
Codec: H.264
Resolution: 1920x1080
Frame Rate: 30fps
Bitrate: 5-8 Mbps (VBR)
Audio: AAC, 256kbps, 48kHz
File Size: Target < 100MB
```

---

**Note**: Once recorded, place the `demo.mp4` file in the root of the repository:
```
fhevm-react-template/demo.mp4
```

And link it in the main README.md.
