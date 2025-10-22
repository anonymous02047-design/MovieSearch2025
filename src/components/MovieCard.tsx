'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkBorder as BookmarkBorderIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { Movie, getImageUrl, formatDate } from '@/lib/tmdb';
import { getGenreNames } from '@/lib/genres';
import { addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist, isFavorite, isInWatchlist } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import TMDBImage from './TMDBImage';

interface MovieCardProps {
  movie: Movie;
  onToggleFavorite?: (movieId: number) => void;
  onToggleWatchlist?: (movieId: number) => void;
}

export default function MovieCard({ 
  movie, 
  onToggleFavorite, 
  onToggleWatchlist,
}: MovieCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [favoriteState, setFavoriteState] = useState(false);
  const [watchlistState, setWatchlistState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFavoriteState(isFavorite(movie.id));
    setWatchlistState(isInWatchlist(movie.id));
  }, [movie.id]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !favoriteState;
    
    if (newFavoriteState) {
      const success = addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString(),
      });
      if (success) {
        setFavoriteState(true);
      }
    } else {
      const success = removeFromFavorites(movie.id);
      if (success) {
        setFavoriteState(false);
      }
    }
    
    if (onToggleFavorite) {
      onToggleFavorite(movie.id);
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newWatchlistState = !watchlistState;
    
    if (newWatchlistState) {
      const success = addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString(),
      });
      if (success) {
        setWatchlistState(true);
      }
    } else {
      const success = removeFromWatchlist(movie.id);
      if (success) {
        setWatchlistState(false);
      }
    }
    
    if (onToggleWatchlist) {
      onToggleWatchlist(movie.id);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // You can implement trailer playback here
    console.log('Play trailer for:', movie.title);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/movie/${movie.id}`);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#4caf50'; // Green
    if (rating >= 6) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
          '& .movie-card-overlay': {
            opacity: 1,
          },
          '& .movie-card-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
      onClick={handleCardClick}
    >
      {/* Movie Poster */}
      <Box sx={{ position: 'relative', aspectRatio: '2/3' }}>
        {/* Hover Overlay */}
        <Box
          className="movie-card-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.1)',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <PlayIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
        <TMDBImage
          path={movie.poster_path}
          alt={movie.title}
          width={500}
          height={750}
          size="w500"
          fill
          priority={false}
          sx={{
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Fallback for missing images */}
        {imageError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              p: 2,
            }}
          >
            <MovieIcon sx={{ fontSize: 48, mb: 1, opacity: 0.7 }} />
            <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
              {movie.title}
            </Typography>
          </Box>
        )}
        
        {/* Overlay with actions */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <Tooltip title="Play Trailer">
            <IconButton
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { backgroundColor: 'white' }
              }}
              onClick={handlePlayClick}
            >
              <PlayIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { backgroundColor: 'white' }
              }}
              onClick={handleInfoClick}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Rating Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: getRatingColor(movie.vote_average),
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          >
            {movie.vote_average.toFixed(1)}
          </Typography>
        </Box>

        {/* Action Buttons Container */}
        <Box
          className="movie-card-actions"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Favorite Button */}
          <Tooltip title={favoriteState ? "Remove from favorites" : "Add to favorites"}>
            <IconButton
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: favoriteState ? 'error.main' : 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  transform: 'scale(1.1)',
                },
              }}
              onClick={handleToggleFavorite}
            >
              {favoriteState ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>

          {/* Watchlist Button */}
          <Tooltip title={watchlistState ? "Remove from watchlist" : "Add to watchlist"}>
            <IconButton
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: watchlistState ? 'primary.main' : 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  transform: 'scale(1.1)',
                },
              }}
              onClick={handleToggleWatchlist}
            >
              {watchlistState ? <BookmarkAddIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 2.5,
        '&:last-child': {
          pb: 2.5,
        },
      }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'text.primary',
            transition: 'color 0.2s ease',
          }}
        >
          {movie.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating
            value={movie.vote_average / 2}
            precision={0.1}
            size="small"
            readOnly
            sx={{ mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            ({movie.vote_count})
          </Typography>
        </Box>

        {movie.release_date && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {formatDate(movie.release_date)}
          </Typography>
        )}

        {movie.overview && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
            }}
          >
            {movie.overview}
          </Typography>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {movie.genre_ids && getGenreNames(movie.genre_ids).slice(0, 2).map((genreName, index) => (
            <Chip
              key={`${movie.genre_ids[index]}-${genreName}`}
              label={genreName}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem', 
                height: 24,
                borderRadius: 12,
                fontWeight: 500,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.2s ease',
              }}
            />
          ))}
          {movie.genre_ids.length > 2 && (
            <Chip
              label={`+${movie.genre_ids.length - 2}`}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: '0.75rem', 
                height: 24,
                borderRadius: 12,
                fontWeight: 500,
                borderColor: 'grey.400',
                color: 'grey.600',
              }}
            />
          )}
        </Box>
      </CardActions>
    </Card>
  );
}
