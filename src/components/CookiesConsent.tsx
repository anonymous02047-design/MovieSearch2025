'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Cookie as CookieIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  BarChart as AnalyticsIcon,
  Campaign as MarketingIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookiesConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    setMounted(true);
    // Check if user has already made a choice
    if (typeof window !== 'undefined') {
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (!cookieConsent) {
        // Show banner after a short delay to ensure proper rendering
        setTimeout(() => {
          setShowBanner(true);
        }, 2000); // Increased delay to ensure proper rendering
      } else {
        try {
          const savedPreferences = JSON.parse(cookieConsent);
          setPreferences(savedPreferences);
        } catch (error) {
          console.error('Error parsing cookie preferences:', error);
          // If parsing fails, show banner again
          setTimeout(() => {
            setShowBanner(true);
          }, 2000);
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    }
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    }
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      icon: <SecurityIcon />,
      required: true,
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: <AnalyticsIcon />,
      required: false,
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track campaign performance.',
      icon: <MarketingIcon />,
      required: false,
    },
    {
      key: 'preferences' as keyof CookiePreferences,
      title: 'Preference Cookies',
      description: 'Remember your settings and preferences for a personalized experience.',
      icon: <SettingsIcon />,
      required: false,
    },
  ];

  // Only show banner if mounted and showBanner is true
  if (!mounted || !showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 9999,
          p: 3,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          maxWidth: 600,
          mx: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            backgroundColor: 'primary.main',
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CookieIcon sx={{ color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              🍪 We use cookies to enhance your experience
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              We use cookies to improve your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can customize your preferences in settings.
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={handleAcceptAll}
            startIcon={<CheckIcon />}
            sx={{
              backgroundColor: 'success.main',
              '&:hover': { backgroundColor: 'success.dark' },
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Accept All
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleRejectAll}
            startIcon={<CancelIcon />}
            sx={{
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': { 
                borderColor: 'error.dark',
                backgroundColor: 'error.main',
                color: 'white'
              },
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Reject All
          </Button>
          
          <Button
            variant="text"
            onClick={() => setShowSettings(true)}
            startIcon={<SettingsIcon />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Customize
          </Button>
        </Stack>
      </Paper>

      {/* Cookie Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 1 
        }}>
          <SettingsIcon color="primary" />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            Cookie Preferences
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Manage your cookie preferences. You can enable or disable different types of cookies below.
          </Typography>
          
          <List>
            {cookieTypes.map((cookie, index) => (
              <React.Fragment key={cookie.key}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    {cookie.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {cookie.title}
                        </Typography>
                        {cookie.required && (
                          <Chip label="Required" color="error" size="small" />
                        )}
                      </Box>
                    }
                    secondary={cookie.description}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences[cookie.key]}
                        onChange={handlePreferenceChange(cookie.key)}
                        disabled={cookie.required}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
                {index < cookieTypes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website. 
              Necessary cookies cannot be disabled as they are essential for the website to work properly.
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setShowSettings(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSavePreferences}
            sx={{ 
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3
            }}
          >
            Save Preferences
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}