'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  Slider,
  Chip,
  Stack,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  CircularProgress,
  Alert,
  Badge,
  Zoom,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  Replay as ReplayIcon,
  FastForward as FastForwardIcon,
  FastRewind as FastRewindIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Info as InfoIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
  PhotoLibrary as PhotoLibraryIcon,
} from '@mui/icons-material';

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
}

interface MediaViewerProps {
  open: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  initialIndex?: number;
  title?: string;
  showThumbnails?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowFullscreen?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  showControls?: boolean;
}

export default function MediaViewer({
  open,
  onClose,
  mediaItems,
  initialIndex = 0,
  title = 'Media Viewer',
  showThumbnails = true,
  allowDownload = true,
  allowShare = true,
  allowFullscreen = true,
  autoPlay = false,
  loop = false,
  showControls = true,
}: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMedia = mediaItems[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (currentMedia?.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
      });
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime);
      });
      video.addEventListener('ended', () => {
        setIsPlaying(false);
        if (!loop) {
          handleNext();
        }
      });
    }
  }, [currentMedia, loop]);

  useEffect(() => {
    if (isPlaying && currentMedia?.type === 'video' && videoRef.current) {
      videoRef.current.play();
    } else if (!isPlaying && currentMedia?.type === 'video' && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isPlaying, currentMedia]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageZoom(1);
      setImageRotation(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageZoom(1);
      setImageRotation(0);
    }
  };

  const handlePlayPause = () => {
    if (currentMedia?.type === 'video') {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const time = newValue as number;
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setImageZoom(Math.min(imageZoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    setImageZoom(Math.max(imageZoom / 1.2, 0.1));
  };

  const handleRotateLeft = () => {
    setImageRotation(imageRotation - 90);
  };

  const handleRotateRight = () => {
    setImageRotation(imageRotation + 90);
  };

  const handleDownload = () => {
    if (currentMedia) {
      const link = document.createElement('a');
      link.href = currentMedia.url;
      link.download = currentMedia.title || `media-${currentMedia.id}`;
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share && currentMedia) {
      navigator.share({
        title: currentMedia.title || 'Media',
        text: currentMedia.description || '',
        url: currentMedia.url,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(currentMedia?.url || '');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load image');
  };

  const handleVideoLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleVideoError = () => {
    setLoading(false);
    setError('Failed to load video');
  };

  if (!currentMedia) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          bgcolor: 'black',
          color: 'white',
          m: 0,
          maxHeight: '100vh',
          maxWidth: '100vw',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(0,0,0,0.8)',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentMedia.type === 'image' ? <ImageIcon /> : <MovieIcon />}
          <Typography variant="h6">
            {currentMedia.title || `${currentMedia.type} ${currentIndex + 1}`}
          </Typography>
          <Chip
            label={`${currentIndex + 1} of ${mediaItems.length}`}
            size="small"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {allowDownload && (
            <Tooltip title="Download">
              <IconButton onClick={handleDownload} sx={{ color: 'white' }}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          {allowShare && (
            <Tooltip title="Share">
              <IconButton onClick={handleShare} sx={{ color: 'white' }}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Info">
            <IconButton onClick={() => setShowInfo(!showInfo)} sx={{ color: 'white' }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          {allowFullscreen && (
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close">
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent
        ref={containerRef}
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'black',
          position: 'relative',
        }}
      >
        {/* Main Media Display */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ position: 'absolute', top: 20, left: 20, right: 20 }}>
              {error}
            </Alert>
          )}

          {currentMedia.type === 'image' ? (
            <Box
              sx={{
                position: 'relative',
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentMedia.url && currentMedia.url.trim() !== '' ? (
                <img
                  ref={imageRef}
                  src={currentMedia.url}
                  alt={currentMedia.title || 'Media'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: 'grey.400'
                }}>
                  <Typography>No image available</Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentMedia.url && currentMedia.url.trim() !== '' ? (
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  poster={currentMedia.thumbnail}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  onLoadStart={() => setLoading(true)}
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                  loop={loop}
                  muted={isMuted}
                  volume={volume}
                />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: 'grey.400'
                }}>
                  <Typography>No video available</Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Navigation Arrows */}
          {mediaItems.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  '&:disabled': { opacity: 0.3 },
                }}
              >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentIndex === mediaItems.length - 1}
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  '&:disabled': { opacity: 0.3 },
                }}
              >
                <SkipNextIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Video Controls */}
        {currentMedia.type === 'video' && showControls && (
          <Box
            sx={{
              bgcolor: 'rgba(0,0,0,0.8)',
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Stack spacing={2}>
              {/* Progress Bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" sx={{ minWidth: 50 }}>
                  {formatTime(currentTime)}
                </Typography>
                <Slider
                  value={currentTime}
                  onChange={handleSeek}
                  max={duration}
                  step={0.1}
                  sx={{
                    flex: 1,
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ minWidth: 50 }}>
                  {formatTime(duration)}
                </Typography>
              </Box>

              {/* Control Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </IconButton>
                  <IconButton onClick={handleMuteToggle} sx={{ color: 'white' }}>
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </IconButton>
                  <Box sx={{ width: 100 }}>
                    <Slider
                      value={volume}
                      onChange={handleVolumeChange}
                      min={0}
                      max={1}
                      step={0.1}
                      sx={{ color: 'primary.main' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton sx={{ color: 'white' }}>
                    <SettingsIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'white' }}>
                    <ReplayIcon />
                  </IconButton>
                </Box>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Image Controls */}
        {currentMedia.type === 'image' && (
          <Box
            sx={{
              bgcolor: 'rgba(0,0,0,0.8)',
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Tooltip title="Zoom Out">
                <IconButton onClick={handleZoomOut} sx={{ color: 'white' }}>
                  <ZoomOutIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'center' }}>
                {Math.round(imageZoom * 100)}%
              </Typography>
              <Tooltip title="Zoom In">
                <IconButton onClick={handleZoomIn} sx={{ color: 'white' }}>
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate Left">
                <IconButton onClick={handleRotateLeft} sx={{ color: 'white' }}>
                  <RotateLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rotate Right">
                <IconButton onClick={handleRotateRight} sx={{ color: 'white' }}>
                  <RotateRightIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Thumbnail Strip */}
        {showThumbnails && mediaItems.length > 1 && (
          <Box
            sx={{
              bgcolor: 'rgba(0,0,0,0.8)',
              p: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              maxHeight: 120,
              overflow: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, overflow: 'auto' }}>
              {mediaItems.map((item, index) => (
                <Card
                  key={item.id}
                  sx={{
                    minWidth: 80,
                    cursor: 'pointer',
                    border: currentIndex === index ? '2px solid #1976d2' : '1px solid transparent',
                    '&:hover': { border: '2px solid rgba(255,255,255,0.5)' },
                  }}
                  onClick={() => setCurrentIndex(index)}
                >
                  <CardMedia
                    component="img"
                    height="60"
                    image={item.thumbnail || item.url}
                    alt={item.title || `Thumbnail ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                    <Typography variant="caption" noWrap>
                      {item.title || `${item.type} ${index + 1}`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Media Info Panel */}
        {showInfo && (
          <Fade in={showInfo}>
            <Paper
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                p: 2,
                bgcolor: 'rgba(0,0,0,0.8)',
                color: 'white',
                maxWidth: 300,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Media Information
              </Typography>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">
                    {currentMedia.type.toUpperCase()}
                  </Typography>
                </Box>
                {currentMedia.width && currentMedia.height && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body1">
                      {currentMedia.width} × {currentMedia.height}
                    </Typography>
                  </Box>
                )}
                {currentMedia.duration && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {formatTime(currentMedia.duration)}
                    </Typography>
                  </Box>
                )}
                {currentMedia.file_size && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      File Size
                    </Typography>
                    <Typography variant="body1">
                      {(currentMedia.file_size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                )}
                {currentMedia.format && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Format
                    </Typography>
                    <Typography variant="body1">
                      {currentMedia.format.toUpperCase()}
                    </Typography>
                  </Box>
                )}
                {currentMedia.tags && currentMedia.tags.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {currentMedia.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
}
