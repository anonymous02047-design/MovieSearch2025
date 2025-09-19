import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = searchParams.get('w');
    const height = searchParams.get('h');
    const quality = searchParams.get('q');
    const format = searchParams.get('f');
    const progressive = searchParams.get('p') === '1';
    const compression = searchParams.get('c');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 404 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Process the image with Sharp
    let processedImage = sharp(buffer);

    // Resize if dimensions are provided
    if (width || height) {
      processedImage = processedImage.resize(
        width ? parseInt(width) : undefined,
        height ? parseInt(height) : undefined,
        {
          fit: 'inside',
          withoutEnlargement: true,
        }
      );
    }

    // Apply format conversion
    const targetFormat = format || 'webp';
    switch (targetFormat) {
      case 'webp':
        processedImage = processedImage.webp({
          quality: quality ? parseInt(quality) : 85,
          progressive: progressive,
        });
        break;
      case 'jpeg':
        processedImage = processedImage.jpeg({
          quality: quality ? parseInt(quality) : 85,
          progressive: progressive,
        });
        break;
      case 'png':
        processedImage = processedImage.png({
          compressionLevel: compression ? parseInt(compression) : 6,
          progressive: progressive,
        });
        break;
      case 'avif':
        processedImage = processedImage.avif({
          quality: quality ? parseInt(quality) : 85,
        });
        break;
    }

    // Generate the processed image
    const processedBuffer = await processedImage.toBuffer();

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', `image/${targetFormat}`);
    headers.set('Content-Length', processedBuffer.length.toString());
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('ETag', `"${Buffer.from(imageUrl).toString('base64')}"`);

    return new NextResponse(processedBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Image processing failed' },
      { status: 500 }
    );
  }
}
