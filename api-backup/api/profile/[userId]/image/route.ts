import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import sharp from 'sharp';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth();
    const { userId: paramUserId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== paramUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const cropDataStr = formData.get('cropData') as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Parse crop data if provided
    let cropData = null;
    if (cropDataStr) {
      try {
        cropData = JSON.parse(cropDataStr);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid crop data' },
          { status: 400 }
        );
      }
    }

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get image metadata first
    const imageMetadata = await sharp(buffer).metadata();
    
    // Process image with Sharp
    let processedImage = sharp(buffer);

    // Apply crop if provided and valid
    if (cropData && cropData.x !== undefined && cropData.y !== undefined && 
        cropData.width !== undefined && cropData.height !== undefined) {
      
      // Validate crop dimensions
      const cropX = Math.max(0, Math.round(cropData.x));
      const cropY = Math.max(0, Math.round(cropData.y));
      const cropWidth = Math.min(Math.round(cropData.width), imageMetadata.width || 0);
      const cropHeight = Math.min(Math.round(cropData.height), imageMetadata.height || 0);
      
      // Only apply crop if dimensions are valid
      if (cropWidth > 0 && cropHeight > 0 && 
          cropX + cropWidth <= (imageMetadata.width || 0) && 
          cropY + cropHeight <= (imageMetadata.height || 0)) {
        processedImage = processedImage.extract({
          left: cropX,
          top: cropY,
          width: cropWidth,
          height: cropHeight,
        });
      }
    }

    // Resize to standard profile image size (300x300)
    processedImage = processedImage.resize(300, 300, {
      fit: 'cover',
      position: 'center',
    });

    // Convert to JPEG with quality optimization
    const processedBuffer = await processedImage
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `profile-${userId}-${timestamp}.jpg`;
    
    // In a real app, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.
    // For now, we'll simulate the upload and return a mock URL
    const imageUrl = `/api/images/${filename}`;

    // Save the processed image (in a real app, this would be saved to cloud storage)
    await saveImageToStorage(filename, processedBuffer);

    return NextResponse.json({
      imageUrl,
      filename,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await auth();
    const { userId: paramUserId } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== paramUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // In a real app, this would delete the image from cloud storage
    await deleteImageFromStorage(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// Mock storage functions (replace with real cloud storage operations)
async function saveImageToStorage(filename: string, buffer: Buffer): Promise<void> {
  // In a real app, this would upload to AWS S3, Cloudinary, etc.
  console.log(`Saving image: ${filename}, size: ${buffer.length} bytes`);
  
  // For development, you might save to a local directory
  // const fs = require('fs');
  // const path = require('path');
  // const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
  // if (!fs.existsSync(uploadDir)) {
  //   fs.mkdirSync(uploadDir, { recursive: true });
  // }
  // fs.writeFileSync(path.join(uploadDir, filename), buffer);
}

async function deleteImageFromStorage(userId: string): Promise<void> {
  // In a real app, this would delete from cloud storage
  console.log(`Deleting profile image for user: ${userId}`);
}
