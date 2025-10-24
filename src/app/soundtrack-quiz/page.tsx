'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { MusicNote as MusicIcon, PlayArrow as PlayIcon } from '@mui/icons-material';

export default function SoundtrackQuizPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <MusicIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Soundtrack Quiz</Typography>
          </Box>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <MusicIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>Test Your Movie Music Knowledge</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Listen to iconic soundtracks and guess the movie!</Typography>
              <Button variant="contained" size="large" startIcon={<PlayIcon />}>Start Quiz</Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

