'use client';

import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Fade,
  Zoom,
  Badge,
  Avatar,
  Stack,
  Rating,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { Movie } from '@/lib/tmdb';

interface EnhancedMovieCardProps {
  movie: Movie;
  onFavorite?: (movie: Movie) => void;
  onBookmark?: (movie: Movie) => void;
  onShare?: (movie: Movie) => void;
  onPlay?: (movie: Movie) => void;
  onInfo?: (movie: Movie) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export default function EnhancedMovieCard({
  movie,
  onFavorite,
  onBookmark,
  onShare,
  onPlay,
  onInfo,
  showActions = true,
  variant = 'default',
  className = '',
}: EnhancedMovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear().toString();
  };

  const getImageUrl = () => {
    if (imageError) {
      return '/placeholder-movie.jpg';
    }
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : '/placeholder-movie.jpg';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'success';
    if (rating >= 6) return 'warning';
    return 'error';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 8) return 'Excellent';
    if (rating >= 6) return 'Good';
    if (rating >= 4) return 'Average';
    return 'Poor';
  };

  if (variant === 'compact') {
    return (
      <Card
        className={`card-hover ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: 'flex',
          height: 120,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 80, height: 120, objectFit: 'cover' }}
          image={getImageUrl()}
          alt={movie.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <CardContent sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle1" component="h3" noWrap>
              {movie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(movie.release_date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="caption" color="text.secondary">
              {movie.vote_average.toFixed(1)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card
        className={`card-hover ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="400"
            image={getImageUrl()}
            alt={movie.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            sx={{
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          
          {/* Overlay on hover */}
          <Fade in={isHovered}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                p: 2,
              }}
            >
              <Stack direction="row" spacing={1}>
                {onPlay && (
                  <Tooltip title="Play Trailer">
                    <IconButton
                      onClick={() => onPlay(movie)}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      <PlayIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {onInfo && (
                  <Tooltip title="More Info">
                    <IconButton
                      onClick={() => onInfo(movie)}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.3)',
                        }
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          </Fade>

          {/* Rating Badge */}
          <Chip
            label={`${movie.vote_average.toFixed(1)}`}
            color={getRatingColor(movie.vote_average) as any}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />

          {/* Release Year */}
          <Chip
            label={formatDate(movie.release_date)}
            variant="outlined"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          />
        </Box>

        <CardContent sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {movie.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="caption" color="text.secondary">
              {getRatingLabel(movie.vote_average)}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '3.6em',
            }}
          >
            {movie.overview || 'No description available.'}
          </Typography>
        </CardContent>

        {showActions && (
          <CardActions sx={{ p: 2, pt: 0 }}>
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              {onFavorite && (
                <Tooltip title="Add to Favorites">
                  <IconButton
                    onClick={() => onFavorite(movie)}
                    size="small"
                    className="hover-lift"
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              )}
              {onBookmark && (
                <Tooltip title="Add to Watchlist">
                  <IconButton
                    onClick={() => onBookmark(movie)}
                    size="small"
                    className="hover-lift"
                  >
                    <BookmarkIcon />
                  </IconButton>
                </Tooltip>
              )}
              {onShare && (
                <Tooltip title="Share">
                  <IconButton
                    onClick={() => onShare(movie)}
                    size="small"
                    className="hover-lift"
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </CardActions>
        )}
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={`card-hover ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={getImageUrl()}
          alt={movie.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sx={{
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        
        {/* Loading overlay */}
        {!imageLoaded && (
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
              bgcolor: 'grey.200',
            }}
          >
            <Box className="shimmer" sx={{ width: '100%', height: '100%' }} />
          </Box>
        )}

        {/* Overlay on hover */}
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              p: 2,
            }}
          >
            <Stack direction="row" spacing={1}>
              {onPlay && (
                <Tooltip title="Play Trailer">
                  <IconButton
                    onClick={() => onPlay(movie)}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    <PlayIcon />
                  </IconButton>
                </Tooltip>
              )}
              {onInfo && (
                <Tooltip title="More Info">
                  <IconButton
                    onClick={() => onInfo(movie)}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Fade>

        {/* Rating Badge */}
        <Chip
          label={`${movie.vote_average.toFixed(1)}`}
          color={getRatingColor(movie.vote_average) as any}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontWeight: 'bold',
          }}
        />

        {/* Release Year */}
        <Chip
          label={formatDate(movie.release_date)}
          variant="outlined"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {movie.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating
            value={movie.vote_average / 2}
            precision={0.1}
            size="small"
            readOnly
          />
          <Typography variant="caption" color="text.secondary">
            {movie.vote_average.toFixed(1)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.4em',
          }}
        >
          {movie.overview || 'No description available.'}
        </Typography>
      </CardContent>

      {showActions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            {onFavorite && (
              <Tooltip title="Add to Favorites">
                <IconButton
                  onClick={() => onFavorite(movie)}
                  size="small"
                  className="hover-lift"
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
            )}
            {onBookmark && (
              <Tooltip title="Add to Watchlist">
                <IconButton
                  onClick={() => onBookmark(movie)}
                  size="small"
                  className="hover-lift"
                >
                  <BookmarkIcon />
                </IconButton>
              </Tooltip>
            )}
            {onShare && (
              <Tooltip title="Share">
                <IconButton
                  onClick={() => onShare(movie)}
                  size="small"
                  className="hover-lift"
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </CardActions>
      )}
    </Card>
  );
}
