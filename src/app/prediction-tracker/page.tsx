'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

export default function PredictionTrackerPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Awards Prediction Tracker</Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Make your Oscar predictions and track your accuracy
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>2025 Oscars</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Ceremony: March 2, 2025
                  </Typography>
                  <Button variant="contained">Make Predictions</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

