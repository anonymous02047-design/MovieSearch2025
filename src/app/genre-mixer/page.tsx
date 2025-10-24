'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Button, Chip } from '@mui/material';
import { Shuffle as ShuffleIcon } from '@mui/icons-material';

export default function GenreMixerPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ShuffleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Genre Mixer</Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Discover unique genre combinations
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Chip label="Action" sx={{ m: 0.5 }} />
            <Chip label="+" sx={{ m: 0.5 }} />
            <Chip label="Comedy" sx={{ m: 0.5 }} />
          </Box>
          <Button variant="contained">Find Movies</Button>
        </Container>
      </Box>
    </AuthGuard>
  );
}

