'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Alert } from '@mui/material';
import { Checkroom as CheckroomIcon } from '@mui/icons-material';

export default function CostumeGalleryPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <CheckroomIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Costume Gallery</Typography>
          </Box>
          <Alert severity="info">Browse iconic movie costumes and fashion from cinema history!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

