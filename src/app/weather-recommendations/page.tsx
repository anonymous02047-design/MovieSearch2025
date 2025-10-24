'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { WbSunny as SunIcon, Cloud as CloudIcon, AcUnit as SnowIcon } from '@mui/icons-material';

export default function WeatherRecommendationsPage() {
  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <SunIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Weather Recommendations</Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Movies perfect for your current weather
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Current Weather: Sunny ☀️</Typography>
              <Typography variant="body2" color="text.secondary">
                Perfect day for summer-themed movies or outdoor adventures!
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AuthGuard>
  );
}

