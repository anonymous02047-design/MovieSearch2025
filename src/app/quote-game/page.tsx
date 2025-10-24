'use client';

import React, { useState } from 'react';

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
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  FormatQuote as QuoteIcon,
  EmojiEvents as TrophyIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

export default function QuoteGamePage() {
  const { user } = useUser();
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <QuoteIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Movie Quote Game
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Guess the movie from famous quotes
          </Typography>

          {!gameActive ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <TrophyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Ready to Test Your Movie Knowledge?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  We'll show you famous movie quotes. Your job is to guess which movie they're from!
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="h4" color="primary.main">10</Typography>
                    <Typography variant="body2">Questions</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="h4" color="success.main">3</Typography>
                    <Typography variant="body2">Difficulty Levels</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="h4" color="warning.main">60</Typography>
                    <Typography variant="body2">Seconds Each</Typography>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayIcon />}
                  onClick={() => setGameActive(true)}
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Question 1/10</Typography>
                    <Chip label={`Score: ${score}`} color="primary" />
                  </Box>
                  <LinearProgress variant="determinate" value={10} />
                </Box>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 3, mb: 3 }}>
                  <Typography variant="h5" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                    "Here's looking at you, kid."
                  </Typography>
                </Card>
                <Grid container spacing={2}>
                  {['Casablanca', 'The Godfather', 'Gone with the Wind', 'Citizen Kane'].map((movie) => (
                    <Grid key={movie} size={{ xs: 12, sm: 6 }}>
                      <Button variant="outlined" fullWidth>
                        {movie}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </AuthGuard>
  );
}

