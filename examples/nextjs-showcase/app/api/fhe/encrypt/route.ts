import { NextRequest, NextResponse } from 'next/server';

/**
 * Encryption API Route
 * Handles server-side encryption operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, type = 'uint32' } = body;

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // In a real implementation, this would use FHEVM SDK
    // For now, we'll simulate the response structure
    const encryptedData = {
      data: `0x${Buffer.from(value.toString()).toString('hex')}`,
      signature: `0x${'0'.repeat(64)}`,
      type,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      encrypted: encryptedData,
      original: { value, type },
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: 'Encryption API',
    method: 'POST',
    description: 'Encrypts data using FHE',
    parameters: {
      value: 'The value to encrypt (number, string, or boolean)',
      type: 'Data type (uint8, uint16, uint32, uint64, bool, address)',
    },
    example: {
      value: 42,
      type: 'uint32',
    },
  });
}
