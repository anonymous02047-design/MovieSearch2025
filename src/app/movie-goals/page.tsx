'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, TextField, Button, LinearProgress, Grid } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

export default function MovieGoalsPage() {
  const { user } = useUser();
  const [goal, setGoal] = useState(100);
  const [watched, setWatched] = useState(0);

  React.useEffect(() => {
    const saved = localStorage.getItem('movieGoal');
    if (saved) {
      const data = JSON.parse(saved);
      setGoal(data.goal || 100);
      setWatched(data.watched || 0);
    }
  }, []);

  const updateGoal = () => {
    localStorage.setItem('movieGoal', JSON.stringify({ goal, watched }));
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Goals</Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Annual Goal: Watch {goal} Movies</Typography>
              <LinearProgress variant="determinate" value={(watched / goal) * 100} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 3 }}>{watched} / {goal} movies ({Math.round((watched / goal) * 100)}%)</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="number" label="Goal" value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth type="number" label="Watched" value={watched} onChange={(e) => setWatched(Number(e.target.value))} />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={updateGoal} sx={{ mt: 2 }}>Save Progress</Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

