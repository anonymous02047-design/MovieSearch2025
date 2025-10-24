'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Alert } from '@mui/material';
import { Compare as CompareIcon } from '@mui/icons-material';

export default function RatingComparisonPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <CompareIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Rating Comparison</Typography>
          </Box>
          <Alert severity="info">Compare your ratings with critics and community ratings!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

