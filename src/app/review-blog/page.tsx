'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Button, Card, CardContent } from '@mui/material';
import { Article as ArticleIcon, Add as AddIcon } from '@mui/icons-material';

export default function ReviewBlogPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <ArticleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Review Blog</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Write New Review</Button>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>My Latest Review</Typography>
              <Typography variant="body2" color="text.secondary">Start writing your first in-depth movie review!</Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

