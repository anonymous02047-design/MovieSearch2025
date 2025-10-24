'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { MovieFilter as MovieFilterIcon } from '@mui/icons-material';

export default function FranchiseTrackerPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <MovieFilterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Franchise Tracker</Typography>
          </Box>
          <Alert severity="info">Track all movies in your favorite franchises - Coming soon!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

