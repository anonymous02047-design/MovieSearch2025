'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface MovieTrailerPlayerProps {
  open: boolean;
  onClose: () => void;
  movieId: number;
  movieTitle: string;
}

export default function MovieTrailerPlayer({ open, onClose, movieId, movieTitle }: MovieTrailerPlayerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && movieId) {
      fetchVideos();
    }
  }, [open, movieId]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      const youtubeVideos = data.results.filter((v: Video) => v.site === 'YouTube');

      setVideos(youtubeVideos);

      // Auto-select first trailer or teaser
      const trailer = youtubeVideos.find((v: Video) => v.type === 'Trailer' && v.official);
      const teaser = youtubeVideos.find((v: Video) => v.type === 'Teaser');
      setSelectedVideo(trailer || teaser || youtubeVideos[0] || null);
    } catch (err) {
      setError('Failed to load trailers. Please try again later.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVideoTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trailer':
        return 'error';
      case 'teaser':
        return 'warning';
      case 'clip':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'black',
          color: 'white',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{movieTitle} - Trailers</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && videos.length === 0 && (
          <Alert severity="info">
            No trailers available for this movie.
          </Alert>
        )}

        {!loading && !error && selectedVideo && (
          <Box>
            {/* Main Video Player */}
            <Box
              sx={{
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                overflow: 'hidden',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </Box>

            {/* Video Title and Type */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="subtitle1">{selectedVideo.name}</Typography>
              <Chip
                label={selectedVideo.type}
                size="small"
                color={getVideoTypeColor(selectedVideo.type)}
              />
              {selectedVideo.official && (
                <Chip label="Official" size="small" color="success" />
              )}
            </Box>

            {/* Other Videos */}
            {videos.length > 1 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  More Videos
                </Typography>
                <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                  {videos
                    .filter((v) => v.key !== selectedVideo.key)
                    .map((video) => (
                      <Box
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        sx={{
                          minWidth: 200,
                          cursor: 'pointer',
                          borderRadius: 1,
                          overflow: 'hidden',
                          position: 'relative',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                          alt={video.name}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                          }}
                        />
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
                          <PlayIcon sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 0.5,
                            bgcolor: 'rgba(0,0,0,0.8)',
                          }}
                          noWrap
                        >
                          {video.name}
                        </Typography>
                      </Box>
                    ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

