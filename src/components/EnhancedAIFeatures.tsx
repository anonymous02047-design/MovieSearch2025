'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
} from '@mui/material';
import {
  Psychology as AIIcon,
  ExpandMore as ExpandIcon,
  TrendingUp as TrendingIcon,
  SentimentSatisfied as SentimentIcon,
  Quiz as QuizIcon,
  Description as SummaryIcon,
  Compare as CompareIcon,
  Schedule as TimeIcon,
  Diamond as GemIcon,
  Person as DirectorIcon,
  FormatQuote as QuoteIcon,
  Movie as MovieIcon,
  Group as GroupIcon,
  Hub as UniverseIcon,
  BarChart as UsageIcon,
} from '@mui/icons-material';
import axios from 'axios';

export default function EnhancedAIFeatures() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitStatus, setRateLimitStatus] = useState<any>(null);

  const handleFeatureCall = async (feature: string, params: any) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/ai-enhanced/all-features', {
        feature,
        ...params,
      });

      setResult(response.data);
      setRateLimitStatus(response.data.rateLimitStatus);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please wait before making more requests.');
      } else {
        setError(err.response?.data?.error || 'Failed to process request');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      icon: <TrendingIcon />,
      description: 'Get personalized movie recommendations based on your preferences',
      color: '#1976d2',
    },
    {
      id: 'sentiment',
      title: 'Sentiment Analysis',
      icon: <SentimentIcon />,
      description: 'Analyze the sentiment of movie reviews',
      color: '#2e7d32',
    },
    {
      id: 'trivia',
      title: 'Movie Trivia',
      icon: <QuizIcon />,
      description: 'Generate trivia questions about any movie',
      color: '#ed6c02',
    },
    {
      id: 'summary',
      title: 'Plot Summary',
      icon: <SummaryIcon />,
      description: 'Generate concise plot summaries',
      color: '#9c27b0',
    },
    {
      id: 'chemistry',
      title: 'Cast Chemistry',
      icon: <AIIcon />,
      description: 'Analyze the chemistry between actors',
      color: '#d32f2f',
    },
    {
      id: 'compare',
      title: 'Movie Battle',
      icon: <CompareIcon />,
      description: 'Compare two movies head-to-head',
      color: '#0288d1',
    },
    {
      id: 'genreMood',
      title: 'Genre Mood Matcher',
      icon: <SentimentIcon />,
      description: 'Match genres to your current mood',
      color: '#f57c00',
    },
    {
      id: 'timeMatch',
      title: 'Time-Based Suggester',
      icon: <TimeIcon />,
      description: 'Find movies that fit your available time',
      color: '#7b1fa2',
    },
    {
      id: 'hiddenGems',
      title: 'Hidden Gem Finder',
      icon: <GemIcon />,
      description: 'Discover underrated masterpieces',
      color: '#c2185b',
    },
    {
      id: 'directorStyle',
      title: 'Director Style Analysis',
      icon: <DirectorIcon />,
      description: 'Analyze a director\'s signature style',
      color: '#00838f',
    },
    {
      id: 'quote',
      title: 'Movie Quote Generator',
      icon: <QuoteIcon />,
      description: 'Get famous quotes from movies',
      color: '#5e35b1',
    },
    {
      id: 'sequel',
      title: 'Sequel Predictor',
      icon: <MovieIcon />,
      description: 'Predict if a movie will get a sequel',
      color: '#3949ab',
    },
    {
      id: 'movieNight',
      title: 'Movie Night Planner',
      icon: <GroupIcon />,
      description: 'Plan the perfect movie night',
      color: '#1565c0',
    },
    {
      id: 'universe',
      title: 'Universe Builder',
      icon: <UniverseIcon />,
      description: 'Connect movies in a cinematic universe',
      color: '#283593',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <AIIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
          Enhanced AI Features
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          14 Advanced AI-Powered Features with Token Optimization & Rate Limiting
        </Typography>

        {/* Rate Limit Status */}
        {rateLimitStatus && (
          <Card sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <UsageIcon color="primary" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">API Usage Status</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(rateLimitStatus.tokensRemaining / 50000) * 100}
                    sx={{ my: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {rateLimitStatus.requestsRemaining} requests, {rateLimitStatus.tokensRemaining} tokens remaining
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card sx={{ mb: 4, bgcolor: 'success.main', color: 'white' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✨ Result
            </Typography>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
            {result.usage && (
              <Box sx={{ mt: 2, opacity: 0.8 }}>
                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="caption">
                  Tokens: {result.usage.totalTokens} | Cost: ${result.usage.estimatedCost.toFixed(6)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: feature.color,
                      color: 'white',
                      p: 1,
                      borderRadius: 2,
                      mr: 2,
                      display: 'flex',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6">{feature.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    // Demo call - customize per feature
                    const demoParams = getDemoParams(feature.id);
                    handleFeatureCall(feature.id, demoParams);
                  }}
                  disabled={loading}
                  sx={{ bgcolor: feature.color }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Try It'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          All features are optimized for minimal token usage and include automatic caching
        </Typography>
      </Box>
    </Container>
  );
}

// Demo parameters for each feature
function getDemoParams(featureId: string): any {
  const demos: Record<string, any> = {
    recommendations: { genres: ['Action', 'Sci-Fi'], mood: 'excited', count: 5 },
    sentiment: { text: 'This movie was absolutely amazing! Best film I have seen this year.' },
    trivia: { movieTitle: 'The Matrix', difficulty: 'medium' },
    summary: { title: 'Inception', plot: 'A thief who steals corporate secrets...', length: 'short' },
    chemistry: { actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'], movieTitle: 'Inception' },
    compare: { movie1: 'The Matrix', movie2: 'Inception' },
    genreMood: { mood: 'relaxed' },
    timeMatch: { availableMinutes: 120, preferences: 'action, sci-fi' },
    hiddenGems: { genre: 'thriller', minYear: 2010 },
    directorStyle: { directorName: 'Christopher Nolan' },
    quote: { movieTitle: 'The Godfather' },
    sequel: { movieTitle: 'Avatar' },
    movieNight: { groupSize: 4, preferences: ['comedy', 'action'], duration: 180 },
    universe: { movies: ['Iron Man', 'Thor', 'Captain America'] },
  };

  return demos[featureId] || {};
}

