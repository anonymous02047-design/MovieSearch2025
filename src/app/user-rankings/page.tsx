'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

export default function UserRankingsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>User Rankings</Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Create Your Own Movie Rankings</Typography>
              <List>
                <ListItem><ListItemText primary="Top 10 Thrillers" secondary="Rank your favorites" /></ListItem>
                <ListItem><ListItemText primary="Best Sci-Fi Films" secondary="Rank your favorites" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

