'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Button } from '@mui/material';
import { Shuffle as ShuffleIcon, Add as AddIcon } from '@mui/icons-material';

export default function MashupsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ShuffleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Mashups</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Create Mashup</Button>
          <Typography color="text.secondary">Create fun crossover concepts between different movies!</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

