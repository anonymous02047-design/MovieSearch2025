'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';

export default function ReleaseCalendarPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <CalendarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Release Calendar</Typography>
          </Box>
          <Alert severity="info">Track upcoming movie releases - Feature coming soon!</Alert>
        </Container>
      </Box>
    </AuthGuard>
  );
}

