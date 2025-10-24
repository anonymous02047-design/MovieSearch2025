'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Mood as MoodIcon,
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  Favorite,
  LocalFireDepartment,
  Spa,
  Bolt,
} from '@mui/icons-material';

export default function MoodSearchPage() {
  const { user } = useUser();
  const [selectedMood, setSelectedMood] = useState('');

  const moods = [
    { name: 'Happy', icon: <SentimentSatisfied />, color: '#ffeb3b', description: 'Feel-good movies' },
    { name: 'Sad', icon: <SentimentVeryDissatisfied />, color: '#2196f3', description: 'Emotional dramas' },
    { name: 'Romantic', icon: <Favorite />, color: '#e91e63', description: 'Love stories' },
    { name: 'Exciting', icon: <LocalFireDepartment />, color: '#ff5722', description: 'Action & thrillers' },
    { name: 'Chill', icon: <Spa />, color: '#4caf50', description: 'Relaxing films' },
    { name: 'Energetic', icon: <Bolt />, color: '#ff9800', description: 'High-energy movies' },
  ];

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <MoodIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Mood-Based Search
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Find the perfect movie for how you're feeling right now
          </Typography>

          <Card sx={{ mb: 4, p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              How are you feeling today?
            </Typography>
            <Typography variant="body1">
              Select your mood and we'll recommend movies that match your vibe
            </Typography>
          </Card>

          <Grid container spacing={3}>
            {moods.map((mood) => (
              <Grid key={mood.name} size={{ xs: 6, sm: 4, md: 2 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                    bgcolor: selectedMood === mood.name ? mood.color : 'background.paper',
                    color: selectedMood === mood.name ? 'white' : 'text.primary',
                  }}
                  onClick={() => setSelectedMood(mood.name)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ fontSize: 48, mb: 1 }}>
                      {mood.icon}
                    </Box>
                    <Typography variant="h6">{mood.name}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {mood.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedMood && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button variant="contained" size="large">
                Find {selectedMood} Movies
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </AuthGuard>
  );
}

