'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Movie as MovieIcon,
  CalendarToday as CalendarIcon,
  ViewTimeline as TimelineIcon,
} from '@mui/icons-material';

interface TimelineEntry {
  id: string;
  movieTitle: string;
  moviePoster: string;
  watchedDate: Date;
  rating: number;
  genre: string;
}

export default function ViewingTimelinePage() {
  const { user } = useUser();
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'year' | 'month'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      // Simulate loading
      setLoading(false);
      // TODO: Implement actual API call
    } catch (error) {
      console.error('Error loading timeline:', error);
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <AuthGuard>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                My Viewing Timeline
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Your cinematic journey through time
            </Typography>

            {/* View Mode Toggle */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newValue) => newValue && setViewMode(newValue)}
                size="small"
              >
                <ToggleButton value="all">All Time</ToggleButton>
                <ToggleButton value="year">This Year</ToggleButton>
                <ToggleButton value="month">This Month</ToggleButton>
              </ToggleButtonGroup>
              <Button variant="outlined" startIcon={<CalendarIcon />}>
                Export Timeline
              </Button>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Card sx={{ flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {timelineData.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Movies Watched
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Month
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                  0h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Watch Time
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Empty State */}
          {timelineData.length === 0 && !loading && (
            <Alert severity="info" sx={{ mb: 4 }}>
              Your viewing timeline is empty. Start watching and rating movies to build your timeline!
            </Alert>
          )}

          {/* Timeline */}
          <Timeline position="alternate">
            {timelineData.map((entry, index) => (
              <TimelineItem key={entry.id}>
                <TimelineOppositeContent color="text.secondary">
                  {formatDate(entry.watchedDate)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <MovieIcon />
                  </TimelineDot>
                  {index < timelineData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar
                          src={`https://image.tmdb.org/t/p/w200${entry.moviePoster}`}
                          variant="rounded"
                          sx={{ width: 60, height: 90 }}
                        />
                        <Box>
                          <Typography variant="h6">{entry.movieTitle}</Typography>
                          <Chip label={entry.genre} size="small" sx={{ mt: 1 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Rating: {entry.rating}/10
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>

          {timelineData.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <MovieIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Your viewing journey starts here
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </AuthGuard>
  );
}

