import { NextResponse } from 'next/server';

// Mark this route as dynamic for serverless
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    message: 'Fractal Generator API is running!',
    status: 'healthy'
  }, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
}
