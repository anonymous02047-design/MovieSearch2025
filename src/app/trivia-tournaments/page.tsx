'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import { EmojiEvents as TrophyIcon, PlayArrow as PlayIcon } from '@mui/icons-material';

export default function TriviaTournamentsPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Trivia Tournaments</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Chip label="Live Now" color="error" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>90s Action Movies Championship</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    245 players • Ends in 2h 15m
                  </Typography>
                  <Button variant="contained" startIcon={<PlayIcon />}>Join Tournament</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Chip label="Upcoming" color="primary" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Classic Cinema Challenge</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Starts in 4 hours • $500 prize pool
                  </Typography>
                  <Button variant="outlined">Register Now</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

