'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Lock as LockIcon,
  Star as StarIcon,
  LocalMovies as MovieIcon,
  Favorite as FavoriteIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'watching' | 'rating' | 'collecting' | 'special';
  earned: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: string;
}

export default function AchievementBadgesPage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Watch your first movie',
      icon: <MovieIcon />,
      category: 'watching',
      earned: true,
      progress: 1,
      maxProgress: 1,
      rarity: 'common',
      earnedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Movie Marathon',
      description: 'Watch 10 movies in a month',
      icon: <ViewIcon />,
      category: 'watching',
      earned: true,
      progress: 10,
      maxProgress: 10,
      rarity: 'rare',
      earnedDate: '2024-02-20',
    },
    {
      id: '3',
      name: 'Critic',
      description: 'Rate 50 movies',
      icon: <StarIcon />,
      category: 'rating',
      earned: false,
      progress: 32,
      maxProgress: 50,
      rarity: 'rare',
    },
    {
      id: '4',
      name: 'Collector',
      description: 'Add 100 movies to your watchlist',
      icon: <FavoriteIcon />,
      category: 'collecting',
      earned: false,
      progress: 67,
      maxProgress: 100,
      rarity: 'epic',
    },
    {
      id: '5',
      name: 'Century Club',
      description: 'Watch 100 movies',
      icon: <TrophyIcon />,
      category: 'watching',
      earned: false,
      progress: 78,
      maxProgress: 100,
      rarity: 'epic',
    },
    {
      id: '6',
      name: 'Binge Master',
      description: 'Watch 5 movies in one day',
      icon: <CalendarIcon />,
      category: 'special',
      earned: false,
      progress: 0,
      maxProgress: 5,
      rarity: 'legendary',
    },
    {
      id: '7',
      name: 'Five Star Fan',
      description: 'Give 5 stars to 20 movies',
      icon: <GradeIcon />,
      category: 'rating',
      earned: true,
      progress: 20,
      maxProgress: 20,
      rarity: 'rare',
      earnedDate: '2024-03-10',
    },
    {
      id: '8',
      name: 'Time Traveler',
      description: 'Watch movies from 5 different decades',
      icon: <MovieIcon />,
      category: 'special',
      earned: false,
      progress: 3,
      maxProgress: 5,
      rarity: 'epic',
    },
  ]);

  const categories = [
    { value: 'all', label: 'All Badges' },
    { value: 'watching', label: 'Watching' },
    { value: 'rating', label: 'Rating' },
    { value: 'collecting', label: 'Collecting' },
    { value: 'special', label: 'Special' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedCount = badges.filter(b => b.earned).length;
  const totalPoints = badges.filter(b => b.earned).reduce((sum, badge) => {
    const points = {
      common: 10,
      rare: 25,
      epic: 50,
      legendary: 100,
    };
    return sum + points[badge.rarity];
  }, 0);

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ mt: 12, mb: 8, flex: 1 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'warning.main', width: 72, height: 72, mx: 'auto', mb: 2 }}>
              <TrophyIcon fontSize="large" />
            </Avatar>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Achievement Badges
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track your movie-watching milestones
            </Typography>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" fontWeight={700}>
                  {earnedCount}/{badges.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Badges Earned
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(earnedCount / badges.length) * 100}
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight={700}>
                  {totalPoints}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Points
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight={700}>
                  {Math.round((earnedCount / badges.length) * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Category Tabs */}
          <Paper elevation={2} sx={{ mb: 4 }}>
            <Tabs
              value={selectedCategory}
              onChange={(_, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {categories.map((category) => (
                <Tab
                  key={category.value}
                  label={category.label}
                  value={category.value}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Badges Grid */}
          <Grid container spacing={3}>
            {filteredBadges.map((badge) => (
              <Grid item xs={12} sm={6} md={4} key={badge.id}>
                <Card
                  elevation={badge.earned ? 4 : 2}
                  sx={{
                    height: '100%',
                    opacity: badge.earned ? 1 : 0.6,
                    transition: 'all 0.3s',
                    border: `2px solid ${badge.earned ? getRarityColor(badge.rarity) : 'transparent'}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: badge.earned ? getRarityColor(badge.rarity) : 'grey.400',
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          position: 'relative',
                        }}
                      >
                        {badge.earned ? badge.icon : <LockIcon fontSize="large" />}
                      </Avatar>
                      <Chip
                        label={badge.rarity.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: getRarityColor(badge.rarity),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" fontWeight={600} gutterBottom textAlign="center">
                      {badge.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                      {badge.description}
                    </Typography>

                    {!badge.earned && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              {badge.progress}/{badge.maxProgress}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(badge.progress / badge.maxProgress) * 100}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </>
                    )}

                    {badge.earned && badge.earnedDate && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                          Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Rarity Legend */}
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Rarity Levels
            </Typography>
            <Grid container spacing={2}>
              {[
                { rarity: 'common', points: 10 },
                { rarity: 'rare', points: 25 },
                { rarity: 'epic', points: 50 },
                { rarity: 'legendary', points: 100 },
              ].map((item) => (
                <Grid item xs={6} sm={3} key={item.rarity}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: getRarityColor(item.rarity),
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                        {item.rarity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.points} points
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </AuthGuard>
  );
}

