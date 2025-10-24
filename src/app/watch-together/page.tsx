'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Duo as DuoIcon, Add as AddIcon } from '@mui/icons-material';

export default function WatchTogetherPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <DuoIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Watch Together</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Create Watch Session</Button>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Active Sessions</Typography>
                  <Typography variant="body2" color="text.secondary">
                    No active watch sessions. Create one to watch movies with friends!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

