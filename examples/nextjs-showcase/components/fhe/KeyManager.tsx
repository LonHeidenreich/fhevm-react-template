'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Key, RefreshCw, Check, Copy } from 'lucide-react';
import { useFHEContext } from './FHEProvider';

export function KeyManager() {
  const { publicKey, initialize, isLoading } = useFHEContext();
  const [copied, setCopied] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleValidate = async () => {
    if (!publicKey) return;

    setValidating(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'validate',
          publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const data = await response.json();
      setValidationResult(data);
    } catch (error) {
      setValidationResult({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setValidating(false);
    }
  };

  return (
    <Card
      title="Key Management"
      description="Manage FHE cryptographic keys"
    >
      <div className="space-y-4">
        {publicKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Public Key</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="text-green-600 hover:text-green-700"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <code className="text-xs text-green-900 break-all">
                {publicKey}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={initialize}
                loading={isLoading}
                variant="secondary"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>

              <Button
                onClick={handleValidate}
                loading={validating}
                variant="outline"
                className="w-full"
              >
                Validate Key
              </Button>
            </div>

            {validationResult && (
              <div className="mt-4">
                {validationResult.error ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    Validation Error: {validationResult.error}
                  </div>
                ) : validationResult.valid ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Key is valid</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                    Key validation inconclusive
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No key generated yet</p>
            <Button onClick={initialize} loading={isLoading}>
              Generate Key Pair
            </Button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">Key Security</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Public keys are used for encryption</li>
            <li>• Private keys never leave the secure environment</li>
            <li>• Keys are specific to each FHE session</li>
            <li>• Regenerate keys periodically for security</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
