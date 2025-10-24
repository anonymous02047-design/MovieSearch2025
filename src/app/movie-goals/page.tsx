'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, TextField, Button, LinearProgress, Grid, Alert, CircularProgress } from '@mui/material';
import { EmojiEvents as TrophyIcon, Add as AddIcon } from '@mui/icons-material';
import { movieGoalAPI } from '@/lib/api-client';

export default function MovieGoalsPage() {
  const { user } = useUser();
  const [goals, setGoals] = useState<any[]>([]);
  const [currentYear] = useState(new Date().getFullYear());
  const [currentGoal, setCurrentGoal] = useState<any>(null);
  const [goalCount, setGoalCount] = useState(100);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await movieGoalAPI.getAll();
      const allGoals = response.goals || [];
      setGoals(allGoals);
      
      const thisYearGoal = allGoals.find((g: any) => g.year === currentYear);
      if (thisYearGoal) {
        setCurrentGoal(thisYearGoal);
        setGoalCount(thisYearGoal.goalCount);
      }
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGoal = async () => {
    setSaving(true);
    try {
      await movieGoalAPI.createOrUpdate({
        year: currentYear,
        goalCount,
        watchedCount: currentGoal?.watchedCount || 0,
      });
      await loadGoals();
      alert('Goal saved successfully!');
    } catch (error) {
      console.error('Failed to save goal:', error);
      alert('Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const incrementProgress = async () => {
    try {
      await movieGoalAPI.updateProgress(currentYear, 1);
      await loadGoals();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const watched = currentGoal?.watchedCount || 0;
  const goal = currentGoal?.goalCount || goalCount;
  const progress = goal > 0 ? (watched / goal) * 100 : 0;

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TrophyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Goals</Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Track your annual movie watching goals! Data synced to MongoDB.
              </Alert>

              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {currentYear} Goal: Watch {goal} Movies
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ height: 10, borderRadius: 5, mb: 2 }} 
                  />
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {watched} / {goal} movies ({Math.round(progress)}%)
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth 
                        type="number" 
                        label="Annual Goal" 
                        value={goalCount} 
                        onChange={(e) => setGoalCount(Number(e.target.value))} 
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        fullWidth 
                        type="number" 
                        label="Watched This Year" 
                        value={watched} 
                        disabled
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button 
                      variant="contained" 
                      onClick={saveGoal} 
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Goal'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={incrementProgress}
                      startIcon={<AddIcon />}
                    >
                      +1 Movie Watched
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {goals.filter(g => g.year !== currentYear).length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Previous Years</Typography>
                    {goals
                      .filter(g => g.year !== currentYear)
                      .map((g: any) => (
                        <Box key={g._id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1">{g.year}</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={(g.watchedCount / g.goalCount) * 100} 
                            sx={{ height: 8, borderRadius: 4, mb: 1 }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {g.watchedCount} / {g.goalCount} movies
                          </Typography>
                        </Box>
                      ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Container>
      </Box>
    </AuthGuard>
  );
}

