'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Rating,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  BookmarkAdd as BookmarkIcon,
  Share as ShareIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Movie, getImageUrl, formatDate } from '@/lib/tmdb';
import { getGenreNames } from '@/lib/genres';

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  movieId: number | null;
}

export default function QuickViewModal({ open, onClose, movieId }: QuickViewModalProps) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && movieId) {
      fetchMovieDetails();
    }
  }, [open, movieId]);

  const fetchMovieDetails = async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFull = () => {
    if (movie) {
      router.push(`/movie/${movie.id}`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : movie ? (
          <Box>
            {/* Backdrop with Gradient Overlay */}
            <Box
              sx={{
                position: 'relative',
                height: 300,
                backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  zIndex: 1,
                  color: 'white',
                }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {movie.title}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={formatDate(movie.release_date)} size="small" />
                  <Chip label={`${movie.runtime} min`} size="small" />
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Rating value={movie.vote_average / 2} precision={0.1} size="small" readOnly />
                    <Typography variant="body2">
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* Content */}
            <Box p={3}>
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
                {movie.genres?.map((genre) => (
                  <Chip key={genre.id} label={genre.name} variant="outlined" size="small" />
                ))}
              </Stack>

              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Quick Stats */}
              <Stack spacing={1}>
                {movie.budget > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Budget:
                    </Typography>
                    <Typography variant="body2">
                      ${(movie.budget / 1000000).toFixed(0)}M
                    </Typography>
                  </Box>
                )}
                {movie.revenue > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Revenue:
                    </Typography>
                    <Typography variant="body2">
                      ${(movie.revenue / 1000000).toFixed(0)}M
                    </Typography>
                  </Box>
                )}
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography variant="body2">{movie.status}</Typography>
                </Box>
              </Stack>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  fullWidth
                  onClick={handleOpenFull}
                >
                  Watch Trailer
                </Button>
                <IconButton color="primary">
                  <FavoriteIcon />
                </IconButton>
                <IconButton color="primary">
                  <BookmarkIcon />
                </IconButton>
                <IconButton color="primary">
                  <ShareIcon />
                </IconButton>
              </Stack>

              <Button
                fullWidth
                startIcon={<OpenInNewIcon />}
                onClick={handleOpenFull}
                sx={{ mt: 2 }}
              >
                View Full Details
              </Button>
            </Box>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

