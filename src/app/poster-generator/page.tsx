'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
} from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';

export default function PosterGeneratorPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <PaletteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Poster Generator</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Create Your Poster</Typography>
                  <TextField fullWidth label="Movie Title" sx={{ mb: 2 }} />
                  <TextField fullWidth label="Tagline" sx={{ mb: 2 }} />
                  <Button variant="contained" fullWidth>Generate Poster</Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: 500, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Poster Preview</Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

