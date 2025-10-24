'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';

export default function QuotesCollectionPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <QuoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Quotes Collection</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Save your favorite movie quotes</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

