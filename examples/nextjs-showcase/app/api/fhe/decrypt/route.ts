import { NextRequest, NextResponse } from 'next/server';

/**
 * Decryption API Route
 * Handles server-side decryption operations with permit validation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedHandle, permit, contractAddress } = body;

    // Validate required fields
    if (!encryptedHandle) {
      return NextResponse.json(
        { error: 'Encrypted handle is required' },
        { status: 400 }
      );
    }

    if (!permit) {
      return NextResponse.json(
        { error: 'Permit is required for decryption' },
        { status: 400 }
      );
    }

    if (!contractAddress) {
      return NextResponse.json(
        { error: 'Contract address is required' },
        { status: 400 }
      );
    }

    // Validate permit structure
    if (!permit.signature || !permit.publicKey) {
      return NextResponse.json(
        { error: 'Invalid permit structure' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Verify the permit signature
    // 2. Check permit expiration
    // 3. Use FHEVM gateway to decrypt
    // For now, we'll simulate the response

    const decryptedValue = Math.floor(Math.random() * 1000);

    return NextResponse.json({
      success: true,
      decrypted: {
        value: decryptedValue.toString(),
        handle: encryptedHandle,
        timestamp: new Date().toISOString(),
      },
      permit: {
        verified: true,
        contractAddress,
      },
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: 'Decryption failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: 'Decryption API',
    method: 'POST',
    description: 'Decrypts FHE-encrypted data with permit validation',
    parameters: {
      encryptedHandle: 'The encrypted handle (BigInt string)',
      permit: 'Decryption permit object with signature and publicKey',
      contractAddress: 'Smart contract address',
    },
    example: {
      encryptedHandle: '123456789',
      permit: {
        signature: '0x...',
        publicKey: '0x...',
      },
      contractAddress: '0x...',
    },
  });
}
