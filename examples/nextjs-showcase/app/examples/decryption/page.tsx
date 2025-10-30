'use client';

import { useState } from 'react';
import { useFhevm, useDecrypt } from '@zama/fhevm-sdk/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { ArrowLeft, Shield, Loader2, CheckCircle, Key } from 'lucide-react';

export default function DecryptionPage() {
  const { client, isReady } = useFhevm();
  const { decrypt, requestPermit, isDecrypting, isRequestingPermit } = useDecrypt(client);
  const { address } = useAccount();

  const [contractAddress, setContractAddress] = useState('0x0000000000000000000000000000000000000000');
  const [handleValue, setHandleValue] = useState('');
  const [permit, setPermit] = useState<any>(null);
  const [result, setResult] = useState<string>('');

  const handleRequestPermit = async () => {
    if (!address) {
      setResult('Error: Please connect your wallet first');
      return;
    }

    try {
      const newPermit = await requestPermit({
        contract: contractAddress,
        user: address,
      });
      setPermit(newPermit);
      setResult(`Permit requested successfully:\n${JSON.stringify(newPermit, null, 2)}`);
    } catch (error) {
      setResult(`Error requesting permit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDecrypt = async () => {
    if (!permit) {
      setResult('Error: Please request a permit first');
      return;
    }

    try {
      const handleBigInt = BigInt(handleValue);
      const decrypted = await decrypt(handleBigInt, permit);
      setResult(`Decrypted value: ${decrypted.toString()}`);
    } catch (error) {
      setResult(`Error decrypting: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            <h1 className="text-xl font-bold">Decryption Examples</h1>
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

        {/* Decryption Flow */}
        <div className="space-y-6">
          {/* Step 1: Request Permit */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Request Decryption Permit
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Before you can decrypt data, you need to request a permit from the contract.
                This requires a signature from your wallet.
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

              <button
                onClick={handleRequestPermit}
                disabled={!isReady || !address || isRequestingPermit}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRequestingPermit && <Loader2 className="w-4 h-4 animate-spin" />}
                {!address ? 'Connect Wallet First' : 'Request Permit'}
              </button>

              {permit && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Permit Acquired</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Decrypt Value */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Decrypt Value
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter the encrypted handle (a unique identifier for the encrypted value) to decrypt.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Encrypted Handle (BigInt)</label>
                <input
                  type="text"
                  value={handleValue}
                  onChange={(e) => setHandleValue(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  placeholder="123456789..."
                />
              </div>

              <button
                onClick={handleDecrypt}
                disabled={!isReady || !permit || isDecrypting}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDecrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                {!permit ? 'Request Permit First' : 'Decrypt Value'}
              </button>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3">How Decryption Works</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">1.</span>
                <span>Request a decryption permit by signing a message with your wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">2.</span>
                <span>The permit proves you have permission to decrypt values from the contract</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">3.</span>
                <span>Use the permit with the encrypted handle to decrypt the value</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">4.</span>
                <span>The decrypted value is returned as a BigInt</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-8 bg-gray-900 text-gray-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Result</h3>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
