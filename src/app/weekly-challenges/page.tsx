'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, LinearProgress } from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';

export default function WeeklyChallengesPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <EventIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Weekly Challenges</Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>This Week: Watch 3 80s Movies</Typography>
              <LinearProgress variant="determinate" value={33} sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">1 of 3 complete</Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

