'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardMedia, CardContent, Rating, Button, Alert } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

export default function QuickRatePage() {
  const { user } = useUser();
  const [ratings, setRatings] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('quickRatings');
    if (saved) setRatings(JSON.parse(saved));
  }, []);

  const handleRate = (value: number) => {
    const newRatings = [...ratings, { rating: value, timestamp: new Date() }];
    setRatings(newRatings);
    localStorage.setItem('quickRatings', JSON.stringify(newRatings));
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <StarIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Quick Rate</Typography>
          </Box>
          <Alert severity="info" sx={{ mb: 3 }}>Rate movies instantly! All data stored locally.</Alert>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>How would you rate this experience?</Typography>
              <Rating size="large" onChange={(e, value) => value && handleRate(value)} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Total ratings: {ratings.length}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

