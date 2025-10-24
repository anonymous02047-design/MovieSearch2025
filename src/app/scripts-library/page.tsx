'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, TextField, InputAdornment } from '@mui/material';
import { Description as DescriptionIcon, Search as SearchIcon } from '@mui/icons-material';

export default function ScriptsLibraryPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Scripts Library</Typography>
          </Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search for movie scripts..."
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                }}
              />
            </CardContent>
          </Card>
          <Typography color="text.secondary">Access and read your favorite movie scripts!</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

