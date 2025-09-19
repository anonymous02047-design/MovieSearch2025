'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Badge,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Skeleton,
  Zoom,
  Fade,
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
  Info as InfoIcon,
  Fullscreen as FullscreenIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  HighQuality as QualityIcon,
  AspectRatio as AspectRatioIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import MediaViewer from './MediaViewer';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  duration?: number;
  size?: string;
  format?: string;
  quality?: string;
  aspect_ratio?: number;
  file_size?: number;
  created_at?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  downloads?: number;
  rating?: number;
  category?: string;
  album?: string;
  photographer?: string;
  location?: string;
  camera?: string;
  settings?: {
    iso?: number;
    aperture?: string;
    shutter_speed?: string;
    focal_length?: string;
  };
}

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  title?: string;
  showThumbnails?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowFullscreen?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  columns?: number;
  spacing?: number;
  showInfo?: boolean;
  showStats?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
  enableLazyLoading?: boolean;
  maxHeight?: number;
  aspectRatio?: 'auto' | 'square' | '16:9' | '4:3' | '3:2';
  layout?: 'grid' | 'masonry' | 'list';
  sortBy?: 'date' | 'name' | 'size' | 'views' | 'likes' | 'rating';
  sortOrder?: 'asc' | 'desc';
  onMediaClick?: (media: MediaItem, index: number) => void;
  onMediaDownload?: (media: MediaItem) => void;
  onMediaShare?: (media: MediaItem) => void;
  onMediaLike?: (media: MediaItem) => void;
  onMediaBookmark?: (media: MediaItem) => void;
}

export default function MediaGallery({
  mediaItems,
  title = 'Media Gallery',
  showThumbnails = true,
  allowDownload = true,
  allowShare = true,
  allowFullscreen = true,
  autoPlay = false,
  loop = false,
  showControls = true,
  columns = 4,
  spacing = 2,
  showInfo = true,
  showStats = true,
  showFilters = false,
  showSearch = false,
  enableLazyLoading = true,
  maxHeight = 300,
  aspectRatio = 'auto',
  layout = 'grid',
  sortBy = 'date',
  sortOrder = 'desc',
  onMediaClick,
  onMediaDownload,
  onMediaShare,
  onMediaLike,
  onMediaBookmark,
}: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>(mediaItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sort media items
  const sortedItems = React.useMemo(() => {
    const sorted = [...filteredItems].sort((a, b) => {
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
          aValue = a.rating || 0;
          bValue = b.rating || 0;
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

    return sorted;
  }, [filteredItems, sortBy, sortOrder]);

  // Filter media items
  React.useEffect(() => {
    let filtered = mediaItems;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.tags || []).some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [mediaItems, searchQuery, selectedCategory]);

  const handleMediaClick = useCallback(
    (media: MediaItem, index: number) => {
      setSelectedIndex(index);
      setViewerOpen(true);
      onMediaClick?.(media, index);
    },
    [onMediaClick]
  );

  const handleMediaLoad = useCallback((mediaId: string) => {
    setLoadingStates((prev) => ({ ...prev, [mediaId]: false }));
  }, []);

  const handleMediaError = useCallback((mediaId: string, error: string) => {
    setLoadingStates((prev) => ({ ...prev, [mediaId]: false }));
    setErrorStates((prev) => ({ ...prev, [mediaId]: error }));
  }, []);

  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case 'square':
        return { aspectRatio: '1/1' };
      case '16:9':
        return { aspectRatio: '16/9' };
      case '4:3':
        return { aspectRatio: '4/3' };
      case '3:2':
        return { aspectRatio: '3/2' };
      default:
        return {};
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategories = () => {
    const categories = new Set(mediaItems.map((item) => item.category).filter(Boolean));
    return Array.from(categories);
  };

  const renderMediaCard = (media: MediaItem, index: number) => {
    const isLoading = loadingStates[media.id];
    const error = errorStates[media.id];

    return (
      <Zoom in={true} timeout={300 + index * 100}>
        <Card
          key={media.id}
          sx={{
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.3s ease',
              boxShadow: 4,
            },
            ...getAspectRatioStyle(),
          }}
          onClick={() => handleMediaClick(media, index)}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component={media.type === 'video' ? 'video' : 'img'}
              height={maxHeight}
              image={media.thumbnail || media.url}
              alt={media.title || `Media ${index + 1}`}
              sx={{
                objectFit: 'cover',
                height: maxHeight,
                ...getAspectRatioStyle(),
              }}
              onLoad={() => handleMediaLoad(media.id)}
              onError={() => handleMediaError(media.id, 'Failed to load media')}
            />

            {/* Loading Overlay */}
            {isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.5)',
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            )}

            {/* Error Overlay */}
            {error && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.8)',
                }}
              >
                <Alert severity="error" sx={{ bgcolor: 'transparent' }}>
                  {error}
                </Alert>
              </Box>
            )}

            {/* Media Type Badge */}
            <Chip
              icon={media.type === 'video' ? <MovieIcon /> : <ImageIcon />}
              label={media.type.toUpperCase()}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '& .MuiChip-icon': { color: 'white' },
              }}
            />

            {/* Video Duration */}
            {media.type === 'video' && media.duration && (
              <Chip
                label={formatDuration(media.duration)}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                }}
              />
            )}

            {/* Play Button for Videos */}
            {media.type === 'video' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  p: 1,
                }}
              >
                <PlayIcon sx={{ color: 'white', fontSize: 40 }} />
              </Box>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                display: 'flex',
                gap: 0.5,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                '&:hover': { opacity: 1 },
              }}
            >
              {allowDownload && (
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMediaDownload?.(media);
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              )}
              {allowShare && (
                <Tooltip title="Share">
                  <IconButton
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMediaShare?.(media);
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Like">
                <IconButton
                  size="small"
                  sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMediaLike?.(media);
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bookmark">
                <IconButton
                  size="small"
                  sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMediaBookmark?.(media);
                  }}
                >
                  <BookmarkIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Card Content */}
          {showInfo && (
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle1" noWrap gutterBottom>
                {media.title || `Media ${index + 1}`}
              </Typography>
              {media.description && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {media.description}
                </Typography>
              )}

              {/* Stats */}
              {showStats && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  {media.views && (
                    <Chip
                      icon={<VisibilityIcon />}
                      label={media.views.toLocaleString()}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {media.likes && (
                    <Chip
                      icon={<FavoriteIcon />}
                      label={media.likes.toLocaleString()}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {media.rating && (
                    <Chip
                      icon={<StarIcon />}
                      label={media.rating.toFixed(1)}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {media.file_size && (
                    <Chip
                      icon={<StorageIcon />}
                      label={formatFileSize(media.file_size)}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}

              {/* Tags */}
              {media.tags && media.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                  {media.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                  {media.tags.length > 3 && (
                    <Chip
                      label={`+${media.tags.length - 3}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}
            </CardContent>
          )}
        </Card>
      </Zoom>
    );
  };

  const renderMasonryLayout = () => {
    // Simple masonry-like layout using CSS columns
    return (
      <Box
        sx={{
          columnCount: columns,
          columnGap: spacing * 8,
          '& > *': {
            breakInside: 'avoid',
            marginBottom: spacing * 2,
          },
        }}
      >
        {sortedItems.map((media, index) => (
          <Box key={media.id}>
            {renderMediaCard(media, index)}
          </Box>
        ))}
      </Box>
    );
  };

  const renderListLayout = () => {
    return (
      <List>
        {sortedItems.map((media, index) => (
          <ListItem
            key={media.id}
            button
            onClick={() => handleMediaClick(media, index)}
            sx={{ mb: 1, borderRadius: 1 }}
          >
            <ListItemAvatar>
              <Avatar
                src={media.thumbnail || media.url}
                variant="rounded"
                sx={{ width: 80, height: 60 }}
              >
                {media.type === 'video' ? <MovieIcon /> : <ImageIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={media.title || `Media ${index + 1}`}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {media.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={media.type.toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                    {media.duration && (
                      <Chip
                        label={formatDuration(media.duration)}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {media.file_size && (
                      <Chip
                        label={formatFileSize(media.file_size)}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

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
              label={`${mediaItems.filter((item) => item.type === 'image').length} Images`}
              variant="outlined"
            />
            <Chip
              icon={<VideoLibraryIcon />}
              label={`${mediaItems.filter((item) => item.type === 'video').length} Videos`}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Filters and Search */}
        {(showFilters || showSearch) && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              {showSearch && (
                <Box sx={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </Box>
              )}
              {showFilters && (
                <Box>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="all">All Categories</option>
                    {getCategories().map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Media Grid */}
      {layout === 'masonry' ? (
        renderMasonryLayout()
      ) : layout === 'list' ? (
        renderListLayout()
      ) : (
        <Grid container spacing={spacing}>
          {sortedItems.map((media, index) => (
            <Grid item xs={12} sm={6} md={12 / columns} key={media.id}>
              {renderMediaCard(media, index)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Media Viewer */}
      <MediaViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        mediaItems={sortedItems}
        initialIndex={selectedIndex || 0}
        title={title}
        showThumbnails={showThumbnails}
        allowDownload={allowDownload}
        allowShare={allowShare}
        allowFullscreen={allowFullscreen}
        autoPlay={autoPlay}
        loop={loop}
        showControls={showControls}
      />
    </Box>
  );
}
