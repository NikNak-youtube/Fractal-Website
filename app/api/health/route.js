import { NextResponse } from 'next/server';

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
