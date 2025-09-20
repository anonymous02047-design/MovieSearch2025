'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Stack,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getFavorites, getWatchlist, getSearchHistory } from '@/lib/storage';

function ProfilePageContent() {
  const router = useRouter();
  
  // Graceful handling of Clerk hooks in case API keys are not configured
  let user, isLoaded;
  try {
    const clerkData = useUser();
    user = clerkData.user;
    isLoaded = clerkData.isLoaded;
  } catch (error) {
    // Fallback when Clerk is not configured
    user = null;
    isLoaded = true;
  }
  const [favorites, setFavorites] = useState<unknown[]>([]);
  const [watchlist, setWatchlist] = useState<unknown[]>([]);
  const [searchHistory, setSearchHistory] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      loadUserData();
    }
  }, [isLoaded, user]);

  const loadUserData = () => {
    try {
      const userFavorites = getFavorites();
      const userWatchlist = getWatchlist();
      const userSearchHistory = getSearchHistory();

      setFavorites(userFavorites);
      setWatchlist(userWatchlist);
      setSearchHistory(userSearchHistory);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Please sign in to view your profile.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon fontSize="large" color="primary" />
              My Profile
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {user.fullName || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.primaryEmailAddress?.emailAddress}
                  </Typography>
                  <Chip 
                    label="Member since" 
                    variant="outlined" 
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Stats
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Favorite Movies" 
                        secondary={favorites.length}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <BookmarkIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Watchlist" 
                        secondary={watchlist.length}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <HistoryIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Search History" 
                        secondary={searchHistory.length}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Summary */}
            <Grid item xs={12} md={8}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your movie discovery journey and preferences.
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <StarIcon color="primary" />
                        <Typography variant="h6">
                          Favorite Movies
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {favorites.length} movies you&apos;ve marked as favorites
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push('/favorites')}
                      >
                        View All
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <BookmarkIcon color="primary" />
                        <Typography variant="h6">
                          Watchlist
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {watchlist.length} movies in your watchlist
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push('/watchlist')}
                      >
                        View All
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <HistoryIcon color="primary" />
                        <Typography variant="h6">
                          Search History
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {searchHistory.length} recent searches
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push('/history')}
                      >
                        View All
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <SettingsIcon color="primary" />
                        <Typography variant="h6">
                          Account Settings
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Manage your account preferences
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push('/profile/manage')}
                        sx={{ mr: 1 }}
                      >
                        Manage Profile
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => router.push('/profile/manage')}
                      >
                        Account Settings
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
