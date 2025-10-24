'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { Whatshot as FireIcon } from '@mui/icons-material';

export default function ViewingStreaksPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <FireIcon sx={{ fontSize: 40, color: 'orange' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Viewing Streaks</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <FireIcon sx={{ fontSize: 60, color: 'orange', mb: 1 }} />
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>0</Typography>
                  <Typography color="text.secondary">Current Streak</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>0</Typography>
                  <Typography color="text.secondary">Longest Streak</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

