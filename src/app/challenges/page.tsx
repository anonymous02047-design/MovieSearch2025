'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { EmojiEvents as TrophyIcon, Add as AddIcon } from '@mui/icons-material';

export default function ChallengesPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Challenges</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Create Challenge</Button>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Chip label="Popular" color="primary" size="small" sx={{ mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>100 Movies in 100 Days</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Watch 100 movies in 100 consecutive days</Typography>
                  <Button variant="outlined">Join Challenge</Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

