'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';

export default function DirectorExplorerPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <MovieIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Director Explorer</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Explore films by your favorite directors</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

