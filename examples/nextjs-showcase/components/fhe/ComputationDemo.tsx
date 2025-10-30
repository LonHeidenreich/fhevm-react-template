'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Calculator, Plus, Minus, X } from 'lucide-react';

export function ComputationDemo() {
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply'>('add');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompute = async () => {
    if (!operand1 || !operand2) return;

    setLoading(true);
    try {
      // First, encrypt both operands
      const encryptedOps = await Promise.all([
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: operand1, type: 'uint32' }),
        }).then(r => r.json()),
        fetch('/api/fhe/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: operand2, type: 'uint32' }),
        }).then(r => r.json()),
      ]);

      // Then perform computation
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          operands: [
            encryptedOps[0].encrypted.data,
            encryptedOps[1].encrypted.data,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Computation failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Computation error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const operationIcons = {
    add: <Plus className="w-4 h-4" />,
    subtract: <Minus className="w-4 h-4" />,
    multiply: <X className="w-4 h-4" />,
  };

  return (
    <Card
      title="Homomorphic Computation"
      description="Perform computations on encrypted data"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Operand"
            type="number"
            placeholder="Enter first value..."
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
          />
          <Input
            label="Second Operand"
            type="number"
            placeholder="Enter second value..."
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setOperation('add')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                operation === 'add'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add
              </div>
            </button>
            <button
              onClick={() => setOperation('subtract')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                operation === 'subtract'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Minus className="w-4 h-4" />
                Subtract
              </div>
            </button>
            <button
              onClick={() => setOperation('multiply')}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                operation === 'multiply'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Multiply
              </div>
            </button>
          </div>
        </div>

        <Button
          onClick={handleCompute}
          loading={loading}
          disabled={!operand1 || !operand2}
          className="w-full"
        >
          <Calculator className="w-4 h-4" />
          Compute on Encrypted Data
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
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 mb-2">
                    Encrypted Result
                  </div>
                  <code className="text-xs text-blue-900 break-all">
                    {result.computation?.encryptedResult}
                  </code>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Operation: <span className="font-mono font-semibold">{result.metadata?.operation}</span></div>
                    <div>Operands: <span className="font-mono">{result.metadata?.operands}</span></div>
                    <div className="text-xs text-gray-500 mt-2">
                      The computation was performed on encrypted data without decryption
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <h5 className="font-semibold text-purple-900 mb-2">How it Works</h5>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>1. Both operands are encrypted using FHE</li>
            <li>2. Computation is performed on the encrypted values</li>
            <li>3. Result remains encrypted throughout the process</li>
            <li>4. No decryption occurs during computation</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
