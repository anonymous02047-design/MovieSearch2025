'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { Videocam as VideocamIcon, Upload as UploadIcon } from '@mui/icons-material';

export default function SceneRecreationPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <VideocamIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Scene Recreation</Typography>
          </Box>
          <Button variant="contained" startIcon={<UploadIcon />} sx={{ mb: 3 }}>Upload Your Recreation</Button>
          <Alert severity="info">Share your recreations of iconic movie scenes!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

