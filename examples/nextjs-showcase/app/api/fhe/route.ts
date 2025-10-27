import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Operations API Route
 * Main endpoint for FHE operations
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'FHE Operations API',
    endpoints: {
      encrypt: '/api/fhe/encrypt',
      decrypt: '/api/fhe/decrypt',
      compute: '/api/fhe/compute',
    },
    version: '1.0.0',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, data } = body;

    switch (operation) {
      case 'status':
        return NextResponse.json({
          status: 'operational',
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
