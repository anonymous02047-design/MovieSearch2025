'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

export default function PersonalRatingsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Personal Ratings</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Your comprehensive movie rating system</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

