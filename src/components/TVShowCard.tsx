'use client';

import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  Share as ShareIcon,
  Tv as TvIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/tmdb';

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity: number;
  origin_country?: string[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface TVShowCardProps {
  show: TVShow;
  onFavorite?: (show: TVShow) => void;
  onWatchlist?: (show: TVShow) => void;
  onShare?: (show: TVShow) => void;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
}

export default function TVShowCard({
  show,
  onFavorite,
  onWatchlist,
  onShare,
  isFavorite = false,
  isInWatchlist = false
}: TVShowCardProps) {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    router.push(`/tv/${show.id}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(show);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatchlist?.(show);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(show);
  };

  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A';
  const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
          '& .play-overlay': {
            opacity: 1,
          }
        }
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={getImageUrl(show.poster_path)}
          alt={show.name}
          sx={{
            aspectRatio: '2/3',
            objectFit: 'cover',
          }}
        />
        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <IconButton
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.1)',
              }
            }}
          >
            <PlayIcon sx={{ fontSize: 48 }} />
          </IconButton>
        </Box>
        <Chip
          icon={<TvIcon />}
          label="TV"
          size="small"
          color="secondary"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontWeight: 600,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <StarIcon sx={{ fontSize: 16, color: '#ffd700' }} />
          <Typography variant="caption" fontWeight={600} color="white">
            {rating}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3em',
          }}
        >
          {show.name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={year} size="small" variant="outlined" />
          {show.number_of_seasons && (
            <Chip 
              label={`${show.number_of_seasons} Season${show.number_of_seasons > 1 ? 's' : ''}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.875rem',
          }}
        >
          {show.overview || 'No description available.'}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              size="small"
              onClick={handleFavorite}
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}>
            <IconButton
              size="small"
              onClick={handleWatchlist}
              color={isInWatchlist ? 'primary' : 'default'}
            >
              {isInWatchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="Share">
          <IconButton size="small" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

