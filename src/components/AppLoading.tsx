'use client';

import React from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface AppLoadingProps {
  message?: string;
  showLogo?: boolean;
}

export default function AppLoading({ 
  message = "Loading your movie experience...", 
  showLogo = true 
}: AppLoadingProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        {showLogo && (
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <MovieIcon sx={{ fontSize: 48 }} />
            <StarIcon sx={{ fontSize: 48 }} />
          </Stack>
        )}
        
        <CircularProgress 
          size={60} 
          sx={{ 
            color: 'white', 
            mb: 3,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
        
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          MovieSearch 2025
        </Typography>
        
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {message}
        </Typography>
      </Paper>
    </Container>
  );
}
