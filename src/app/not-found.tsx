'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Search as SearchIcon, Home as HomeIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '80px', md: '120px' },
            fontWeight: 800,
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            component={Link}
            href="/"
            sx={{
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            }}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<BackIcon />}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<SearchIcon />}
            component={Link}
            href="/advanced-search"
          >
            Search
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
