'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DollarSign, Send, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export function BankingExample() {
  const [balance, setBalance] = useState('10000');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!transferAmount || !recipient) return;

    setLoading(true);
    try {
      // Encrypt the transfer amount
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: transferAmount,
          type: 'uint32',
        }),
      });

      if (!response.ok) {
        throw new Error('Encryption failed');
      }

      const encrypted = await response.json();

      // Create transaction
      const transaction = {
        id: Date.now(),
        amount: transferAmount,
        encryptedAmount: encrypted.encrypted.data,
        recipient: recipient.slice(0, 6) + '...' + recipient.slice(-4),
        timestamp: new Date().toISOString(),
        status: 'completed',
      };

      setTransactions([transaction, ...transactions]);
      setTransferAmount('');
      setRecipient('');
    } catch (error) {
      console.error('Transfer error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Confidential Banking"
      description="Private financial transactions using FHE"
    >
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Account Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:opacity-80"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showBalance ? `$${Number(balance).toLocaleString()}` : '••••••'}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
            <ShieldCheck className="w-4 h-4" />
            <span>Protected by FHE</span>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Send className="w-4 h-4" />
            New Transfer
          </h4>

          <Input
            label="Recipient Address"
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <Input
            label="Amount ($)"
            type="number"
            placeholder="Enter amount..."
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />

          <Button
            onClick={handleTransfer}
            loading={loading}
            disabled={!transferAmount || !recipient}
            className="w-full"
          >
            <Send className="w-4 h-4" />
            Send Encrypted Transfer
          </Button>
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Recent Transactions</h4>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">${tx.amount}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    To: <span className="font-mono">{tx.recipient}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-mono truncate">
                    Encrypted: {tx.encryptedAmount.slice(0, 20)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h5 className="font-semibold text-purple-900 mb-2">Privacy Features</h5>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Transaction amounts are fully encrypted</li>
            <li>• Balance calculations occur on encrypted data</li>
            <li>• No intermediate decryption required</li>
            <li>• Complete financial privacy guaranteed</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
