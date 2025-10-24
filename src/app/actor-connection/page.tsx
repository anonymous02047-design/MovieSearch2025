'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Alert } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

export default function ActorConnectionPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <LinkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Actor Connection Game</Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Find the Connection</Typography>
              <TextField fullWidth label="Starting Actor" sx={{ mb: 2 }} />
              <TextField fullWidth label="Target Actor" sx={{ mb: 2 }} />
              <Button variant="contained" fullWidth>Find Connection</Button>
              <Alert severity="info" sx={{ mt: 2 }}>Connect any two actors through their movie collaborations!</Alert>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

