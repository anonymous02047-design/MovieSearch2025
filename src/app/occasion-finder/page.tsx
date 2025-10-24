'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Celebration as CelebrationIcon } from '@mui/icons-material';

export default function OccasionFinderPage() {
  const occasions = ['Date Night', 'Family Gathering', 'Solo Evening', 'Party', 'Study Break', 'Workout Motivation'];
  
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <CelebrationIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Occasion Finder</Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Find perfect movies for any occasion
          </Typography>
          <Grid container spacing={2}>
            {occasions.map((occasion) => (
              <Grid key={occasion} size={{ xs: 6, sm: 4, md: 2 }}>
                <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.light' } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography>{occasion}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

