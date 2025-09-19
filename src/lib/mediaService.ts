import { errorHandler } from './errorHandler';

export interface MediaOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  progressive?: boolean;
  compression?: number;
}

export interface MediaMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  duration?: number;
  bitrate?: number;
  fps?: number;
  aspectRatio: number;
  colorSpace?: string;
  hasAlpha?: boolean;
  orientation?: number;
  exif?: Record<string, any>;
}

export interface ProcessedMedia {
  id: string;
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
  metadata: MediaMetadata;
  optimizationOptions: MediaOptimizationOptions;
  processedAt: string;
  fileSize: number;
  compressionRatio: number;
}

class MediaService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MEDIA_API_URL || '/api/media';
    this.apiKey = process.env.NEXT_PUBLIC_MEDIA_API_KEY || '';
  }

  /**
   * Optimize an image for web display
   */
  async optimizeImage(
    imageUrl: string,
    options: MediaOptimizationOptions = {}
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          imageUrl,
          options: {
            width: options.width || 800,
            height: options.height || 600,
            quality: options.quality || 85,
            format: options.format || 'webp',
            progressive: options.progressive || true,
            compression: options.compression || 6,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Image optimization failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'optimizeImage');
    }
  }

  /**
   * Generate multiple image sizes for responsive display
   */
  async generateResponsiveImages(
    imageUrl: string,
    sizes: number[] = [320, 640, 1024, 1920]
  ): Promise<ProcessedMedia[]> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/responsive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          imageUrl,
          sizes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Responsive image generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'generateResponsiveImages');
    }
  }

  /**
   * Create a thumbnail for an image or video
   */
  async createThumbnail(
    mediaUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      timeOffset?: number; // For videos
    } = {}
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          mediaUrl,
          options: {
            width: options.width || 300,
            height: options.height || 200,
            quality: options.quality || 80,
            timeOffset: options.timeOffset || 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Thumbnail creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'createThumbnail');
    }
  }

  /**
   * Optimize a video for web playback
   */
  async optimizeVideo(
    videoUrl: string,
    options: {
      width?: number;
      height?: number;
      bitrate?: number;
      format?: 'mp4' | 'webm';
      quality?: 'low' | 'medium' | 'high' | 'ultra';
    } = {}
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          videoUrl,
          options: {
            width: options.width || 1280,
            height: options.height || 720,
            bitrate: options.bitrate || 2000,
            format: options.format || 'mp4',
            quality: options.quality || 'medium',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Video optimization failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'optimizeVideo');
    }
  }

  /**
   * Extract metadata from media file
   */
  async extractMetadata(mediaUrl: string): Promise<MediaMetadata> {
    try {
      const response = await fetch(`${this.baseUrl}/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ mediaUrl }),
      });

      if (!response.ok) {
        throw new Error(`Metadata extraction failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'extractMetadata');
    }
  }

  /**
   * Convert image format
   */
  async convertImageFormat(
    imageUrl: string,
    targetFormat: 'webp' | 'jpeg' | 'png' | 'avif',
    options: MediaOptimizationOptions = {}
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          imageUrl,
          targetFormat,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Image conversion failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'convertImageFormat');
    }
  }

  /**
   * Apply image filters and effects
   */
  async applyImageFilters(
    imageUrl: string,
    filters: {
      brightness?: number;
      contrast?: number;
      saturation?: number;
      blur?: number;
      sharpen?: number;
      sepia?: number;
      grayscale?: boolean;
      invert?: boolean;
    }
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/filters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          imageUrl,
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`Image filtering failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'applyImageFilters');
    }
  }

  /**
   * Create a collage from multiple images
   */
  async createCollage(
    imageUrls: string[],
    options: {
      layout?: 'grid' | 'masonry' | 'panorama';
      width?: number;
      height?: number;
      spacing?: number;
      backgroundColor?: string;
    } = {}
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/collage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          imageUrls,
          options: {
            layout: options.layout || 'grid',
            width: options.width || 1200,
            height: options.height || 800,
            spacing: options.spacing || 10,
            backgroundColor: options.backgroundColor || '#ffffff',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Collage creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'createCollage');
    }
  }

  /**
   * Generate a video preview/gif
   */
  async generateVideoPreview(
    videoUrl: string,
    options: {
      duration?: number;
      width?: number;
      height?: number;
      fps?: number;
      format?: 'gif' | 'webp' | 'mp4';
    } = {}
  ): Promise<ProcessedMedia> {
    try {
      const response = await fetch(`${this.baseUrl}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          videoUrl,
          options: {
            duration: options.duration || 3,
            width: options.width || 400,
            height: options.height || 300,
            fps: options.fps || 10,
            format: options.format || 'gif',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Video preview generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'generateVideoPreview');
    }
  }

  /**
   * Batch process multiple media files
   */
  async batchProcess(
    mediaUrls: string[],
    operation: 'optimize' | 'thumbnail' | 'convert',
    options: any = {}
  ): Promise<ProcessedMedia[]> {
    try {
      const response = await fetch(`${this.baseUrl}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          mediaUrls,
          operation,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch processing failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'batchProcess');
    }
  }

  /**
   * Get processing status
   */
  async getProcessingStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    result?: ProcessedMedia;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getProcessingStatus');
    }
  }

  /**
   * Delete processed media
   */
  async deleteProcessedMedia(mediaId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Media deletion failed: ${response.statusText}`);
      }
    } catch (error) {
      throw errorHandler.handleApiError(error, 'deleteProcessedMedia');
    }
  }

  /**
   * Get media analytics
   */
  async getMediaAnalytics(mediaId: string): Promise<{
    views: number;
    downloads: number;
    shares: number;
    likes: number;
    processingTime: number;
    fileSize: number;
    compressionRatio: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/${mediaId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Analytics fetch failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw errorHandler.handleApiError(error, 'getMediaAnalytics');
    }
  }

  /**
   * Utility function to get optimized image URL
   */
  getOptimizedImageUrl(
    originalUrl: string,
    options: MediaOptimizationOptions = {}
  ): string {
    const params = new URLSearchParams();
    
    if (options.width) params.set('w', options.width.toString());
    if (options.height) params.set('h', options.height.toString());
    if (options.quality) params.set('q', options.quality.toString());
    if (options.format) params.set('f', options.format);
    if (options.progressive) params.set('p', '1');
    if (options.compression) params.set('c', options.compression.toString());

    return `${this.baseUrl}/proxy?url=${encodeURIComponent(originalUrl)}&${params.toString()}`;
  }

  /**
   * Utility function to get responsive image URLs
   */
  getResponsiveImageUrls(
    originalUrl: string,
    sizes: number[] = [320, 640, 1024, 1920]
  ): { size: number; url: string }[] {
    return sizes.map(size => ({
      size,
      url: this.getOptimizedImageUrl(originalUrl, { width: size, quality: 85 })
    }));
  }

  /**
   * Utility function to generate srcset for responsive images
   */
  generateSrcSet(
    originalUrl: string,
    sizes: number[] = [320, 640, 1024, 1920]
  ): string {
    return this.getResponsiveImageUrls(originalUrl, sizes)
      .map(({ size, url }) => `${url} ${size}w`)
      .join(', ');
  }
}

// Create and export a singleton instance
export const mediaService = new MediaService();

// Export the class for custom instances
export { MediaService };
