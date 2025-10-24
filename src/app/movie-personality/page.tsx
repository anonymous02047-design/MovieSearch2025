'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { Psychology as PsychologyIcon, PlayArrow as PlayIcon } from '@mui/icons-material';

export default function MoviePersonalityPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Personality Quiz</Typography>
          </Box>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <PsychologyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>Discover Your Movie Personality</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Answer a few questions to find out what type of movie watcher you are!
              </Typography>
              <Button variant="contained" size="large" startIcon={<PlayIcon />}>Start Quiz</Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

