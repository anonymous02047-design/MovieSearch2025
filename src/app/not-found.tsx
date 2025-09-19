'use client';

import React from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  Home as HomeIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
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
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <MovieIcon sx={{ fontSize: 64 }} />
          <StarIcon sx={{ fontSize: 64 }} />
        </Stack>
        
        <Typography variant="h1" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }
        }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Page Not Found
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleGoBack}
            sx={{
              borderColor: 'white',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Go Back
          </Button>
        </Stack>
        
        <Typography variant="body2" sx={{ mt: 4, opacity: 0.8 }}>
          Looking for something specific? Try searching for movies or browse our popular content.
        </Typography>
      </Paper>
    </Container>
  );
}
