'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Chip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import SEO from '@/components/SEO';
import { getLanguage, setLanguage, Language, getAvailableLanguages } from '@/lib/i18n';

export default function SettingsPage() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [language, setLang] = useState<Language>(getLanguage());
  const [region, setRegion] = useState('US');

  const languages = getAvailableLanguages();

  const handleSave = () => {
    setLanguage(language);
    // Save other settings to localStorage
    localStorage.setItem('user_settings', JSON.stringify({
      notifications,
      emailNotifications,
      autoplay,
      region
    }));
    alert('Settings saved successfully!');
  };

  return (
    <>
      <SEO
        title="Settings - MovieSearch 2025"
        description="Manage your account settings and preferences"
        keywords={['settings', 'preferences', 'account']}
      />

      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <SettingsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                Settings
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary">
              Customize your experience
            </Typography>
          </Box>

          {/* Notifications Settings */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <NotificationsIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Notifications
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="Enable notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Get notified about new releases and recommendations
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  disabled={!notifications}
                />
              }
              label="Email notifications"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive notifications via email
            </Typography>
          </Paper>

          {/* Language & Region */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <LanguageIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Language & Region
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {languages.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Content Region</InputLabel>
              <Select
                value={region}
                label="Content Region"
                onChange={(e) => setRegion(e.target.value)}
              >
                <MenuItem value="US">🇺🇸 United States</MenuItem>
                <MenuItem value="GB">🇬🇧 United Kingdom</MenuItem>
                <MenuItem value="CA">🇨🇦 Canada</MenuItem>
                <MenuItem value="AU">🇦🇺 Australia</MenuItem>
                <MenuItem value="IN">🇮🇳 India</MenuItem>
                <MenuItem value="DE">🇩🇪 Germany</MenuItem>
                <MenuItem value="FR">🇫🇷 France</MenuItem>
                <MenuItem value="ES">🇪🇸 Spain</MenuItem>
                <MenuItem value="IT">🇮🇹 Italy</MenuItem>
                <MenuItem value="BR">🇧🇷 Brazil</MenuItem>
                <MenuItem value="MX">🇲🇽 Mexico</MenuItem>
                <MenuItem value="JP">🇯🇵 Japan</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* Playback Settings */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PaletteIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Playback
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                />
              }
              label="Autoplay trailers"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Automatically play trailers when opening details
            </Typography>
          </Paper>

          {/* Privacy & Security */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <SecurityIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Privacy & Security
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Data Storage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your watchlist, favorites, and viewing history are stored locally on your device.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (confirm('Are you sure you want to clear all local data?')) {
                  localStorage.clear();
                  alert('All local data cleared!');
                }
              }}
            >
              Clear All Data
            </Button>
          </Paper>

          {/* Save Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ px: 4 }}
            >
              Save Settings
            </Button>
          </Box>

          {/* Info */}
          <Paper
            elevation={2}
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              💡 <strong>Tip:</strong> Changes to language and region will take effect immediately. 
              Some settings require a page refresh to apply.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
