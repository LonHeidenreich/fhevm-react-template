'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useFhevm } from '@zama/fhevm-sdk/react';
import { Check, Lock, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  const { isReady, isInitializing, error } = useFhevm();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">FHEVM SDK Showcase</h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Universal FHEVM SDK
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Build confidential, privacy-preserving applications with Fully Homomorphic Encryption
          </p>

          {/* SDK Status */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border shadow-sm mb-12">
            {isInitializing && (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Initializing SDK...</span>
              </>
            )}
            {isReady && (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">SDK Ready</span>
              </>
            )}
            {error && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-red-600">SDK Error</span>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <Lock className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Input Encryption</h3>
              <p className="text-sm text-gray-600">
                Encrypt numbers, booleans, and addresses with type-safe functions
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <Shield className="w-10 h-10 text-purple-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Secure Decryption</h3>
              <p className="text-sm text-gray-600">
                Request permits and decrypt confidential data safely
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-10 h-10 text-yellow-600 mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">React Hooks</h3>
              <p className="text-sm text-gray-600">
                Use powerful hooks for seamless integration
              </p>
            </div>
          </div>

          {/* Featured Demo */}
          <Link
            href="/demo"
            className="block mb-8 p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border border-indigo-300 hover:shadow-2xl transition-all text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Complete FHE Demo</h3>
                <p className="text-indigo-100 mb-4">
                  Interactive showcase with encryption, computation, and real-world examples
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg">
                  <span className="text-sm font-medium">View All Features →</span>
                </div>
              </div>
              <Shield className="w-24 h-24 opacity-20" />
            </div>
          </Link>

          {/* Examples Navigation */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/examples/encryption"
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-blue-900 mb-2">Encryption Examples</h3>
              <p className="text-sm text-blue-700">
                Learn how to encrypt different data types
              </p>
            </Link>

            <Link
              href="/examples/decryption"
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-purple-900 mb-2">Decryption Examples</h3>
              <p className="text-sm text-purple-700">
                Request permits and decrypt values
              </p>
            </Link>

            <Link
              href="/examples/contracts"
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-green-900 mb-2">Contract Interaction</h3>
              <p className="text-sm text-green-700">
                Send encrypted data to smart contracts
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-bold mb-8 text-center">Quick Start</h3>
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <code>{`import { useFhevm, useEncrypt } from '@zama/fhevm-sdk/react';

function MyComponent() {
  const { client, isReady } = useFhevm();
  const { encrypt } = useEncrypt(client);

  const handleEncrypt = async () => {
    const encrypted = await encrypt(42);
    await contract.submit(encrypted);
  };

  return <button onClick={handleEncrypt}>Encrypt</button>;
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Built with Universal FHEVM SDK | Powered by Zama</p>
        </div>
      </footer>
    </main>
  );
}
