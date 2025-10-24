'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button, Chip } from '@mui/material';
import { Forum as ForumIcon, Add as AddIcon } from '@mui/icons-material';

export default function MovieDebatesPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ForumIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Debates</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Start New Debate</Button>
          <Card>
            <CardContent>
              <Chip label="Active" color="success" size="small" sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>Is CGI ruining modern cinema?</Typography>
              <Typography variant="body2" color="text.secondary">1,234 votes • 567 comments</Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

