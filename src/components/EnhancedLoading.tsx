'use client';

import React from 'react';
import { Box, CircularProgress, Typography, Fade, Skeleton } from '@mui/material';
import { Movie as MovieIcon, Tv as TvIcon, Search as SearchIcon } from '@mui/icons-material';

interface EnhancedLoadingProps {
  message?: string;
  type?: 'default' | 'movie' | 'tv' | 'search';
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  showSkeleton?: boolean;
  skeletonCount?: number;
}

const LoadingMessages = {
  default: 'Loading...',
  movie: 'Loading movie details...',
  tv: 'Loading TV show details...',
  search: 'Searching...',
};

const LoadingIcons = {
  default: null,
  movie: <MovieIcon />,
  tv: <TvIcon />,
  search: <SearchIcon />,
};

export default function EnhancedLoading({
  message,
  type = 'default',
  size = 'medium',
  fullScreen = false,
  showSkeleton = false,
  skeletonCount = 3,
}: EnhancedLoadingProps) {
  const displayMessage = message || LoadingMessages[type];
  const icon = LoadingIcons[type];

  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const LoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      {icon && (
        <Box
          sx={{
            animation: 'pulse 2s infinite',
            color: 'primary.main',
            fontSize: sizeMap[size] * 1.5,
          }}
        >
          {icon}
        </Box>
      )}
      
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={sizeMap[size]}
          thickness={4}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {type !== 'default' && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'primary.main',
              fontSize: sizeMap[size] * 0.4,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          maxWidth: 300,
          animation: 'fadeIn 0.6s ease-out',
        }}
      >
        {displayMessage}
      </Typography>
    </Box>
  );

  const SkeletonContent = () => (
    <Box sx={{ p: 2, width: '100%' }}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{
              mb: 1,
              borderRadius: 2,
              animation: 'shimmer 1.5s infinite',
            }}
          />
          <Skeleton
            variant="text"
            height={24}
            width="80%"
            sx={{ mb: 0.5, animation: 'shimmer 1.5s infinite' }}
          />
          <Skeleton
            variant="text"
            height={20}
            width="60%"
            sx={{ animation: 'shimmer 1.5s infinite' }}
          />
        </Box>
      ))}
    </Box>
  );

  if (showSkeleton) {
    return (
      <Fade in timeout={300}>
        <Box
          sx={{
            ...(fullScreen && {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              bgcolor: 'background.default',
            }),
          }}
        >
          <SkeletonContent />
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
          ...(!fullScreen && {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
          }),
        }}
      >
        <LoadingContent />
      </Box>
    </Fade>
  );
}

// Skeleton components for specific use cases
export const MovieCardSkeleton = () => (
  <Box sx={{ p: 1 }}>
    <Skeleton
      variant="rectangular"
      height={300}
      sx={{
        borderRadius: 2,
        mb: 1,
        animation: 'shimmer 1.5s infinite',
      }}
    />
    <Skeleton
      variant="text"
      height={24}
      width="90%"
      sx={{ mb: 0.5, animation: 'shimmer 1.5s infinite' }}
    />
    <Skeleton
      variant="text"
      height={20}
      width="70%"
      sx={{ animation: 'shimmer 1.5s infinite' }}
    />
  </Box>
);

export const ListItemSkeleton = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
    <Skeleton
      variant="circular"
      width={40}
      height={40}
      sx={{ animation: 'shimmer 1.5s infinite' }}
    />
    <Box sx={{ flex: 1 }}>
      <Skeleton
        variant="text"
        height={24}
        width="80%"
        sx={{ mb: 0.5, animation: 'shimmer 1.5s infinite' }}
      />
      <Skeleton
        variant="text"
        height={20}
        width="60%"
        sx={{ animation: 'shimmer 1.5s infinite' }}
      />
    </Box>
  </Box>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <Box sx={{ p: 2 }}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height={40}
            width={`${100 / columns}%`}
            sx={{ animation: 'shimmer 1.5s infinite' }}
          />
        ))}
      </Box>
    ))}
  </Box>
);
