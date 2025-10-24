'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { ColorLens as ColorLensIcon } from '@mui/icons-material';

export default function ProfileThemesPage() {
  const themes = ['Dark Knight', 'Matrix Green', 'Star Wars', 'Blade Runner', 'Tron Legacy', 'Inception'];
  
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ColorLensIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Profile Themes</Typography>
          </Box>
          <Grid container spacing={3}>
            {themes.map((theme) => (
              <Grid key={theme} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' } }}>
                  <CardMedia component="div" sx={{ height: 200, bgcolor: 'grey.300' }} />
                  <CardContent>
                    <Typography variant="h6">{theme} Theme</Typography>
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

