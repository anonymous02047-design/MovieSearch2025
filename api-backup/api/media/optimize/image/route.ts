import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { errorHandler } from '@/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, options } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Get original metadata
    const metadata = await sharp(buffer).metadata();

    // Optimize the image
    let optimizedImage = sharp(buffer);

    // Resize if dimensions are provided
    if (options.width || options.height) {
      optimizedImage = optimizedImage.resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Apply format conversion
    switch (options.format) {
      case 'webp':
        optimizedImage = optimizedImage.webp({
          quality: options.quality || 85,
          progressive: options.progressive || true,
        });
        break;
      case 'jpeg':
        optimizedImage = optimizedImage.jpeg({
          quality: options.quality || 85,
          progressive: options.progressive || true,
        });
        break;
      case 'png':
        optimizedImage = optimizedImage.png({
          compressionLevel: options.compression || 6,
          progressive: options.progressive || true,
        });
        break;
      case 'avif':
        optimizedImage = optimizedImage.avif({
          quality: options.quality || 85,
        });
        break;
      default:
        optimizedImage = optimizedImage.webp({
          quality: options.quality || 85,
          progressive: options.progressive || true,
        });
    }

    // Generate optimized image
    const optimizedBuffer = await optimizedImage.toBuffer();
    const optimizedMetadata = await sharp(optimizedBuffer).metadata();

    // Create a unique ID for the processed image
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In a real application, you would save this to a storage service
    // For now, we'll return the optimized image as base64
    const base64Image = `data:image/${options.format || 'webp'};base64,${optimizedBuffer.toString('base64')}`;

    const result = {
      id: imageId,
      originalUrl: imageUrl,
      optimizedUrl: base64Image,
      thumbnailUrl: base64Image, // In real app, generate separate thumbnail
      metadata: {
        width: optimizedMetadata.width || 0,
        height: optimizedMetadata.height || 0,
        format: optimizedMetadata.format || options.format || 'webp',
        size: optimizedBuffer.length,
        aspectRatio: (optimizedMetadata.width || 1) / (optimizedMetadata.height || 1),
        hasAlpha: optimizedMetadata.hasAlpha || false,
        colorSpace: optimizedMetadata.space || 'srgb',
      },
      optimizationOptions: options,
      processedAt: new Date().toISOString(),
      fileSize: optimizedBuffer.length,
      compressionRatio: ((metadata.size || 0) - optimizedBuffer.length) / (metadata.size || 1),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json(
      { error: 'Image optimization failed' },
      { status: 500 }
    );
  }
}
