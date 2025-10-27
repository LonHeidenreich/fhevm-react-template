'use client';

import { FHEProvider } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ArrowLeft, Shield, Code, Heart, DollarSign } from 'lucide-react';

export default function DemoPage() {
  return (
    <FHEProvider>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">FHE Comprehensive Demo</h1>
                <p className="text-sm text-gray-600">Complete showcase of FHE capabilities</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Fully Homomorphic Encryption</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Interactive FHE Demonstrations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the full capabilities of Fully Homomorphic Encryption through
              interactive examples and real-world use cases
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <a href="#encryption" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium whitespace-nowrap hover:bg-blue-100 transition-colors">
                <Code className="w-4 h-4 inline mr-2" />
                Encryption
              </a>
              <a href="#computation" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium whitespace-nowrap hover:bg-purple-100 transition-colors">
                Computation
              </a>
              <a href="#keys" className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium whitespace-nowrap hover:bg-green-100 transition-colors">
                Keys
              </a>
              <a href="#banking" className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium whitespace-nowrap hover:bg-teal-100 transition-colors">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Banking
              </a>
              <a href="#medical" className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg font-medium whitespace-nowrap hover:bg-rose-100 transition-colors">
                <Heart className="w-4 h-4 inline mr-2" />
                Medical
              </a>
            </div>
          </div>

          {/* Core Features Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Core FHE Operations</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Encryption Demo */}
              <div id="encryption">
                <EncryptionDemo />
              </div>

              {/* Computation Demo */}
              <div id="computation">
                <ComputationDemo />
              </div>

              {/* Key Manager */}
              <div id="keys" className="lg:col-span-2">
                <KeyManager />
              </div>
            </div>
          </div>

          {/* Real-World Examples Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Real-World Use Cases</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Banking Example */}
              <div id="banking">
                <BankingExample />
              </div>

              {/* Medical Example */}
              <div id="medical">
                <MedicalExample />
              </div>
            </div>
          </div>

          {/* Information Panels */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* How FHE Works */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h4 className="text-lg font-bold text-blue-900 mb-4">How FHE Works</h4>
              <ol className="space-y-3 text-blue-800">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <div className="font-semibold">Client-Side Encryption</div>
                    <div className="text-sm">Data is encrypted locally using FHE before transmission</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <div className="font-semibold">Homomorphic Operations</div>
                    <div className="text-sm">Computations are performed directly on encrypted data</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <div className="font-semibold">Secure Decryption</div>
                    <div className="text-sm">Results are decrypted only with proper authorization</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <div className="font-semibold">Privacy Preserved</div>
                    <div className="text-sm">Data never exposed in plaintext during processing</div>
                  </div>
                </li>
              </ol>
            </div>

            {/* Benefits */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
              <h4 className="text-lg font-bold text-purple-900 mb-4">Key Benefits</h4>
              <ul className="space-y-3 text-purple-800">
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Complete Privacy</div>
                    <div className="text-sm">Data remains encrypted throughout processing</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Regulatory Compliance</div>
                    <div className="text-sm">Meets GDPR, HIPAA, and other privacy regulations</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Zero Trust Architecture</div>
                    <div className="text-sm">No need to trust data processors</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Flexible Deployment</div>
                    <div className="text-sm">Works in cloud, on-premise, or hybrid environments</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Use Case Scenarios */}
          <div className="p-6 bg-white border rounded-xl shadow-sm mb-12">
            <h4 className="text-xl font-bold mb-6">Industry Applications</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h5 className="font-semibold mb-2">Financial Services</h5>
                <p className="text-sm text-gray-600">
                  Confidential transactions, secure analytics, and compliant data processing
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <h5 className="font-semibold mb-2">Healthcare</h5>
                <p className="text-sm text-gray-600">
                  HIPAA-compliant medical records, secure patient data analysis
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h5 className="font-semibold mb-2">Government</h5>
                <p className="text-sm text-gray-600">
                  Secure voting systems, confidential census data, privacy-preserving analytics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t bg-gray-50 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 mb-2">
              Powered by Universal FHEVM SDK
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span>•</span>
              <Link href="/examples/encryption" className="hover:text-gray-700">Examples</Link>
              <span>•</span>
              <a href="https://docs.zama.ai/fhevm" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                Documentation
              </a>
            </div>
          </div>
        </footer>
      </main>
    </FHEProvider>
  );
}
