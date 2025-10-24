'use client';

import React, { useState } from 'react';

export const dynamic = 'force-dynamic';

import AuthGuard from '@/components/AuthGuard';
import { Container, Typography, Box, Card, CardContent, TextField, Button, Chip } from '@mui/material';
import { Book as BookIcon } from '@mui/icons-material';

export default function MovieDiaryPage() {
  const [entries, setEntries] = useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('movieDiary');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <BookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Movie Diary</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">Track your daily movie watching journey</Typography>
        </Container>
      </Box>
    </AuthGuard>
  );
}

