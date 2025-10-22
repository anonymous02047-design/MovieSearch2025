'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Stack,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  summary: string;
  keywords: string[];
}

interface AISentimentAnalysisProps {
  initialReview?: string;
  onAnalysisComplete?: (result: SentimentResult) => void;
}

export default function AISentimentAnalysis({
  initialReview = '',
  onAnalysisComplete,
}: AISentimentAnalysisProps) {
  const [review, setReview] = useState(initialReview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleAnalyze = async () => {
    if (!review.trim()) {
      setError('Please enter a review to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: review.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to analyze review');
      }

      const analysis = data.analysis as SentimentResult;
      setResult(analysis);
      onAnalysisComplete?.(analysis);
    } catch (err: any) {
      console.error('Sentiment Analysis Error:', err);
      setError(err.message || 'Failed to analyze sentiment');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = () => {
    if (!result) return null;

    switch (result.sentiment) {
      case 'positive':
        return <SentimentSatisfiedAltIcon sx={{ fontSize: 48, color: 'success.main' }} />;
      case 'negative':
        return <SentimentDissatisfiedIcon sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'neutral':
        return <SentimentNeutralIcon sx={{ fontSize: 48, color: 'info.main' }} />;
    }
  };

  const getSentimentColor = (): 'success' | 'error' | 'info' => {
    if (!result) return 'info';

    switch (result.sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      case 'neutral':
        return 'info';
    }
  };

  return (
    <Box>
      <Stack spacing={3}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Movie Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Enter a movie review to analyze its sentiment..."
          disabled={loading}
        />

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={loading || !review.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment with AI'}
        </Button>

        {result && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
              {/* Sentiment Icon and Type */}
              <Box sx={{ textAlign: 'center' }}>
                {getSentimentIcon()}
                <Typography variant="h5" sx={{ mt: 1, textTransform: 'capitalize' }}>
                  {result.sentiment} Sentiment
                </Typography>
              </Box>

              {/* Confidence Score */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Confidence Score
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {(result.score * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={result.score * 100}
                  color={getSentimentColor()}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Summary */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  AI Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {result.summary}
                </Typography>
              </Box>

              {/* Keywords */}
              {result.keywords && result.keywords.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Themes
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {result.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        color={getSentimentColor()}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}

