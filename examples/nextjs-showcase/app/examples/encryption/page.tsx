'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowLeft, Lock, Loader2, CheckCircle } from 'lucide-react';

export default function EncryptionPage() {
  const { client, isReady } = useFhevm();
  const { encrypt, encryptUint8, encryptUint16, encryptUint32, encryptBool, encryptAddress, isEncrypting } = useEncrypt(client);

  const [uint8Value, setUint8Value] = useState('42');
  const [uint16Value, setUint16Value] = useState('1000');
  const [uint32Value, setUint32Value] = useState('100000');
  const [boolValue, setBoolValue] = useState(true);
  const [addressValue, setAddressValue] = useState('0x0000000000000000000000000000000000000000');
  const [result, setResult] = useState<string>('');

  const handleEncryptUint8 = async () => {
    try {
      const encrypted = await encryptUint8(parseInt(uint8Value));
      setResult(`Encrypted uint8: ${JSON.stringify(encrypted, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEncryptUint16 = async () => {
    try {
      const encrypted = await encryptUint16(parseInt(uint16Value));
      setResult(`Encrypted uint16: ${JSON.stringify(encrypted, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEncryptUint32 = async () => {
    try {
      const encrypted = await encryptUint32(parseInt(uint32Value));
      setResult(`Encrypted uint32: ${JSON.stringify(encrypted, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEncryptBool = async () => {
    try {
      const encrypted = await encryptBool(boolValue);
      setResult(`Encrypted bool: ${JSON.stringify(encrypted, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEncryptAddress = async () => {
    try {
      const encrypted = await encryptAddress(addressValue);
      setResult(`Encrypted address: ${JSON.stringify(encrypted, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAutoEncrypt = async () => {
    try {
      const encrypted = await encrypt(parseInt(uint8Value));
      setResult(`Auto-encrypted value: ${JSON.stringify(encrypted, null, 2)}`);
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
            <h1 className="text-xl font-bold">Encryption Examples</h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status */}
        <div className="mb-8 p-4 bg-white rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
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
        </div>

        {/* Encryption Examples */}
        <div className="space-y-6">
          {/* Uint8 Encryption */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Encrypt Uint8
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Value (0-255)</label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={uint8Value}
                  onChange={(e) => setUint8Value(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleEncryptUint8}
                disabled={!isReady || isEncrypting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEncrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                Encrypt Uint8
              </button>
            </div>
          </div>

          {/* Uint16 Encryption */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Encrypt Uint16
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Value (0-65535)</label>
                <input
                  type="number"
                  min="0"
                  max="65535"
                  value={uint16Value}
                  onChange={(e) => setUint16Value(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleEncryptUint16}
                disabled={!isReady || isEncrypting}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEncrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                Encrypt Uint16
              </button>
            </div>
          </div>

          {/* Uint32 Encryption */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Encrypt Uint32
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Value (0-4294967295)</label>
                <input
                  type="number"
                  min="0"
                  max="4294967295"
                  value={uint32Value}
                  onChange={(e) => setUint32Value(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={handleEncryptUint32}
                disabled={!isReady || isEncrypting}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEncrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                Encrypt Uint32
              </button>
            </div>
          </div>

          {/* Bool Encryption */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-yellow-600" />
              Encrypt Boolean
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Value</label>
                <select
                  value={boolValue.toString()}
                  onChange={(e) => setBoolValue(e.target.value === 'true')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <button
                onClick={handleEncryptBool}
                disabled={!isReady || isEncrypting}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEncrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                Encrypt Bool
              </button>
            </div>
          </div>

          {/* Address Encryption */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Encrypt Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ethereum Address</label>
                <input
                  type="text"
                  value={addressValue}
                  onChange={(e) => setAddressValue(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="0x..."
                />
              </div>
              <button
                onClick={handleEncryptAddress}
                disabled={!isReady || isEncrypting}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEncrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                Encrypt Address
              </button>
            </div>
          </div>

          {/* Auto-detect Encryption */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Auto-Detect Type
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                The SDK can automatically detect the type and encrypt accordingly.
              </p>
              <button
                onClick={handleAutoEncrypt}
                disabled={!isReady || isEncrypting}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEncrypting && <Loader2 className="w-4 h-4 animate-spin" />}
                Auto Encrypt
              </button>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-8 bg-gray-900 text-gray-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Result</h3>
            <pre className="text-sm overflow-x-auto">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
