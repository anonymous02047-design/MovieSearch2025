'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, Avatar } from '@mui/material';
import { Feed as FeedIcon } from '@mui/icons-material';

export default function FriendsFeedPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <FeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Friends Activity</Typography>
          </Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar>J</Avatar>
                <Box>
                  <Typography variant="body1">John watched <strong>Inception</strong></Typography>
                  <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

