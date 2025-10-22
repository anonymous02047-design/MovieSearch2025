'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Close as CloseIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useContinueWatching, WatchProgress } from '@/hooks/useContinueWatching';
import { getImageUrl } from '@/lib/tmdb';

export default function ContinueWatchingSection() {
  const { continueWatching, removeFromContinueWatching } = useContinueWatching();
  const router = useRouter();
  const theme = useTheme();

  if (continueWatching.length === 0) {
    return null;
  }

  const handleClick = (item: WatchProgress) => {
    const path = item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
    router.push(path);
  };

  const handleRemove = (e: React.MouseEvent, id: number, type: 'movie' | 'tv') => {
    e.stopPropagation();
    removeFromContinueWatching(id, type);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha('#9c27b0', 0.1)} 0%, ${alpha('#673ab7', 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha('#9c27b0', 0.05)} 0%, ${alpha('#673ab7', 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <HistoryIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
        <Typography variant="h5" fontWeight={700}>
          Continue Watching
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.5),
            borderRadius: 4,
          },
        }}
      >
        {continueWatching.map((item) => (
          <Card
            key={`${item.type}-${item.id}`}
            sx={{
              minWidth: 200,
              maxWidth: 200,
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                '& .remove-btn': {
                  opacity: 1,
                }
              }
            }}
            onClick={() => handleClick(item)}
          >
            <CardMedia
              component="img"
              image={getImageUrl(item.poster_path)}
              alt={item.title}
              sx={{ height: 280, objectFit: 'cover' }}
            />
            
            <IconButton
              className="remove-btn"
              size="small"
              onClick={(e) => handleRemove(e, item.id, item.type)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                '.MuiCard-root:hover &': {
                  opacity: 1,
                }
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                <PlayIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>

            <CardContent sx={{ p: 1.5 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
              </Typography>
              
              {item.episodeTitle && (
                <Typography variant="caption" color="text.secondary" display="block">
                  S{item.seasonNumber}:E{item.episodeNumber} - {item.episodeTitle}
                </Typography>
              )}
              
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(item.progress)}% watched
                  </Typography>
                  {item.duration && (
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((item.duration * (100 - item.progress)) / 100)} min left
                    </Typography>
                  )}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Paper>
  );
}

