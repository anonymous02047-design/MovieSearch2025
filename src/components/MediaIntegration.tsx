'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Grid,
  Paper,
  Divider,
  Badge,
  Zoom,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
  PhotoLibrary as PhotoLibraryIcon,
  VideoLibrary as VideoLibraryIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  CloudDownload as CloudDownloadIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  HighQuality as QualityIcon,
  AspectRatio as AspectRatioIcon,
  Palette as PaletteIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  ViewComfy as MasonryIcon,
} from '@mui/icons-material';
import MediaViewer from './MediaViewer';
import MediaGallery from './MediaGallery';
import { mediaService, MediaOptimizationOptions } from '@/lib/mediaService';
import { tmdbEnhanced } from '@/lib/tmdbEnhanced';

interface MediaIntegrationProps {
  movieId?: number;
  tvId?: number;
  personId?: number;
  mediaType?: 'movie' | 'tv' | 'person';
  title?: string;
  showOptimization?: boolean;
  showAnalytics?: boolean;
  allowUpload?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowFullscreen?: boolean;
  autoOptimize?: boolean;
  defaultQuality?: 'low' | 'medium' | 'high' | 'ultra';
  maxFileSize?: number;
  allowedFormats?: string[];
  onMediaSelect?: (media: any) => void;
  onMediaUpload?: (files: File[]) => void;
  onMediaDelete?: (mediaId: string) => void;
}

export default function MediaIntegration({
  movieId,
  tvId,
  personId,
  mediaType = 'movie',
  title = 'Media Integration',
  showOptimization = true,
  showAnalytics = true,
  allowUpload = true,
  allowDownload = true,
  allowShare = true,
  allowFullscreen = true,
  autoOptimize = true,
  defaultQuality = 'medium',
  maxFileSize = 50 * 1024 * 1024, // 50MB
  allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm'],
  onMediaSelect,
  onMediaUpload,
  onMediaDelete,
}: MediaIntegrationProps) {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [optimizationDialogOpen, setOptimizationDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'views' | 'likes' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [optimizationOptions, setOptimizationOptions] = useState<MediaOptimizationOptions>({
    width: 800,
    height: 600,
    quality: 85,
    format: 'webp',
    progressive: true,
    compression: 6,
  });

  // Load media items based on the provided ID and type
  useEffect(() => {
    if (movieId || tvId || personId) {
      loadMediaItems();
    }
  }, [movieId, tvId, personId, mediaType]);

  const loadMediaItems = async () => {
    setLoading(true);
    setError(null);

    try {
      let mediaData: any;

      if (movieId && mediaType === 'movie') {
        mediaData = await tmdbEnhanced.getEnhancedMovieDetails(movieId);
      } else if (tvId && mediaType === 'tv') {
        mediaData = await tmdbEnhanced.getEnhancedTVShowDetails(tvId);
      } else if (personId && mediaType === 'person') {
        mediaData = await tmdbEnhanced.getEnhancedPersonDetails(personId);
      }

      if (mediaData) {
        const items = await processMediaData(mediaData);
        setMediaItems(items);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  const processMediaData = async (data: any) => {
    const items: any[] = [];

    // Process images
    if (data.images) {
      // Backdrops
      if (data.images.backdrops) {
        data.images.backdrops.forEach((image: any, index: number) => {
          items.push({
            id: `backdrop_${index}`,
            type: 'image',
            url: `https://image.tmdb.org/t/p/original${image.file_path}`,
            thumbnail: `https://image.tmdb.org/t/p/w300${image.file_path}`,
            title: `${data.title || data.name} - Backdrop ${index + 1}`,
            description: `Backdrop image from ${data.title || data.name}`,
            width: image.width,
            height: image.height,
            aspect_ratio: image.aspect_ratio,
            vote_average: image.vote_average,
            vote_count: image.vote_count,
            category: 'backdrop',
            created_at: new Date().toISOString(),
            tags: ['backdrop', 'movie', 'cinema'],
          });
        });
      }

      // Posters
      if (data.images.posters) {
        data.images.posters.forEach((image: any, index: number) => {
          items.push({
            id: `poster_${index}`,
            type: 'image',
            url: `https://image.tmdb.org/t/p/original${image.file_path}`,
            thumbnail: `https://image.tmdb.org/t/p/w300${image.file_path}`,
            title: `${data.title || data.name} - Poster ${index + 1}`,
            description: `Poster image from ${data.title || data.name}`,
            width: image.width,
            height: image.height,
            aspect_ratio: image.aspect_ratio,
            vote_average: image.vote_average,
            vote_count: image.vote_count,
            category: 'poster',
            created_at: new Date().toISOString(),
            tags: ['poster', 'movie', 'cinema'],
          });
        });
      }

      // Logos
      if (data.images.logos) {
        data.images.logos.forEach((image: any, index: number) => {
          items.push({
            id: `logo_${index}`,
            type: 'image',
            url: `https://image.tmdb.org/t/p/original${image.file_path}`,
            thumbnail: `https://image.tmdb.org/t/p/w300${image.file_path}`,
            title: `${data.title || data.name} - Logo ${index + 1}`,
            description: `Logo image from ${data.title || data.name}`,
            width: image.width,
            height: image.height,
            aspect_ratio: image.aspect_ratio,
            vote_average: image.vote_average,
            vote_count: image.vote_count,
            category: 'logo',
            created_at: new Date().toISOString(),
            tags: ['logo', 'branding', 'movie'],
          });
        });
      }
    }

    // Process videos
    if (data.videos) {
      data.videos.forEach((video: any, index: number) => {
        items.push({
          id: `video_${index}`,
          type: 'video',
          url: `https://www.youtube.com/watch?v=${video.key}`,
          thumbnail: `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`,
          title: video.name,
          description: video.name,
          duration: 0, // YouTube videos don't provide duration in TMDB
          width: 1920,
          height: 1080,
          aspect_ratio: 16/9,
          category: 'trailer',
          created_at: video.published_at,
          tags: [video.type, 'video', 'trailer'],
          site: video.site,
          official: video.official,
        });
      });
    }

    // Process profile images for persons
    if (data.images && data.images.profiles) {
      data.images.profiles.forEach((image: any, index: number) => {
        items.push({
          id: `profile_${index}`,
          type: 'image',
          url: `https://image.tmdb.org/t/p/original${image.file_path}`,
          thumbnail: `https://image.tmdb.org/t/p/w300${image.file_path}`,
          title: `${data.name} - Profile ${index + 1}`,
          description: `Profile image of ${data.name}`,
          width: image.width,
          height: image.height,
          aspect_ratio: image.aspect_ratio,
          vote_average: image.vote_average,
          vote_count: image.vote_count,
          category: 'profile',
          created_at: new Date().toISOString(),
          tags: ['profile', 'person', 'actor'],
        });
      });
    }

    return items;
  };

  const handleMediaClick = (media: any, index: number) => {
    setSelectedMedia(media);
    setViewerOpen(true);
    onMediaSelect?.(media);
  };

  const handleOptimizeMedia = async (media: any) => {
    try {
      setLoading(true);
      const optimized = await mediaService.optimizeImage(media.url, optimizationOptions);
      
      // Update the media item with optimized version
      setMediaItems(prev => prev.map(item => 
        item.id === media.id 
          ? { ...item, optimizedUrl: optimized.optimizedUrl, fileSize: optimized.fileSize }
          : item
      ));
      
      setOptimizationDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      setLoading(true);
      
      // Validate files
      const validFiles = files.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return allowedFormats.includes(extension || '') && file.size <= maxFileSize;
      });

      if (validFiles.length === 0) {
        setError('No valid files selected');
        return;
      }

      // Process uploaded files
      const newMediaItems = await Promise.all(
        validFiles.map(async (file, index) => {
          const url = URL.createObjectURL(file);
          const thumbnail = await mediaService.createThumbnail(url, {
            width: 300,
            height: 200,
            quality: 80,
          });

          return {
            id: `upload_${Date.now()}_${index}`,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            url,
            thumbnail: thumbnail.optimizedUrl,
            title: file.name,
            description: `Uploaded ${file.name}`,
            file_size: file.size,
            created_at: new Date().toISOString(),
            tags: ['uploaded', 'user'],
            category: 'upload',
          };
        })
      );

      setMediaItems(prev => [...prev, ...newMediaItems]);
      onMediaUpload?.(validFiles);
      setUploadDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      setMediaItems(prev => prev.filter(item => item.id !== mediaId));
      onMediaDelete?.(mediaId);
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleDownload = async (media: any) => {
    try {
      const link = document.createElement('a');
      link.href = media.optimizedUrl || media.url;
      link.download = media.title || `media-${media.id}`;
      link.click();
    } catch (err: any) {
      setError(err.message || 'Download failed');
    }
  };

  const handleShare = async (media: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: media.title,
          text: media.description,
          url: media.url,
        });
      } else {
        await navigator.clipboard.writeText(media.url);
      }
    } catch (err: any) {
      setError(err.message || 'Share failed');
    }
  };

  const filteredMedia = mediaItems.filter(item => {
    if (searchQuery) {
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.created_at || 0).getTime();
        bValue = new Date(b.created_at || 0).getTime();
        break;
      case 'name':
        aValue = (a.title || '').toLowerCase();
        bValue = (b.title || '').toLowerCase();
        break;
      case 'size':
        aValue = a.file_size || 0;
        bValue = b.file_size || 0;
        break;
      case 'views':
        aValue = a.views || 0;
        bValue = b.views || 0;
        break;
      case 'likes':
        aValue = a.likes || 0;
        bValue = b.likes || 0;
        break;
      case 'rating':
        aValue = a.vote_average || 0;
        bValue = b.vote_average || 0;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<PhotoLibraryIcon />}
              label={`${mediaItems.filter(item => item.type === 'image').length} Images`}
              variant="outlined"
            />
            <Chip
              icon={<VideoLibraryIcon />}
              label={`${mediaItems.filter(item => item.type === 'video').length} Videos`}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 200 }}
          />

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              label="Sort By"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="size">Size</MenuItem>
              <MenuItem value="views">Views</MenuItem>
              <MenuItem value="likes">Likes</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order */}
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              label="Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          {/* Layout */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Grid View">
              <IconButton
                onClick={() => setLayout('grid')}
                color={layout === 'grid' ? 'primary' : 'default'}
              >
                <GridIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Masonry View">
              <IconButton
                onClick={() => setLayout('masonry')}
                color={layout === 'masonry' ? 'primary' : 'default'}
              >
                <MasonryIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton
                onClick={() => setLayout('list')}
                color={layout === 'list' ? 'primary' : 'default'}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {allowUpload && (
              <Tooltip title="Upload Media">
                <IconButton onClick={() => setUploadDialogOpen(true)}>
                  <UploadIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Optimize Media">
              <IconButton onClick={() => setOptimizationDialogOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={loadMediaItems}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Media Gallery */}
      {!loading && (
        <MediaGallery
          mediaItems={sortedMedia}
          title=""
          showThumbnails={true}
          allowDownload={allowDownload}
          allowShare={allowShare}
          allowFullscreen={allowFullscreen}
          autoPlay={false}
          loop={false}
          showControls={true}
          columns={layout === 'grid' ? 4 : 1}
          spacing={2}
          showInfo={true}
          showStats={showAnalytics}
          showFilters={false}
          showSearch={false}
          enableLazyLoading={true}
          maxHeight={300}
          aspectRatio="auto"
          layout={layout}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onMediaClick={handleMediaClick}
          onMediaDownload={handleDownload}
          onMediaShare={handleShare}
        />
      )}

      {/* Media Viewer */}
      <MediaViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        mediaItems={sortedMedia}
        initialIndex={selectedMedia ? sortedMedia.findIndex(item => item.id === selectedMedia.id) : 0}
        title={title}
        showThumbnails={true}
        allowDownload={allowDownload}
        allowShare={allowShare}
        allowFullscreen={allowFullscreen}
        autoPlay={false}
        loop={false}
        showControls={true}
      />

      {/* Optimization Dialog */}
      <Dialog
        open={optimizationDialogOpen}
        onClose={() => setOptimizationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Optimize Media</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Width"
              type="number"
              value={optimizationOptions.width}
              onChange={(e) => setOptimizationOptions(prev => ({
                ...prev,
                width: parseInt(e.target.value) || 800
              }))}
              fullWidth
            />
            <TextField
              label="Height"
              type="number"
              value={optimizationOptions.height}
              onChange={(e) => setOptimizationOptions(prev => ({
                ...prev,
                height: parseInt(e.target.value) || 600
              }))}
              fullWidth
            />
            <Box>
              <Typography gutterBottom>Quality: {optimizationOptions.quality}%</Typography>
              <Slider
                value={optimizationOptions.quality}
                onChange={(_, value) => setOptimizationOptions(prev => ({
                  ...prev,
                  quality: value as number
                }))}
                min={10}
                max={100}
                step={5}
                valueLabelDisplay="auto"
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={optimizationOptions.format}
                onChange={(e) => setOptimizationOptions(prev => ({
                  ...prev,
                  format: e.target.value as any
                }))}
                label="Format"
              >
                <MenuItem value="webp">WebP</MenuItem>
                <MenuItem value="jpeg">JPEG</MenuItem>
                <MenuItem value="png">PNG</MenuItem>
                <MenuItem value="avif">AVIF</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={optimizationOptions.progressive}
                  onChange={(e) => setOptimizationOptions(prev => ({
                    ...prev,
                    progressive: e.target.checked
                  }))}
                />
              }
              label="Progressive"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOptimizationDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleOptimizeMedia(selectedMedia)} variant="contained">
            Optimize
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Media</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main' },
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = allowedFormats.map(format => `.${format}`).join(',');
              input.onchange = (e) => {
                const files = Array.from((e.target as HTMLInputElement).files || []);
                handleUpload(files);
              };
              input.click();
            }}
          >
            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Click to upload media files
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: {allowedFormats.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Max file size: {(maxFileSize / 1024 / 1024).toFixed(0)}MB
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
