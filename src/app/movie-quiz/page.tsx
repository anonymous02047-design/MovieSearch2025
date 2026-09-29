'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { Quiz as QuizIcon } from '@mui/icons-material';

export default function MovieQuizPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <QuizIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Quiz</Typography>
          </Box>
          <Typography variant="body1" sx={{
            color: "text.secondary"
          }}>Test your movie knowledge</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}
