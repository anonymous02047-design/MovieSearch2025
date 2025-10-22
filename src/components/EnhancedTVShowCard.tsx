'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  Badge,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  BookmarkAdd as BookmarkAddIcon,
  BookmarkBorder as BookmarkBorderIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Tv as TvIcon,
  CheckCircle as WatchedIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import TMDBImage from './TMDBImage';

interface EnhancedTVShowCardProps {
  show: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    overview: string;
    genre_ids?: number[];
    origin_country?: string[];
    number_of_seasons?: number;
    number_of_episodes?: number;
  };
  onToggleFavorite?: (showId: number) => void;
  onToggleWatchlist?: (showId: number) => void;
  showProgress?: boolean;
  watchProgress?: number; // 0-100
}

export default function EnhancedTVShowCard({
  show,
  onToggleFavorite,
  onToggleWatchlist,
  showProgress = false,
  watchProgress = 0,
}: EnhancedTVShowCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    router.push(`/tv/${show.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onToggleFavorite) {
      onToggleFavorite(show.id);
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInWatchlist(!isInWatchlist);
    if (onToggleWatchlist) {
      onToggleWatchlist(show.id);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/tv/${show.id}`);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/tv/${show.id}`);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return theme.palette.success.main;
    if (rating >= 6) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.getFullYear().toString();
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
          '& .show-card-overlay': {
            opacity: 1,
          },
          '& .show-card-actions': {
            opacity: 1,
          },
        },
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image */}
      <Box sx={{ position: 'relative', paddingTop: '150%' }}>
        {/* Play Button Overlay */}
        <Box
          className="show-card-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.9)} 0%, ${alpha(theme.palette.common.black, 0.4)} 50%, ${alpha(theme.palette.common.black, 0)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={handlePlayClick}
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.9),
              color: 'white',
              width: 64,
              height: 64,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                transform: 'scale(1.1)',
              },
            }}
          >
            <PlayIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

        <TMDBImage
          path={show.poster_path}
          alt={show.name}
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

        {/* Rating Badge */}
        {show.vote_average > 0 && (
          <Chip
            icon={<TvIcon />}
            label={show.vote_average.toFixed(1)}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: alpha(getRatingColor(show.vote_average), 0.95),
              color: 'white',
              fontWeight: 'bold',
              zIndex: 3,
            }}
          />
        )}

        {/* Watch Progress */}
        {showProgress && watchProgress > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 6,
              backgroundColor: alpha(theme.palette.common.white, 0.3),
              zIndex: 3,
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${watchProgress}%`,
                backgroundColor: theme.palette.success.main,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        )}

        {/* Favorite & Watchlist Icons */}
        <Box
          className="show-card-actions"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: 3,
          }}
        >
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                '&:hover': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="small" color="error" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}>
            <IconButton
              size="small"
              onClick={handleToggleWatchlist}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                '&:hover': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              {isInWatchlist ? (
                <BookmarkAddIcon fontSize="small" color="primary" />
              ) : (
                <BookmarkBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Seasons Badge */}
        {show.number_of_seasons && show.number_of_seasons > 0 && (
          <Chip
            label={`${show.number_of_seasons} Season${show.number_of_seasons > 1 ? 's' : ''}`}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              fontWeight: 'bold',
              zIndex: 3,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Tooltip title={show.name} placement="top">
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              minHeight: '2.6em',
            }}
          >
            {show.name}
          </Typography>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {show.first_air_date && (
            <Typography variant="caption" color="text.secondary">
              {formatDate(show.first_air_date)}
            </Typography>
          )}
          
          {show.origin_country && show.origin_country.length > 0 && (
            <Chip
              label={show.origin_country[0]}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>

        {show.vote_count > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating
              value={show.vote_average / 2}
              precision={0.1}
              size="small"
              readOnly
              sx={{ fontSize: '1rem' }}
            />
            <Typography variant="caption" color="text.secondary">
              ({show.vote_count.toLocaleString()})
            </Typography>
          </Box>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {show.overview || 'No overview available.'}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Tooltip title="More Info">
          <IconButton size="small" onClick={handleInfoClick} color="primary">
            <InfoIcon />
          </IconButton>
        </Tooltip>
        
        {watchProgress === 100 && (
          <Tooltip title="Completed">
            <WatchedIcon color="success" fontSize="small" sx={{ ml: 'auto' }} />
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
}

