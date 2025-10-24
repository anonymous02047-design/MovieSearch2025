'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
} from '@mui/material';
import { Poll as PollIcon, Add as AddIcon } from '@mui/icons-material';

export default function MoviePollsPage() {
  const { user } = useUser();

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <PollIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Polls</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 3 }}>Create Poll</Button>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Best Christopher Nolan Film?</Typography>
              <RadioGroup>
                <FormControlLabel value="inception" control={<Radio />} label="Inception" />
                <LinearProgress variant="determinate" value={45} sx={{ mb: 1 }} />
                <FormControlLabel value="interstellar" control={<Radio />} label="Interstellar" />
                <LinearProgress variant="determinate" value={35} sx={{ mb: 1 }} />
                <FormControlLabel value="dark-knight" control={<Radio />} label="The Dark Knight" />
                <LinearProgress variant="determinate" value={20} sx={{ mb: 1 }} />
              </RadioGroup>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                1,234 votes
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

