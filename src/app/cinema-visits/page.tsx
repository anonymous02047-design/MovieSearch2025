'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { Theaters as TheaterIcon } from '@mui/icons-material';

export default function CinemaVisitsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TheaterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Cinema Visits</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Track your theater experiences</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

