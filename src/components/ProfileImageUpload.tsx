'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Slider,
  Stack,
  Paper,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Crop as CropIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string) => void;
  onImageDelete: () => void;
  userId: string;
  disabled?: boolean;
}

export default function ProfileImageUpload({
  currentImageUrl,
  onImageUpdate,
  onImageDelete,
  userId,
  disabled = false,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const validateImageFile = (file: File) => {
    const errors: string[] = [];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image');
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowCropDialog(true);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Create cropped image
      const croppedImageBlob = await createCroppedImage();
      if (!croppedImageBlob) {
        throw new Error('Failed to create cropped image');
      }

      // Create file from blob
      const croppedFile = new File([croppedImageBlob], selectedFile.name, {
        type: selectedFile.type,
      });

      // For now, create a mock URL - in production this would upload to server
      const mockImageUrl = URL.createObjectURL(croppedImageBlob);
      
      onImageUpdate(mockImageUrl);
      setShowCropDialog(false);
      setSelectedFile(null);
      setPreviewUrl('');
      
      // Clean up
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, cropData, onImageUpdate, previewUrl]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onImageDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  }, [onImageDelete]);

  const createCroppedImage = useCallback(async (): Promise<Blob | null> => {
    if (!imageRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const image = imageRef.current;
    const { x, y, width, height } = cropData;

    // Ensure crop dimensions don't exceed image bounds
    const maxX = Math.max(0, image.naturalWidth - width);
    const maxY = Math.max(0, image.naturalHeight - height);
    const clampedX = Math.min(Math.max(0, x), maxX);
    const clampedY = Math.min(Math.max(0, y), maxY);

    // Set canvas size to final output size (200x200 for profile)
    const outputSize = 200;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Clear canvas
    ctx.clearRect(0, 0, outputSize, outputSize);

    // Draw the cropped portion of the image, scaled to output size
    ctx.drawImage(
      image,
      clampedX, clampedY, width, height,  // Source rectangle
      0, 0, outputSize, outputSize  // Destination rectangle
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  }, [cropData]);

  const handleCancel = useCallback(() => {
    setShowCropDialog(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  }, [previewUrl]);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const minDimension = Math.min(naturalWidth, naturalHeight);
      const cropSize = Math.min(minDimension, 300); // Reasonable crop size
      const x = (naturalWidth - cropSize) / 2;
      const y = (naturalHeight - cropSize) / 2;
      
      setCropData({
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: cropSize,
        height: cropSize,
      });
      
      // Reset rotation and zoom when new image loads
      setRotation(0);
      setZoom(1);
    }
  }, []);

  return (
    <Box>
      {/* Current Image Display */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            mx: 'auto',
            mb: 2,
            position: 'relative',
            border: '3px solid',
            borderColor: 'primary.main',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentImageUrl && currentImageUrl.trim() !== '' ? (
            <img
              src={currentImageUrl}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <PhotoCameraIcon sx={{ fontSize: 40, color: 'grey.400' }} />
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            size="small"
          >
            {currentImageUrl ? 'Change' : 'Upload'}
          </Button>
          
          {currentImageUrl && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={disabled || isDeleting}
              size="small"
            >
              {isDeleting ? <CircularProgress size={16} /> : 'Delete'}
            </Button>
          )}
        </Stack>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Crop Dialog */}
      <Dialog
        open={showCropDialog}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CropIcon />
            <Typography variant="h6">Crop Profile Image</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Paper
              sx={{
                position: 'relative',
                display: 'inline-block',
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              {previewUrl && previewUrl.trim() !== '' ? (
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Preview"
                  onLoad={handleImageLoad}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    display: 'block',
                  }}
                />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: 'grey.400'
                }}>
                  <Typography>No preview available</Typography>
                </Box>
              )}
              
              {/* Crop overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  left: cropData.x,
                  top: cropData.y,
                  width: cropData.width,
                  height: cropData.height,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  cursor: 'move',
                  pointerEvents: 'none',
                }}
              />
            </Paper>

            {/* Controls */}
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography gutterBottom>Zoom: {Math.round(zoom * 100)}%</Typography>
                <Slider
                  value={zoom}
                  onChange={(_, value) => setZoom(value as number)}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Rotation: {rotation}°</Typography>
                <Slider
                  value={rotation}
                  onChange={(_, value) => setRotation(value as number)}
                  min={-180}
                  max={180}
                  step={15}
                />
              </Box>

              <Stack direction="row" spacing={1} justifyContent="center">
                <IconButton onClick={() => setRotation(prev => prev - 15)}>
                  <RotateLeftIcon />
                </IconButton>
                <IconButton onClick={() => setRotation(prev => prev + 15)}>
                  <RotateRightIcon />
                </IconButton>
                <IconButton onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}>
                  <ZoomOutIcon />
                </IconButton>
                <IconButton onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}>
                  <ZoomInIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            startIcon={isUploading ? <CircularProgress size={16} /> : <CheckIcon />}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden canvas for image processing */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </Box>
  );
}