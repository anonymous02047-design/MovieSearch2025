'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Pagination,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Timeline as TimelineIcon,
  Map as MapIcon,
  Devices as DevicesIcon,
  Language as LanguageIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { trackAdminViewAnalytics, trackAdminExportData, trackAdminCleanup } from '@/components/AdminAnalyticsBeacon';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface SessionData {
  sessionId: string;
  userId?: string;
  timestamp: number;
  ipAddress: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  deviceType: string;
  browser: string;
  browserVersion: string;
  operatingSystem: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  referrer: string;
  landingPage: string;
  currentPage: string;
  pagesVisited: string[];
  sessionDuration: number;
  loginStatus: boolean;
  events: any[];
  customField1?: string;
  customField2?: string;
  customField3?: string;
}

interface AnalyticsSummary {
  totalSessions: number;
  activeSessions: number;
  topCountries: Array<{ country: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
  topBrowsers: Array<{ browser: string; count: number }>;
  mostVisitedPages: Array<{ page: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { isDarkMode, toggleTheme } = useAdminTheme();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Block system state
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    country: '',
    deviceType: '',
    browser: '',
    userId: '',
    ipAddress: '',
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const pageSize = 20;

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
      setAuthLoading(false);
    };

    checkAuth();
  }, [router]);
  
  // Session detail dialog
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [sessionDetailOpen, setSessionDetailOpen] = useState(false);
  
  // Block confirmation dialog
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<{ type: 'ip' | 'country'; value: string; name: string } | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        console.warn('No admin token found for sessions');
        router.push('/admin/login');
        return;
      }

      const queryParams = new URLSearchParams({
        limit: pageSize.toString(),
        offset: ((currentPage - 1) * pageSize).toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      });

      const response = await fetch(`/api/admin/analytics/sessions?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        setTotalSessions(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / pageSize));
      } else if (response.status === 401) {
        console.warn('Unauthorized access to sessions');
        setError('Session expired. Please log in again.');
        // Clear expired tokens
        localStorage.removeItem('admin_token');
        localStorage.removeItem('adminSession');
        router.push('/admin/login');
      } else if (response.status === 500) {
        console.error('Server error fetching sessions');
        setError('Server error. Please try again later.');
      } else {
        console.error('Failed to fetch sessions:', response.status);
        setError('Failed to load session data.');
      }
    } catch (error: any) {
      console.error('Network error fetching sessions:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, pageSize, router]);

  const fetchSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        console.warn('No admin token found for analytics summary');
        return;
      }

      const queryParams = new URLSearchParams();
      if (filters.dateFrom) queryParams.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.set('dateTo', filters.dateTo);

      const response = await fetch(`/api/admin/analytics/summary?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched summary data:', data);
        setSummary(data);
      } else if (response.status === 401) {
        console.warn('Unauthorized access to analytics summary');
        setError('Session expired. Please log in again.');
        // Clear expired tokens
        localStorage.removeItem('admin_token');
        localStorage.removeItem('adminSession');
        router.push('/admin/login');
      } else if (response.status === 500) {
        console.error('Server error fetching analytics summary');
        setError('Server error. Please try again later.');
      } else {
        console.error('Failed to fetch analytics summary:', response.status);
        setError('Failed to load analytics data.');
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setError('Network error. Please check your connection and try again.');
    }
  }, [filters.dateFrom, filters.dateTo, router]);

  const fetchBlockedData = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        console.warn('No admin token found for blocked data');
        return;
      }

      const [ipRes, countryRes] = await Promise.all([
        fetch('/api/admin/rate-limits/block-ip', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/rate-limits/block-country', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      if (ipRes.ok) {
        const ipData = await ipRes.json();
        setBlockedIPs(ipData.blockedIPs || []);
        console.log('Fetched blocked IPs:', ipData.blockedIPs);
      }

      if (countryRes.ok) {
        const countryData = await countryRes.json();
        setBlockedCountries(countryData.blockedCountries || []);
        console.log('Fetched blocked countries:', countryData.blockedCountries);
      }
    } catch (error: any) {
      console.error('Error fetching blocked data:', error);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchSummary();
    fetchBlockedData();
    // Track admin viewing analytics
    trackAdminViewAnalytics('analytics_dashboard');
  }, [fetchSessions, fetchSummary, fetchBlockedData]);

  // Add periodic refresh for blocked data
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBlockedData();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [fetchBlockedData]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    fetchSessions();
    fetchSummary();
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      country: '',
      deviceType: '',
      browser: '',
      userId: '',
      ipAddress: '',
    });
    setCurrentPage(1);
  };

  const handleRefreshAll = async () => {
    console.log('Refreshing all data...');
    await Promise.all([
      fetchSessions(),
      fetchSummary(),
      fetchBlockedData()
    ]);
    console.log('All data refreshed');
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const queryParams = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
      );

      const response = await fetch(`/api/admin/analytics/export?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-sessions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showSnackbar('Data exported successfully!', 'success');
        trackAdminExportData('csv', totalSessions);
      } else {
        throw new Error('Failed to export data');
      }
    } catch (error: any) {
      showSnackbar(`Export failed: ${error.message}`, 'error');
    }
  };

  const handleCleanup = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await fetch('/api/admin/analytics/cleanup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar('Old session files cleaned up successfully!', 'success');
        trackAdminCleanup('session_files', data.removedFiles || 0);
        fetchSessions();
        fetchSummary();
      } else {
        throw new Error('Failed to cleanup data');
      }
    } catch (error: any) {
      showSnackbar(`Cleanup failed: ${error.message}`, 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleViewSession = (session: SessionData) => {
    setSelectedSession(session);
    setSessionDetailOpen(true);
  };

  const handleBlockIP = (ip: string) => {
    console.log('Blocking IP:', ip);
    if (!ip || ip.trim() === '') {
      showSnackbar('IP address is required', 'error');
      return;
    }
    setBlockTarget({ type: 'ip', value: ip, name: ip });
    setBlockDialogOpen(true);
  };

  const confirmBlockIP = async (ip: string) => {
    try {
      console.log('Confirming block IP:', ip);
      if (!ip || ip.trim() === '') {
        showSnackbar('IP address is required', 'error');
        return;
      }
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showSnackbar('Admin token not found', 'error');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ip: ip, 
          reason: 'Blocked from analytics',
          duration: 86400000 // 24 hours
        })
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar(data.message || `IP ${ip} blocked successfully`, 'success');
        // Refresh both blocked data and sessions
        await fetchBlockedData();
        await fetchSessions();
      } else {
        const errorData = await response.json();
        showSnackbar(`Failed to block IP: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error: any) {
      console.error('Error blocking IP:', error);
      showSnackbar(`Error blocking IP: ${error.message}`, 'error');
    }
  };

  const handleUnblockIP = async (ip: string) => {
    try {
      console.log('Unblocking IP:', ip);
      if (!ip || ip.trim() === '') {
        showSnackbar('IP address is required', 'error');
        return;
      }
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showSnackbar('Admin token not found', 'error');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/unblock-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ip: ip })
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar(data.message || `IP ${ip} unblocked successfully`, 'success');
        // Refresh both blocked data and sessions
        await fetchBlockedData();
        await fetchSessions();
      } else {
        const errorData = await response.json();
        showSnackbar(`Failed to unblock IP: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error: any) {
      console.error('Error unblocking IP:', error);
      showSnackbar(`Error unblocking IP: ${error.message}`, 'error');
    }
  };

  const handleBlockCountry = (country: string, countryName: string) => {
    console.log('Blocking country:', { country, countryName });
    if (!country || country.trim() === '') {
      showSnackbar('Country code is required', 'error');
      return;
    }
    setBlockTarget({ type: 'country', value: country, name: countryName });
    setBlockDialogOpen(true);
  };

  const confirmBlockCountry = async (countryCode: string) => {
    try {
      console.log('Confirming block country:', countryCode);
      if (!countryCode || countryCode.trim() === '') {
        showSnackbar('Country code is required', 'error');
        return;
      }
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showSnackbar('Admin token not found', 'error');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/block-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          countryCode: countryCode, 
          reason: 'Blocked from analytics' 
        })
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar(data.message || `Country ${countryCode} blocked successfully`, 'success');
        // Refresh both blocked data and sessions
        await fetchBlockedData();
        await fetchSessions();
      } else {
        const errorData = await response.json();
        showSnackbar(`Failed to block country: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error: any) {
      console.error('Error blocking country:', error);
      showSnackbar(`Error blocking country: ${error.message}`, 'error');
    }
  };

  const handleUnblockCountry = async (countryCode: string) => {
    try {
      console.log('Unblocking country:', countryCode);
      if (!countryCode || countryCode.trim() === '') {
        showSnackbar('Country code is required', 'error');
        return;
      }
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showSnackbar('Admin token not found', 'error');
        return;
      }

      const response = await fetch('/api/admin/rate-limits/unblock-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ countryCode: countryCode })
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar(data.message || `Country ${countryCode} unblocked successfully`, 'success');
        // Refresh both blocked data and sessions
        await fetchBlockedData();
        await fetchSessions();
      } else {
        const errorData = await response.json();
        showSnackbar(`Failed to unblock country: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (error: any) {
      console.error('Error unblocking country:', error);
      showSnackbar(`Error unblocking country: ${error.message}`, 'error');
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading && !summary) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Analytics Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
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
          
          
          <Button
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
              }
            }}
          >
            Analytics
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => router.push('/admin/rate-limits')}
            sx={{ 
              borderColor: '#ff9800',
              color: '#ff9800',
              '&:hover': {
                borderColor: '#f57c00',
                backgroundColor: 'rgba(255, 152, 0, 0.04)',
              }
            }}
          >
            Rate Limits
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }}
            sx={{ 
              borderColor: '#f44336',
              color: '#f44336',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </div>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshAll}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<DeleteIcon />}
            onClick={handleCleanup}
          >
            Cleanup
          </Button>
        </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" icon={<TimelineIcon />} />
          <Tab label="Sessions" icon={<DevicesIcon />} />
          <Tab label="Geographic" icon={<MapIcon />} />
          <Tab label="Technical" icon={<LanguageIcon />} />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        {summary && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
            <Card sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Sessions
                </Typography>
                <Typography variant="h4">
                  {summary.totalSessions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Sessions
                </Typography>
                <Typography variant="h4" color="primary">
                  {summary.activeSessions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Top Country
                </Typography>
                <Typography variant="h6">
                  {summary.topCountries[0]?.country || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {summary.topCountries[0]?.count || 0} sessions
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Top Device
                </Typography>
                <Typography variant="h6">
                  {summary.topDevices[0]?.device || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {summary.topDevices[0]?.count || 0} sessions
                </Typography>
              </CardContent>
            </Card>

            <Paper sx={{ p: 3, flex: '1 1 300px', minWidth: 0 }}>
              <Typography variant="h6" gutterBottom>
                Top Countries
              </Typography>
              <List dense>
                {summary.topCountries.slice(0, 5).map((item, index) => (
                  <ListItem key={item.country}>
                    <ListItemText
                      primary={`${index + 1}. ${item.country}`}
                      secondary={`${item.count} sessions`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Devices
                </Typography>
                <List dense>
                  {summary.topDevices.slice(0, 5).map((item, index) => (
                    <ListItem key={item.device}>
                      <ListItemText
                        primary={`${index + 1}. ${item.device}`}
                        secondary={`${item.count} sessions`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Most Visited Pages
                </Typography>
                <List dense>
                  {summary.mostVisitedPages.slice(0, 5).map((item, index) => (
                    <ListItem key={item.page}>
                      <ListItemText
                        primary={`${index + 1}. ${item.page}`}
                        secondary={`${item.count} visits`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Browsers
                </Typography>
                <List dense>
                  {summary.topBrowsers.slice(0, 5).map((item, index) => (
                    <ListItem key={item.browser}>
                      <ListItemText
                        primary={`${index + 1}. ${item.browser}`}
                        secondary={`${item.count} sessions`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        )}
      </TabPanel>

      {/* Sessions Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <TextField
                label="Date From"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <TextField
                label="Date To"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <TextField
                label="Country"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Device Type</InputLabel>
                <Select
                  value={filters.deviceType}
                  label="Device Type"
                  onChange={(e) => handleFilterChange('deviceType', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="desktop">Desktop</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                  <MenuItem value="tablet">Tablet</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <TextField
                label="Browser"
                value={filters.browser}
                onChange={(e) => handleFilterChange('browser', e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <TextField
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <TextField
                label="IP Address"
                value={filters.ipAddress}
                onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                <Button variant="contained" onClick={handleApplyFilters}>
                  Apply
                </Button>
                <Button variant="outlined" onClick={handleClearFilters}>
                  Clear
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Session ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Browser</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Events</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No sessions found
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.sessionId}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {session.sessionId.substring(0, 12)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {session.userId ? (
                            <Chip label="Logged In" size="small" color="primary" />
                          ) : (
                            <Chip label="Guest" size="small" variant="outlined" />
                          )}
                          {blockedIPs.includes(session.ipAddress) && (
                            <Chip label="IP Blocked" size="small" color="error" />
                          )}
                          {blockedCountries.includes(session.countryCode) && (
                            <Chip label="Country Blocked" size="small" color="warning" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatTimestamp(session.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {session.ipAddress}
                          </Typography>
                          {blockedIPs.includes(session.ipAddress) ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Blocked" size="small" color="error" variant="outlined" />
                              <Tooltip title="Unblock IP">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUnblockIP(session.ipAddress)}
                                  color="success"
                                >
                                  <UnblockIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip label="Active" size="small" color="success" variant="outlined" />
                              <Tooltip title="Block IP">
                                <IconButton
                                  size="small"
                                  onClick={() => handleBlockIP(session.ipAddress)}
                                  color="error"
                                >
                                  <BlockIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {session.country}
                          </Typography>
                          {session.countryCode && session.countryCode.trim() !== '' ? (
                            blockedCountries.includes(session.countryCode) ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label="Blocked" size="small" color="error" variant="outlined" />
                                <Tooltip title="Unblock Country">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      console.log('Unblocking country:', session.countryCode, 'Blocked countries:', blockedCountries);
                                      handleUnblockCountry(session.countryCode);
                                    }}
                                    color="success"
                                  >
                                    <UnblockIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label="Active" size="small" color="success" variant="outlined" />
                                <Tooltip title="Block Country">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      console.log('Blocking country:', session.countryCode, 'Blocked countries:', blockedCountries);
                                      handleBlockCountry(session.countryCode, session.country);
                                    }}
                                    color="error"
                                  >
                                    <BlockIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            )
                          ) : (
                            <Chip label="No Code" size="small" variant="outlined" color="warning" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={session.deviceType} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {session.browser} {session.browserVersion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDuration(session.sessionDuration)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={session.events.length} size="small" />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewSession(session)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </Paper>
      </TabPanel>

      {/* Geographic Tab */}
      <TabPanel value={tabValue} index={2}>
        {summary && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Country Distribution
                </Typography>
                <List>
                  {summary.topCountries.map((item, index) => (
                    <ListItem key={item.country}>
                      <ListItemText
                        primary={`${index + 1}. ${item.country}`}
                        secondary={`${item.count} sessions (${((item.count / summary.totalSessions) * 100).toFixed(1)}%)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Referrers
                </Typography>
                <List>
                  {summary.topReferrers.slice(0, 10).map((item, index) => (
                    <ListItem key={item.referrer}>
                      <ListItemText
                        primary={`${index + 1}. ${item.referrer || 'Direct'}`}
                        secondary={`${item.count} sessions`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        )}
      </TabPanel>

      {/* Technical Tab */}
      <TabPanel value={tabValue} index={3}>
        {summary && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Device Types
                </Typography>
                <List>
                  {summary.topDevices.map((item, index) => (
                    <ListItem key={item.device}>
                      <ListItemText
                        primary={`${index + 1}. ${item.device}`}
                        secondary={`${item.count} sessions (${((item.count / summary.totalSessions) * 100).toFixed(1)}%)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Browser Distribution
                </Typography>
                <List>
                  {summary.topBrowsers.map((item, index) => (
                    <ListItem key={item.browser}>
                      <ListItemText
                        primary={`${index + 1}. ${item.browser}`}
                        secondary={`${item.count} sessions (${((item.count / summary.totalSessions) * 100).toFixed(1)}%)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        )}
      </TabPanel>

      {/* Session Detail Dialog */}
      <Dialog
        open={sessionDetailOpen}
        onClose={() => setSessionDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Session Details</DialogTitle>
        <DialogContent>
          {selectedSession && (
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Session ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                    {selectedSession.sessionId}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.userId || 'Guest'}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {formatTimestamp(selectedSession.timestamp)}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {formatDuration(selectedSession.sessionDuration)}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    IP Address
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.ipAddress}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Location
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.city}, {selectedSession.region}, {selectedSession.country}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Device
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.deviceType} - {selectedSession.operatingSystem}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Browser
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.browser} {selectedSession.browserVersion}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Screen Resolution
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.screenWidth} x {selectedSession.screenHeight}
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Language
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {selectedSession.language}
                  </Typography>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Pages Visited
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedSession.pagesVisited.map((page, index) => (
                      <Chip
                        key={index}
                        label={page}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Events ({selectedSession.events.length})
                  </Typography>
                  <List dense>
                    {selectedSession.events.slice(0, 10).map((event, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${event.type} - ${new Date(event.timestamp).toLocaleTimeString()}`}
                          secondary={event.page}
                        />
                      </ListItem>
                    ))}
                    {selectedSession.events.length > 10 && (
                      <ListItem>
                        <ListItemText
                          primary={`... and ${selectedSession.events.length - 10} more events`}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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

      {/* Block Confirmation Dialog */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Block Action
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to block {blockTarget?.type === 'ip' ? 'IP address' : 'country'} <strong>{blockTarget?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action will prevent all traffic from this {blockTarget?.type === 'ip' ? 'IP address' : 'country'} from accessing the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (blockTarget?.type === 'ip') {
                confirmBlockIP(blockTarget.value);
              } else if (blockTarget?.type === 'country') {
                confirmBlockCountry(blockTarget.value);
              }
              setBlockDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Block {blockTarget?.type === 'ip' ? 'IP' : 'Country'}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </div>
  );
}
