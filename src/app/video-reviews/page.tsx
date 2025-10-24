'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { VideoLibrary as VideoIcon, Upload as UploadIcon } from '@mui/icons-material';

export default function VideoReviewsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <VideoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Video Reviews</Typography>
          </Box>
          <Button variant="contained" startIcon={<UploadIcon />} sx={{ mb: 3 }}>Upload Video Review</Button>
          <Alert severity="info">Share your movie opinions through video reviews!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

