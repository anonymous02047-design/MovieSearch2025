'use client';

import React from 'react';
import { Box, CircularProgress, Typography, alpha, useTheme } from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ message = 'Loading...', fullScreen = true }: LoadingScreenProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '400px',
        background: fullScreen
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'transparent',
        gap: 3,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: fullScreen ? 'white' : 'primary.main',
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MovieIcon
            sx={{
              fontSize: 40,
              color: fullScreen ? 'white' : 'primary.main',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.5,
                  transform: 'scale(0.9)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
              },
            }}
          />
        </Box>
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: fullScreen ? 'white' : 'text.primary',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>

      {fullScreen && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
            MovieSearch 2025 - Enhanced Edition
          </Typography>
        </Box>
      )}
    </Box>
  );
}

