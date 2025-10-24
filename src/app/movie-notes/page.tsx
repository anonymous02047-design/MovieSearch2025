'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { Note as NoteIcon } from '@mui/icons-material';

export default function MovieNotesPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <NoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Notes</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Take notes about movies you watch</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

