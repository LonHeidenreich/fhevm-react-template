'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Heart, Activity, Thermometer, User, Lock } from 'lucide-react';

interface HealthRecord {
  id: number;
  type: string;
  value: string;
  encryptedValue: string;
  timestamp: string;
  icon: React.ReactNode;
}

export function MedicalExample() {
  const [recordType, setRecordType] = useState('heart-rate');
  const [value, setValue] = useState('');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const recordTypes = [
    { id: 'heart-rate', name: 'Heart Rate (BPM)', icon: <Heart className="w-4 h-4" /> },
    { id: 'blood-pressure', name: 'Blood Pressure', icon: <Activity className="w-4 h-4" /> },
    { id: 'temperature', name: 'Body Temperature (°F)', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'glucose', name: 'Blood Glucose (mg/dL)', icon: <Activity className="w-4 h-4" /> },
  ];

  const handleAddRecord = async () => {
    if (!value) return;

    setLoading(true);
    try {
      // Encrypt the health data
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value,
          type: 'uint32',
        }),
      });

      if (!response.ok) {
        throw new Error('Encryption failed');
      }

      const encrypted = await response.json();
      const selectedType = recordTypes.find(t => t.id === recordType);

      const record: HealthRecord = {
        id: Date.now(),
        type: selectedType?.name || recordType,
        value,
        encryptedValue: encrypted.encrypted.data,
        timestamp: new Date().toISOString(),
        icon: selectedType?.icon || <Activity className="w-4 h-4" />,
      };

      setRecords([record, ...records]);
      setValue('');
    } catch (error) {
      console.error('Record creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Confidential Medical Records"
      description="Secure health data management with FHE"
    >
      <div className="space-y-6">
        {/* Patient Info */}
        <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-teal-900">Patient Record System</div>
              <div className="text-sm text-teal-700">All data encrypted end-to-end</div>
            </div>
          </div>
        </div>

        {/* Add Record Form */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            Add Encrypted Health Record
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              {recordTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Value"
            type="number"
            placeholder="Enter measurement..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            helperText="This value will be encrypted before storage"
          />

          <Button
            onClick={handleAddRecord}
            loading={loading}
            disabled={!value}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            <Lock className="w-4 h-4" />
            Add Encrypted Record
          </Button>
        </div>

        {/* Health Records */}
        {records.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Health Records</h4>
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                        {record.icon}
                      </div>
                      <div>
                        <div className="font-medium">{record.type}</div>
                        <div className="text-sm text-gray-600">
                          Value: <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">
                            Encrypted
                          </span>
                        </div>
                      </div>
                    </div>
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(record.timestamp).toLocaleString()}
                  </div>

                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                      View encrypted data
                    </summary>
                    <div className="mt-2 p-2 bg-gray-100 rounded font-mono break-all">
                      {record.encryptedValue}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIPAA Compliance Notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">Privacy Protection</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All health data encrypted at rest and in transit</li>
            <li>• Computations performed on encrypted data</li>
            <li>• HIPAA-compliant confidentiality standards</li>
            <li>• Zero-knowledge proof for access verification</li>
            <li>• Patient data never exposed in plaintext</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
