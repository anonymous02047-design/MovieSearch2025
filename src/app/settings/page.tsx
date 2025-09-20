'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showWatchlist: boolean;
    showFavorites: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    itemsPerPage: number;
    autoPlayTrailers: boolean;
  };
  content: {
    adultContent: boolean;
    explicitContent: boolean;
    contentFilter: 'strict' | 'moderate' | 'lenient';
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'public',
    showWatchlist: true,
    showFavorites: true,
  },
  display: {
    theme: 'auto',
    language: 'en',
    itemsPerPage: 20,
    autoPlayTrailers: false,
  },
  content: {
    adultContent: false,
    explicitContent: false,
    contentFilter: 'moderate',
  },
};

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isLoaded && user) {
      // Load user settings from localStorage or user metadata
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }
    }
  }, [isLoaded, user]);

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setSaveStatus('idle');

    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // In a real app, you would save to your backend
      // await saveUserSettings(settings);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('userSettings');
  };

  if (!isLoaded) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please sign in to access your settings.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your MovieSearch experience
        </Typography>
      </Box>

      {saveStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {saveStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save settings. Please try again.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Notifications
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                }
                label="Email notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                }
                label="Push notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.marketing}
                    onChange={(e) => handleSettingChange('notifications', 'marketing', e.target.checked)}
                  />
                }
                label="Marketing emails"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Privacy
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={settings.privacy.profileVisibility}
                  label="Profile Visibility"
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="friends">Friends Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.showWatchlist}
                    onChange={(e) => handleSettingChange('privacy', 'showWatchlist', e.target.checked)}
                  />
                }
                label="Show watchlist publicly"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privacy.showFavorites}
                    onChange={(e) => handleSettingChange('privacy', 'showFavorites', e.target.checked)}
                  />
                }
                label="Show favorites publicly"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PaletteIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Display
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.display.theme}
                  label="Theme"
                  onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.display.language}
                  label="Language"
                  onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="it">Italian</MenuItem>
                  <MenuItem value="pt">Portuguese</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>
                  Items per page: {settings.display.itemsPerPage}
                </Typography>
                <Slider
                  value={settings.display.itemsPerPage}
                  onChange={(_, value) => handleSettingChange('display', 'itemsPerPage', value)}
                  min={10}
                  max={50}
                  step={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.display.autoPlayTrailers}
                    onChange={(e) => handleSettingChange('display', 'autoPlayTrailers', e.target.checked)}
                  />
                }
                label="Auto-play trailers"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Content Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Content
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Content Filter</InputLabel>
                <Select
                  value={settings.content.contentFilter}
                  label="Content Filter"
                  onChange={(e) => handleSettingChange('content', 'contentFilter', e.target.value)}
                >
                  <MenuItem value="strict">Strict</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="lenient">Lenient</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.content.adultContent}
                    onChange={(e) => handleSettingChange('content', 'adultContent', e.target.checked)}
                  />
                }
                label="Show adult content"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.content.explicitContent}
                    onChange={(e) => handleSettingChange('content', 'explicitContent', e.target.checked)}
                  />
                }
                label="Show explicit content"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={handleResetSettings}
          disabled={loading}
        >
          Reset to Default
        </Button>
      </Box>
    </Container>
  );
}
