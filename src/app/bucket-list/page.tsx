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
  CardMedia,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  List as ListIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function BucketListPage() {
  const { user } = useUser();
  const [bucketList, setBucketList] = useState<any[]>([]);

  const stats = {
    total: 50,
    watched: 12,
    percentage: 24,
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <ListIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Movie Bucket List
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Must-watch movies before you die
          </Typography>

          {/* Progress Card */}
          <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Your Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">{stats.watched} watched</Typography>
                    <Typography variant="body2">{stats.total} total</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                      {stats.percentage}%
                    </Typography>
                    <Typography variant="body1">Complete</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Bar */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Movie
            </Button>
            <Chip label="All Movies" color="primary" />
            <Chip label="Watched" variant="outlined" />
            <Chip label="Unwatched" variant="outlined" />
          </Box>

          {bucketList.length === 0 && (
            <Alert severity="info">
              Start building your bucket list of must-watch movies!
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Sample card */}
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia component="div" sx={{ height: 400, bgcolor: 'grey.300' }} />
                  <Chip
                    label="Unwatched"
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6">Add your first movie</Typography>
                  <Button size="small" sx={{ mt: 1 }} startIcon={<CheckIcon />}>
                    Mark as Watched
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AuthGuard>
  );
}

