'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { Lightbulb as LightbulbIcon, Add as AddIcon } from '@mui/icons-material';

export default function FanTheoriesPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <LightbulbIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Fan Theories</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Share Your Theory</Button>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Inception: The Entire Movie is a Dream</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                A detailed analysis of why the spinning top never matters...
              </Typography>
              <Typography variant="caption">👍 456 upvotes • 89 comments</Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

