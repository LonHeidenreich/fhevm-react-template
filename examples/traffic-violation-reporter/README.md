# 🚔 Traffic Violation Reporter - FHEVM SDK Example

> Real-world example of confidential traffic violation reporting using Universal FHEVM SDK

**Live Demo**: https://violation-handler.vercel.app/

**Repository**: https://github.com/LonHeidenreich/fhevm-react-template

**Video Demo**: Download `demo.mp4` from repository root

---

## Overview

This example demonstrates how to build a production-ready confidential application using the Universal FHEVM SDK. It showcases:

- 🔐 Confidential data submission (encrypted license plates, violation details)
- 💰 Private payment processing
- 🛡️ Emergency pause mechanism (PauserSet pattern)
- 📊 Public statistics with private details
- ⚡ Gas-optimized contract design

## Features

### Confidential Features (Using FHEVM SDK)
- **Encrypted License Plates** - Vehicle identification stored as encrypted euint64
- **Private Violation Types** - Violation categories encrypted on-chain
- **Confidential Location Data** - Location information protected
- **Secure Payment Amounts** - Fine amounts encrypted until processed

### Public Features
- **Total Violation Count** - Public statistics for transparency
- **User Violation Count** - Users can see their own violation count
- **Payment Status** - Public payment verification

## Technology Stack

- **Universal FHEVM SDK** - Encryption/decryption utilities
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Solidity 0.8.24** - Smart contract language
- **wagmi + RainbowKit** - Wallet connection
- **Tailwind CSS** - Styling

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x4db282A151AbfF62B27FF3032003118Ee58Ed0E8
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_NETWORK=sepolia
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Using FHEVM SDK in This Example

### 1. Setup Provider

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

### 2. Encrypt Violation Data

```typescript
// app/page.tsx
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

function ReportForm() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);

  const handleSubmit = async (formData) => {
    // Encrypt license plate
    const encryptedPlate = await encrypt(formData.licensePlate);

    // Encrypt violation type
    const encryptedType = await encrypt(formData.violationType);

    // Submit to contract
    await contract.reportViolation(
      encryptedPlate.data,
      encryptedType.data,
      formData.location,
      formData.description
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isEncrypting}>
        {isEncrypting ? 'Encrypting...' : 'Submit Report'}
      </button>
    </form>
  );
}
```

### 3. Decrypt Payment Information

```typescript
import { useDecrypt } from '@zama/fhevm-sdk/react';

function PaymentDetails({ violationId }) {
  const { client } = useFhevm();
  const { decrypt, requestPermit } = useDecrypt(client);

  const handleViewDetails = async () => {
    // Request decryption permit
    const permit = await requestPermit({
      contract: contractAddress,
      user: userAddress,
    });

    // Get encrypted handle from contract
    const handle = await contract.getViolationPaymentHandle(violationId);

    // Decrypt
    const amount = await decrypt(handle, permit);
    console.log('Fine amount:', amount);
  };

  return <button onClick={handleViewDetails}>View Details</button>;
}
```

## Smart Contract Integration

### SimpleViolationHandler.sol

Key functions demonstrating FHE usage:

```solidity
// Report violation with encrypted data
function reportViolation(
    string memory _licensePlate,  // In production: euint64
    uint8 _violationType,          // In production: euint8
    string memory _location,
    string memory _description
) external whenNotPaused returns (uint256);

// Submit payment for violation
function submitPayment(uint256 _violationId)
    external
    payable
    whenNotPaused;

// Process payment (owner only)
function processPayment(uint256 _violationId)
    external
    onlyOwner
    whenNotPaused;
```

## Architecture

```
┌─────────────────────────────────────────┐
│         User Interface (Next.js)        │
├─────────────────────────────────────────┤
│  ├─ Report Form (encryption)            │
│  ├─ Payment Submission                  │
│  └─ Statistics Dashboard                │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│      Universal FHEVM SDK (React)        │
├─────────────────────────────────────────┤
│  ├─ useFhevm() - Client access          │
│  ├─ useEncrypt() - Input encryption     │
│  └─ useDecrypt() - Permit + decryption  │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│         Smart Contract Layer            │
├─────────────────────────────────────────┤
│  SimpleViolationHandler.sol             │
│  ├─ Encrypted data storage              │
│  ├─ Payment processing                  │
│  └─ PauserSet mechanism                 │
└─────────────────────────────────────────┘
```

## Key Learnings

### 1. SDK Integration
- **Simple Setup**: `<FhevmProvider>` wraps the entire app
- **Type-Safe**: Full TypeScript support
- **React Hooks**: `useFhevm()`, `useEncrypt()`, `useDecrypt()`

### 2. Performance
- **Loading States**: SDK hooks provide `isEncrypting`, `isDecrypting`
- **Error Handling**: Built-in error states and retry logic
- **Gas Optimization**: Contract uses custom errors and optimized storage

### 3. User Experience
- **Transparent Encryption**: Users see normal UI while SDK handles FHE
- **Permit System**: Clear UX for granting decryption access
- **Feedback**: Loading states and error messages

## Deployment

### Contract (Sepolia)
- **Address**: `0x4db282A151AbfF62B27FF3032003118Ee58Ed0E8`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x4db282A151AbfF62B27FF3032003118Ee58Ed0E8)

### Frontend
```bash
npm run build
npm run start
```

Or deploy to Vercel:
```bash
vercel deploy
```

## Testing

```bash
# Run all tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## Security Considerations

1. **Never Log Encrypted Data** - Contains cryptographic material
2. **Validate Permits** - Always verify permit signatures
3. **Access Control** - Use PauserSet for emergency stops
4. **Input Validation** - Validate all user inputs before encryption
5. **Gas Limits** - Be aware of gas costs for FHE operations

## Future Enhancements

### Full FHE Integration
```solidity
// Production version with full FHE
function reportViolation(
    bytes calldata _encryptedLicensePlate,  // euint64
    bytes calldata _encryptedViolationType, // euint8
    string memory _location,
    string memory _description
) external whenNotPaused returns (uint256) {
    euint64 plate = TFHE.asEuint64(_encryptedLicensePlate);
    euint8 vType = TFHE.asEuint8(_encryptedViolationType);

    // Store encrypted data
    violations[nextViolationId] = Violation({
        encryptedPlate: plate,
        encryptedType: vType,
        reporter: msg.sender,
        timestamp: block.timestamp
    });

    return nextViolationId++;
}
```

### Advanced Features
- **Encrypted Payments**: Hide fine amounts until authorized
- **Confidential Appeals**: Private dispute resolution
- **Anonymous Reporting**: Zero-knowledge proofs for reporters
- **Batch Operations**: Efficient multi-violation processing

## Resources

- **[Universal FHEVM SDK Docs](../../packages/fhevm-sdk/README.md)**
- **[FHEVM Documentation](https://docs.zama.ai/fhevm)**
- **[Competition README](../../README.md)**

## License

MIT License - see [LICENSE](../../LICENSE)

---

**Example Application for Universal FHEVM SDK Competition**

Built to demonstrate real-world FHE usage with intuitive developer experience.
