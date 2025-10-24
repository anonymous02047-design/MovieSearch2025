'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Alert } from '@mui/material';
import { Diamond as DiamondIcon } from '@mui/icons-material';

export default function HiddenGemsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <DiamondIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Hidden Gems</Typography>
          </Box>
          <Alert severity="info">Discover underrated movies you've never heard of!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

