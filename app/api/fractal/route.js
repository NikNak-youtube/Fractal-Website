import { NextResponse } from 'next/server';
import { generateFractal, parseParams } from '@/lib/fractal-utils';

// Mark this route as dynamic for serverless
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const PImage = require('pureimage');
    
    console.log('PImage loaded:', typeof PImage, 'has encodePNGToStream:', typeof PImage.encodePNGToStream);
    
    const { searchParams } = request.nextUrl;
    const query = Object.fromEntries(searchParams.entries());
    
    console.log('Generating fractal with query:', query);
    
    const params = parseParams(query);
    const img = generateFractal(params);
    
    console.log('Fractal generated, image type:', typeof img, 'has getContext:', typeof img?.getContext);
    console.log('Encoding PNG...');
    
    // Create a promise-based PNG encoder
    const encodePNG = (image) => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        
        try {
          const stream = PImage.encodePNGToStream(image);
          
          if (!stream || typeof stream.on !== 'function') {
            reject(new Error('Invalid stream from encodePNGToStream'));
            return;
          }
          
          stream.on('data', (chunk) => {
            chunks.push(chunk);
          });
          
          stream.on('end', () => {
            resolve(Buffer.concat(chunks));
          });
          
          stream.on('error', (error) => {
            reject(error);
          });
        } catch (err) {
          reject(err);
        }
      });
    };
    
    const buffer = await encodePNG(img);
    
    console.log('PNG encoded, size:', buffer.length);
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
        'Content-Length': buffer.length.toString()
      }
    });
    
  } catch (error) {
    console.error('Error generating fractal:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to generate fractal',
      message: error.message 
    }, { status: 500 });
  }
}
