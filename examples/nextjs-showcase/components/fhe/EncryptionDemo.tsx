'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock, Copy, Check } from 'lucide-react';

export function EncryptionDemo() {
  const [value, setValue] = useState('');
  const [type, setType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'>('uint32');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = async () => {
    if (!value) return;

    setLoading(true);
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });

      if (!response.ok) {
        throw new Error('Encryption failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Encryption error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.encrypted?.data) {
      navigator.clipboard.writeText(result.encrypted.data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card title="Data Encryption" description="Encrypt sensitive data using FHE">
      <div className="space-y-4">
        <Input
          label="Value to Encrypt"
          type="text"
          placeholder="Enter value..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="uint8">Uint8 (0-255)</option>
            <option value="uint16">Uint16 (0-65535)</option>
            <option value="uint32">Uint32 (0-4294967295)</option>
            <option value="uint64">Uint64</option>
            <option value="bool">Boolean</option>
            <option value="address">Address</option>
          </select>
        </div>

        <Button
          onClick={handleEncrypt}
          loading={loading}
          disabled={!value}
          className="w-full"
        >
          <Lock className="w-4 h-4" />
          Encrypt Data
        </Button>

        {result && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Result</h4>
            {result.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                Error: {result.error}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Encrypted Data</span>
                    <button
                      onClick={handleCopy}
                      className="text-green-600 hover:text-green-700"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <code className="text-xs text-green-900 break-all">
                    {result.encrypted?.data}
                  </code>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div>Type: <span className="font-mono">{result.encrypted?.type}</span></div>
                    <div>Timestamp: <span className="font-mono text-xs">{result.encrypted?.timestamp}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
