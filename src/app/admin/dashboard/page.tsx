'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Tooltip,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Block as BlockIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  Speed as SpeedIcon,
  Logout as LogoutIcon,
  Analytics as AnalyticsIcon,
  Flag as FlagIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
  CheckCircle as UnblockIcon,
} from '@mui/icons-material';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { countries } from '@/data/countries';

interface RateLimitStats {
  ipRateLimits: { [key: string]: { count: number; firstRequestTime: number } };
  countryRateLimits: { [key: string]: { count: number; firstRequestTime: number } };
  activeIPs: number;
  activeCountries: number;
  blockedIPs: number;
  blockedCountries: number;
}

interface AdminSession {
  token: string;
  username: string;
  expiresAt: number;
}

interface AnalyticsSummary {
  totalSessions: number;
  activeSessions: number;
  topCountries: Array<{ country: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
  topOperatingSystems: Array<{ os: string; count: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
  mostVisitedPages: Array<{ page: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

export default function AdminDashboard() {
  const { isDarkMode, toggleTheme } = useAdminTheme();
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [stats, setStats] = useState<RateLimitStats | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Dialog states
  const [blockIPDialog, setBlockIPDialog] = useState(false);
  const [blockCountryDialog, setBlockCountryDialog] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string; flag: string } | null>(null);
  const [blockReason, setBlockReason] = useState('Policy violation');
  
  const router = useRouter();

  // Check admin session
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.expiresAt > Date.now()) {
          setAdminSession(parsedSession);
        } else {
          localStorage.removeItem('adminSession');
          router.push('/admin/login');
        }
      } catch (error) {
        localStorage.removeItem('adminSession');
        router.push('/admin/login');
      }
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!adminSession) return;
    
    setLoading(true);
    try {
      const [ipRes, countryRes, statsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/rate-limits/block-ip', {
          headers: { 'Authorization': `Bearer ${adminSession.token}` }
        }),
        fetch('/api/admin/rate-limits/block-country', {
          headers: { 'Authorization': `Bearer ${adminSession.token}` }
        }),
        fetch('/api/admin/rate-limits/stats', {
          headers: { 'Authorization': `Bearer ${adminSession.token}` }
        }),
        fetch('/api/admin/analytics/summary', {
          headers: { 'Authorization': `Bearer ${adminSession.token}` }
        }),
      ]);

      if (ipRes.ok) {
        const data = await ipRes.json();
        setBlockedIPs(data.blockedIPs || []);
      }

      if (countryRes.ok) {
        const data = await countryRes.json();
        setBlockedCountries(data.blockedCountries || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalyticsSummary(data);
      }
    } catch (error: any) {
      showSnackbar(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [adminSession]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    router.push('/admin/login');
  };

  const handleBlockIP = async () => {
    if (!newIP || !adminSession) return;
    
    console.log('Blocking IP:', newIP);
    if (!newIP.trim()) {
      showSnackbar('IP address is required', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/rate-limits/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`
        },
        body: JSON.stringify({ ip: newIP, reason: blockReason }),
      });
      
      if (res.ok) {
        const data = await res.json();
        showSnackbar(data.message || 'IP blocked successfully!', 'success');
        setNewIP('');
        setBlockIPDialog(false);
        await fetchData();
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to block IP`);
      }
    } catch (error: any) {
      console.error('Error blocking IP:', error);
      showSnackbar(`Error blocking IP: ${error.message}`, 'error');
    }
  };

  const handleUnblockIP = async (ip: string) => {
    if (!adminSession) return;
    
    console.log('Unblocking IP:', ip);
    if (!ip || ip.trim() === '') {
      showSnackbar('IP address is required', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/rate-limits/unblock-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`
        },
        body: JSON.stringify({ ip }),
      });
      
      if (res.ok) {
        const data = await res.json();
        showSnackbar(data.message || 'IP unblocked successfully!', 'success');
        await fetchData();
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to unblock IP`);
      }
    } catch (error: any) {
      console.error('Error unblocking IP:', error);
      showSnackbar(`Error unblocking IP: ${error.message}`, 'error');
    }
  };

  const handleBlockCountry = async () => {
    if (!newCountry || !adminSession) return;
    
    console.log('Blocking country:', newCountry);
    if (!newCountry.trim()) {
      showSnackbar('Country code is required', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/rate-limits/block-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`
        },
        body: JSON.stringify({ countryCode: newCountry.toUpperCase(), reason: blockReason }),
      });
      
      if (res.ok) {
        const data = await res.json();
        showSnackbar(data.message || 'Country blocked successfully!', 'success');
        setNewCountry('');
        setBlockCountryDialog(false);
        await fetchData();
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to block country`);
      }
    } catch (error: any) {
      console.error('Error blocking country:', error);
      showSnackbar(`Error blocking country: ${error.message}`, 'error');
    }
  };

  const handleUnblockCountry = async (country: string) => {
    if (!adminSession) return;
    
    console.log('Unblocking country:', country);
    if (!country || country.trim() === '') {
      showSnackbar('Country code is required', 'error');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/rate-limits/unblock-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`
        },
        body: JSON.stringify({ countryCode: country }),
      });
      
      if (res.ok) {
        const data = await res.json();
        showSnackbar(data.message || 'Country unblocked successfully!', 'success');
        await fetchData();
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to unblock country`);
      }
    } catch (error: any) {
      console.error('Error unblocking country:', error);
      showSnackbar(`Error unblocking country: ${error.message}`, 'error');
    }
  };

  if (!adminSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ 
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            flexGrow: 1
          }}>
            🛡️ Admin Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={toggleTheme} color="inherit">
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={() => router.push('/admin/analytics')}
              size="small"
            >
              Analytics
            </Button>
            
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              size="small"
              sx={{ 
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252, #26A69A)',
                }
              }}
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
              color="error"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Comprehensive admin control center for security, analytics, and system management
          </Typography>
        </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <>
          {/* Statistics Cards */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card sx={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BlockIcon sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      Blocked IPs
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                    {blockedIPs.length}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card sx={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PublicIcon sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      Blocked Countries
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                    {blockedCountries.length}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card sx={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeedIcon sx={{ color: 'info.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      Active IPs
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                    {stats?.activeIPs || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Card sx={{ 
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-4px)' }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>
                      Active Countries
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {stats?.activeCountries || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
                    </Box>

          {/* Action Buttons */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => setBlockIPDialog(true)}
              size="large"
              sx={{ minWidth: 200 }}
            >
              Block IP Address
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<BlockIcon />}
              onClick={() => setBlockCountryDialog(true)}
              size="large"
              sx={{ minWidth: 200 }}
            >
              Block Country
            </Button>
          </Box>

          {/* Device & OS Statistics */}
          {analyticsSummary && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              {/* Device Types */}
              <Paper sx={{ 
                flex: '1 1 300px', 
                minWidth: 0,
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    📱 Device Types
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Distribution of device types accessing the system
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {analyticsSummary.topDevices.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {analyticsSummary.topDevices.slice(0, 5).map((device, index) => (
                        <Box key={device.device} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                              {device.device}
                            </Typography>
                          </Box>
                          <Chip 
                            label={device.count.toLocaleString()} 
                            color="primary" 
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No device data available
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* Operating Systems */}
              <Paper sx={{ 
                flex: '1 1 300px', 
                minWidth: 0,
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    💻 Operating Systems
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Distribution of operating systems
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {analyticsSummary.topOperatingSystems.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {analyticsSummary.topOperatingSystems.slice(0, 5).map((os, index) => (
                        <Box key={os.os} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {os.os}
                            </Typography>
                          </Box>
                          <Chip 
                            label={os.count.toLocaleString()} 
                            color="secondary" 
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No OS data available
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* Browsers */}
              <Paper sx={{ 
                flex: '1 1 300px', 
                minWidth: 0,
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    🌐 Browsers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Most popular browsers
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {analyticsSummary.topBrowsers.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {analyticsSummary.topBrowsers.slice(0, 5).map((browser, index) => (
                        <Box key={browser.browser} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {browser.browser}
                            </Typography>
                          </Box>
                          <Chip 
                            label={browser.count.toLocaleString()} 
                            color="success" 
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No browser data available
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          )}

          {/* IP Management */}
          <Paper sx={{ 
            mb: 4, 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                🚫 Blocked IP Addresses
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Manage IP addresses that are currently blocked from accessing the system
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {blockedIPs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BlockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No IP addresses are currently blocked
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {blockedIPs.map((ip) => (
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }} key={ip}>
                      <Card sx={{ 
                        background: isDarkMode ? '#2a2a2a' : '#ffffff',
                        border: 1,
                        borderColor: 'divider'
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {ip}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUnblockIP(ip)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Country Management */}
          <Paper sx={{ 
            mb: 4, 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                🌍 Blocked Countries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Manage countries that are currently blocked from accessing the system
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {blockedCountries.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PublicIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No countries are currently blocked
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {blockedCountries.map((country) => (
                    <Box sx={{ flex: '1 1 300px', minWidth: 0 }} key={country}>
                      <Card sx={{ 
                        background: isDarkMode ? '#2a2a2a' : '#ffffff',
                        border: 1,
                        borderColor: 'divider'
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {country}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUnblockCountry(country)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Top Countries Table */}
          <Paper sx={{ 
            mb: 4, 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                📊 Top Active Countries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Countries with the highest request activity
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {stats?.countryRateLimits && Object.keys(stats.countryRateLimits).length > 0 ? (
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Country</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Requests</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(stats.countryRateLimits)
                        .sort(([,a], [,b]) => b.count - a.count)
                        .slice(0, 10)
                        .map(([country, data]) => (
                        <TableRow key={country} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {country}
                              </Typography>
                              <Chip 
                                label={country} 
                                size="small" 
                                variant="outlined"
                                color="primary"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {data.count.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={blockedCountries.includes(country) ? "Blocked" : "Active"} 
                              color={blockedCountries.includes(country) ? "error" : "success"} 
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {blockedCountries.includes(country) ? (
                              <Tooltip title="Unblock Country">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleUnblockCountry(country)}
                                >
                                  <UnblockIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Block Country">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => {
                                    setSelectedCountry({ code: country, name: country, flag: '🏳️' });
                                    setBlockCountryDialog(true);
                                  }}
                                >
                                  <BlockIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PublicIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No country activity data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Rate Limit Statistics */}
          <Paper sx={{ 
            mb: 4, 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                📊 Live Rate Limit Statistics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Real-time monitoring of IP and country-based rate limiting activity
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              {stats ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      IP Rate Limits:
                    </Typography>
                    <Paper sx={{ 
                      maxHeight: 300, 
                      overflow: 'auto', 
                      p: 2,
                      background: isDarkMode ? '#2a2a2a' : '#ffffff'
                    }}>
                      {Object.entries(stats.ipRateLimits).length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <SpeedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            No IP activity detected
                          </Typography>
                        </Box>
                      ) : (
                        Object.entries(stats.ipRateLimits).map(([ip, data]) => (
                          <Box key={ip} sx={{ 
                            mb: 1, 
                            p: 2, 
                            bgcolor: isDarkMode ? '#1a1a1a' : 'grey.50', 
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider'
                          }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                              {ip}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Requests: {data.count} | First: {new Date(data.firstRequestTime).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Paper>
                  </Box>
                  <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      Country Rate Limits:
                    </Typography>
                    <Paper sx={{ 
                      maxHeight: 300, 
                      overflow: 'auto', 
                      p: 2,
                      background: isDarkMode ? '#2a2a2a' : '#ffffff'
                    }}>
                      {Object.entries(stats.countryRateLimits).length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <PublicIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            No country activity detected
                          </Typography>
                        </Box>
                      ) : (
                        Object.entries(stats.countryRateLimits).map(([country, data]) => (
                          <Box key={country} sx={{ 
                            mb: 1, 
                            p: 2, 
                            bgcolor: isDarkMode ? '#1a1a1a' : 'grey.50', 
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider'
                          }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                              {country}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Requests: {data.count} | First: {new Date(data.firstRequestTime).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Paper>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading statistics...
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </>
      )}

      {/* Block IP Dialog */}
      <Dialog open={blockIPDialog} onClose={() => setBlockIPDialog(false)}>
        <DialogTitle>Block IP Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="IP Address"
            fullWidth
            variant="outlined"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Reason</InputLabel>
            <Select
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              label="Reason"
            >
              <MenuItem value="Policy violation">Policy violation</MenuItem>
              <MenuItem value="Suspicious activity">Suspicious activity</MenuItem>
              <MenuItem value="Abuse">Abuse</MenuItem>
              <MenuItem value="Spam">Spam</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockIPDialog(false)}>Cancel</Button>
          <Button onClick={handleBlockIP} variant="contained" color="error">
            Block IP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Country Dialog */}
      <Dialog open={blockCountryDialog} onClose={() => setBlockCountryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Block Country</DialogTitle>
        <DialogContent>
          <Autocomplete
            fullWidth
            options={countries}
            getOptionLabel={(option) => `${option.flag} ${option.name} (${option.code})`}
            value={countries.find(c => c.code === newCountry) || null}
            onChange={(_, newValue) => setNewCountry(newValue?.code || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Country"
                placeholder="Search for a country..."
                sx={{ mt: 2 }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box component="li" key={key} {...otherProps}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">{option.flag}</Typography>
                    <Box>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.code}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            }}
            isOptionEqualToValue={(option, value) => option.code === value?.code}
            noOptionsText="No countries found"
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Reason</InputLabel>
            <Select
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              label="Reason"
            >
              <MenuItem value="Policy violation">Policy violation</MenuItem>
              <MenuItem value="Sanctions">Sanctions</MenuItem>
              <MenuItem value="High risk">High risk</MenuItem>
              <MenuItem value="Abuse">Abuse</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setBlockCountryDialog(false);
            setNewCountry('');
            setBlockReason('Policy violation');
          }}>Cancel</Button>
          <Button
            onClick={handleBlockCountry}
            color="warning"
            variant="contained"
            disabled={!newCountry || !blockReason.trim()}
          >
            Block Country
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
}
