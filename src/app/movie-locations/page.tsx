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
import { LocationOn as LocationIcon } from '@mui/icons-material';

export default function MovieLocationsPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Filming Locations</Typography>
          </Box>
          <Alert severity="info">Explore where your favorite movies were filmed - Coming soon!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

