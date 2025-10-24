'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Alert } from '@mui/material';
import { MovieCreation as MovieIcon } from '@mui/icons-material';

export default function BehindScenesPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <MovieIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Behind the Scenes</Typography>
          </Box>
          <Alert severity="info">Explore exclusive BTS content, trivia, and production stories!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

