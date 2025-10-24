'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Alert } from '@mui/material';
import { Biotech as BiotechIcon } from '@mui/icons-material';

export default function MovieDNAPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <BiotechIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie DNA</Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Your Movie DNA Profile</Typography>
              <Alert severity="info">AI-generated analysis of your movie preferences coming soon!</Alert>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

