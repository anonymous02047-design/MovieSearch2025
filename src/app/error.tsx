'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Error as ErrorIcon, Home as HomeIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <ErrorIcon sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} />
        
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Oops! Something Went Wrong
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          {error.message || 'An unexpected error occurred'}
        </Typography>
        
        {error.digest && (
          <Typography variant="body2" sx={{ mb: 4, opacity: 0.7, fontFamily: 'monospace' }}>
            Error ID: {error.digest}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={() => reset()}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Try Again
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

