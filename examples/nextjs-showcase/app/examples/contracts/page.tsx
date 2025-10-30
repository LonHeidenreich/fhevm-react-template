'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Link from 'next/link';
import { ArrowLeft, FileCode, Loader2, CheckCircle, Send } from 'lucide-react';

// Example contract ABI (simplified)
const EXAMPLE_ABI = [
  {
    name: 'submitEncryptedValue',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'encryptedData', type: 'bytes' },
      { name: 'signature', type: 'bytes' }
    ],
    outputs: []
  }
] as const;

export default function ContractsPage() {
  const { client, isReady } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt(client);
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [contractAddress, setContractAddress] = useState('0x0000000000000000000000000000000000000000');
  const [valueToEncrypt, setValueToEncrypt] = useState('42');
  const [result, setResult] = useState<string>('');

  const handleSubmit = async () => {
    if (!address) {
      setResult('Error: Please connect your wallet first');
      return;
    }

    try {
      setResult('Encrypting value...');

      // Step 1: Encrypt the value
      const encrypted = await encrypt(parseInt(valueToEncrypt));
      setResult(`Value encrypted successfully.\n\nSending transaction...`);

      // Step 2: Send to contract
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: EXAMPLE_ABI,
        functionName: 'submitEncryptedValue',
        args: [encrypted.data as `0x${string}`, encrypted.signature as `0x${string}`],
      });

      setResult(`Transaction submitted!\n\nWaiting for confirmation...`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold">Contract Interaction</h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status */}
        <div className="mb-8 p-4 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {isReady ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-600">FHEVM SDK Ready</span>
              </>
            ) : (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
                <span className="font-medium text-yellow-600">Initializing...</span>
              </>
            )}
          </div>
          {address && (
            <div className="text-sm text-gray-600">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>

        {/* Contract Interaction */}
        <div className="space-y-6">
          {/* Main Form */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              Submit Encrypted Data to Contract
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This example demonstrates how to encrypt data and send it to a smart contract
                in a single workflow.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Contract Address</label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Value to Encrypt</label>
                <input
                  type="number"
                  value={valueToEncrypt}
                  onChange={(e) => setValueToEncrypt(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a number"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isReady || !address || isEncrypting || isPending || isConfirming}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(isEncrypting || isPending || isConfirming) && <Loader2 className="w-4 h-4 animate-spin" />}
                {!address ? 'Connect Wallet First' :
                 isEncrypting ? 'Encrypting...' :
                 isPending ? 'Confirming...' :
                 isConfirming ? 'Waiting for Confirmation...' :
                 'Encrypt & Submit'}
              </button>

              {isSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Transaction Confirmed!</span>
                  </div>
                  {hash && (
                    <div className="mt-2 text-sm text-green-600 font-mono">
                      Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Workflow Explanation */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              Complete Workflow
            </h4>
            <ol className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="font-bold bg-blue-200 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <div>
                  <div className="font-semibold">Client-side Encryption</div>
                  <div className="text-blue-700">The SDK encrypts your data using FHE</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold bg-blue-200 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <div>
                  <div className="font-semibold">Transaction Creation</div>
                  <div className="text-blue-700">Encrypted data is packaged into a transaction</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold bg-blue-200 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <div>
                  <div className="font-semibold">Wallet Signature</div>
                  <div className="text-blue-700">User signs the transaction with their wallet</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold bg-blue-200 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">4</span>
                <div>
                  <div className="font-semibold">On-chain Processing</div>
                  <div className="text-blue-700">Contract receives and processes encrypted data</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold bg-blue-200 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs">5</span>
                <div>
                  <div className="font-semibold">Confirmation</div>
                  <div className="text-blue-700">Transaction is mined and confirmed on-chain</div>
                </div>
              </li>
            </ol>
          </div>

          {/* Code Example */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h4 className="font-semibold mb-4">Code Example</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import { useWriteContract } from 'wagmi';

function MyComponent() {
  const { client } = useFhevm();
  const { encrypt } = useEncrypt(client);
  const { writeContract } = useWriteContract();

  const handleSubmit = async () => {
    // 1. Encrypt the value
    const encrypted = await encrypt(42);

    // 2. Send to contract
    writeContract({
      address: '0x...',
      abi: contractABI,
      functionName: 'submitEncryptedValue',
      args: [encrypted.data, encrypted.signature],
    });
  };

  return <button onClick={handleSubmit}>Submit</button>;
}`}</code>
            </pre>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-8 bg-gray-900 text-gray-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
