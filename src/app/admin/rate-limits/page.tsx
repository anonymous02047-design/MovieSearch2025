'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Public as PublicIcon,
  Api as ApiIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';

interface RateLimitConfig {
  ipRateLimit: {
    windowMs: number;
    maxRequests: number;
    enabled: boolean;
  };
  countryRateLimit: {
    windowMs: number;
    maxRequests: number;
    enabled: boolean;
  };
  tmdbRateLimit: {
    delayMs: number;
    maxRequestsPerSecond: number;
    enabled: boolean;
  };
  globalRateLimit: {
    windowMs: number;
    maxRequests: number;
    enabled: boolean;
  };
}

export default function RateLimitConfigPage() {
  const { isDarkMode, toggleTheme } = useAdminTheme();
  const router = useRouter();
  
  const [config, setConfig] = useState<RateLimitConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }

      const data = await response.json();
      setConfig(data.config);
    } catch (err) {
      console.error('Error loading config:', err);
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      setSuccess('Rate limit configuration saved successfully');
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetConfig = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reset' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset configuration');
      }

      const data = await response.json();
      setConfig(data.config);
      setSuccess('Rate limit configuration reset to defaults');
    } catch (err) {
      console.error('Error resetting config:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof RateLimitConfig, field: string, value: any) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const formatTime = (ms: number) => {
    if (ms < 60000) return `${ms / 1000}s`;
    if (ms < 3600000) return `${ms / 60000}m`;
    return `${ms / 3600000}h`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!config) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load rate limit configuration
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }}>
      <AppBar position="static" sx={{ 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
          : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
      }}>
        <Toolbar>
          <Tooltip title="Back to Dashboard">
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => router.push('/admin/dashboard')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          
          <SettingsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rate Limit Configuration
          </Typography>
          
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<DashboardIcon />}
            onClick={() => router.push('/admin/dashboard')}
            sx={{ 
              borderColor: '#2196F3',
              color: '#2196F3',
              '&:hover': {
                borderColor: '#1976D2',
                backgroundColor: 'rgba(33, 150, 243, 0.04)',
              }
            }}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary' }}>
            Rate Limit Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure rate limiting settings for IP addresses, countries, TMDB API, and global limits
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* IP Rate Limit */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">IP Rate Limit</Typography>
                  <Chip 
                    label={config.ipRateLimit.enabled ? 'Enabled' : 'Disabled'} 
                    color={config.ipRateLimit.enabled ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.ipRateLimit.enabled}
                      onChange={(e) => updateConfig('ipRateLimit', 'enabled', e.target.checked)}
                    />
                  }
                  label="Enable IP rate limiting"
                />
                
                <TextField
                  fullWidth
                  label="Time Window"
                  type="number"
                  value={config.ipRateLimit.windowMs / 1000}
                  onChange={(e) => updateConfig('ipRateLimit', 'windowMs', parseInt(e.target.value) * 1000)}
                  helperText={`${formatTime(config.ipRateLimit.windowMs)} per window`}
                  disabled={!config.ipRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Max Requests"
                  type="number"
                  value={config.ipRateLimit.maxRequests}
                  onChange={(e) => updateConfig('ipRateLimit', 'maxRequests', parseInt(e.target.value))}
                  helperText="Maximum requests per IP per window"
                  disabled={!config.ipRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Country Rate Limit */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PublicIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Country Rate Limit</Typography>
                  <Chip 
                    label={config.countryRateLimit.enabled ? 'Enabled' : 'Disabled'} 
                    color={config.countryRateLimit.enabled ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.countryRateLimit.enabled}
                      onChange={(e) => updateConfig('countryRateLimit', 'enabled', e.target.checked)}
                    />
                  }
                  label="Enable country rate limiting"
                />
                
                <TextField
                  fullWidth
                  label="Time Window"
                  type="number"
                  value={config.countryRateLimit.windowMs / 60000}
                  onChange={(e) => updateConfig('countryRateLimit', 'windowMs', parseInt(e.target.value) * 60000)}
                  helperText={`${formatTime(config.countryRateLimit.windowMs)} per window`}
                  disabled={!config.countryRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Max Requests"
                  type="number"
                  value={config.countryRateLimit.maxRequests}
                  onChange={(e) => updateConfig('countryRateLimit', 'maxRequests', parseInt(e.target.value))}
                  helperText="Maximum requests per country per window"
                  disabled={!config.countryRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* TMDB Rate Limit */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ApiIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">TMDB API Rate Limit</Typography>
                  <Chip 
                    label={config.tmdbRateLimit.enabled ? 'Enabled' : 'Disabled'} 
                    color={config.tmdbRateLimit.enabled ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.tmdbRateLimit.enabled}
                      onChange={(e) => updateConfig('tmdbRateLimit', 'enabled', e.target.checked)}
                    />
                  }
                  label="Enable TMDB API rate limiting"
                />
                
                <TextField
                  fullWidth
                  label="Delay Between Requests"
                  type="number"
                  value={config.tmdbRateLimit.delayMs}
                  onChange={(e) => updateConfig('tmdbRateLimit', 'delayMs', parseInt(e.target.value))}
                  helperText="Milliseconds to wait between TMDB API requests"
                  disabled={!config.tmdbRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Max Requests Per Second"
                  type="number"
                  value={config.tmdbRateLimit.maxRequestsPerSecond}
                  onChange={(e) => updateConfig('tmdbRateLimit', 'maxRequestsPerSecond', parseInt(e.target.value))}
                  helperText="Maximum TMDB API requests per second"
                  disabled={!config.tmdbRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Global Rate Limit */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Global Rate Limit</Typography>
                  <Chip 
                    label={config.globalRateLimit.enabled ? 'Enabled' : 'Disabled'} 
                    color={config.globalRateLimit.enabled ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.globalRateLimit.enabled}
                      onChange={(e) => updateConfig('globalRateLimit', 'enabled', e.target.checked)}
                    />
                  }
                  label="Enable global rate limiting"
                />
                
                <TextField
                  fullWidth
                  label="Time Window"
                  type="number"
                  value={config.globalRateLimit.windowMs / 1000}
                  onChange={(e) => updateConfig('globalRateLimit', 'windowMs', parseInt(e.target.value) * 1000)}
                  helperText={`${formatTime(config.globalRateLimit.windowMs)} per window`}
                  disabled={!config.globalRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Max Requests"
                  type="number"
                  value={config.globalRateLimit.maxRequests}
                  onChange={(e) => updateConfig('globalRateLimit', 'maxRequests', parseInt(e.target.value))}
                  helperText="Maximum total requests per window"
                  disabled={!config.globalRateLimit.enabled}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveConfig}
            disabled={saving}
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={resetConfig}
            disabled={saving}
            sx={{ 
              borderColor: '#ff9800',
              color: '#ff9800',
              '&:hover': {
                borderColor: '#f57c00',
                backgroundColor: 'rgba(255, 152, 0, 0.04)',
              }
            }}
          >
            Reset to Defaults
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadConfig}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </Box>
  );
}
