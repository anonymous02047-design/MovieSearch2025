'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box } from '@mui/material';
import { List as ListIcon } from '@mui/icons-material';

export default function QuickListsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ListIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Quick Lists</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Create and manage movie lists instantly</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

