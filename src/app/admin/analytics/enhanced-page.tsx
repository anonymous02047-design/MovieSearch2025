'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  LinearProgress,
  Fade,
  Collapse,
  Grid,
  CardHeader,
  Avatar,
  Badge,
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
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  PhoneAndroid as PhoneIcon,
  Tablet as TabletIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import EnhancedLoading, { TableSkeleton } from '@/components/EnhancedLoading';

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';

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

interface ErrorState {
  hasError: boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
  details?: string;
}

export default function EnhancedAdminAnalyticsPage() {
  const { isDarkMode, toggleTheme } = useAdminTheme();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
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

  // Session detail dialog
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [sessionDetailOpen, setSessionDetailOpen] = useState(false);
  
  // Block confirmation dialog
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<{ type: 'ip' | 'country'; value: string; name: string } | null>(null);

  // Enhanced error handling
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    let errorType: 'error' | 'warning' | 'info' = 'error';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
      errorDetails = error.details || '';
    }

    // Handle specific error types
    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      errorMessage = 'Session expired. Please log in again.';
      errorType = 'warning';
    } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      errorMessage = 'Access denied. You do not have permission to view this data.';
      errorType = 'warning';
    } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      errorMessage = 'Data not found. The requested information may have been moved or deleted.';
      errorType = 'info';
    } else if (errorMessage.includes('500') || errorMessage.includes('server error')) {
      errorMessage = 'Server error. Please try again later or contact support.';
      errorType = 'error';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection and try again.';
      errorType = 'warning';
    }

    setError({
      hasError: true,
      message: errorMessage,
      type: errorType,
      details: errorDetails,
    });

    setSnackbarMessage(errorMessage);
    setSnackbarSeverity(errorType === 'error' ? 'error' : errorType === 'warning' ? 'warning' : 'info');
    setSnackbarOpen(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          router.push('/admin/login');
          return;
        }
        setIsAuthenticated(true);
        setAuthLoading(false);
      } catch (error) {
        handleError(error, 'authentication check');
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router, handleError]);

  const fetchSessions = useCallback(async (retryAttempt = 0) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    clearError();
    
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const queryParams = new URLSearchParams({
        limit: pageSize.toString(),
        offset: ((currentPage - 1) * pageSize).toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value)),
      });

      const response = await fetch(`/api/admin/analytics/sessions?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('adminSession');
          router.push('/admin/login');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      setSessions(data.sessions || []);
      setTotalSessions(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
      setRetryCount(0);
      setLastRefresh(new Date());
    } catch (error) {
      handleError(error, 'fetching sessions');
      
      // Retry logic for network errors
      if (retryAttempt < 3 && (error instanceof Error && error.message.includes('network'))) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchSessions(retryAttempt + 1);
        }, 2000 * (retryAttempt + 1)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, pageSize, router, isAuthenticated, handleError, clearError]);

  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const queryParams = new URLSearchParams();
      if (filters.dateFrom) queryParams.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.set('dateTo', filters.dateTo);

      const response = await fetch(`/api/admin/analytics/summary?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('adminSession');
          router.push('/admin/login');
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      setSummary(data);
    } catch (error) {
      handleError(error, 'fetching analytics summary');
    }
  }, [filters.dateFrom, filters.dateTo, router, isAuthenticated, handleError]);

  const fetchBlockedData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No admin token found');
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
      }

      if (countryRes.ok) {
        const countryData = await countryRes.json();
        setBlockedCountries(countryData.blockedCountries || []);
      }
    } catch (error) {
      handleError(error, 'fetching blocked data');
    }
  }, [isAuthenticated, handleError]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
      fetchSummary();
      fetchBlockedData();
    }
  }, [isAuthenticated, fetchSessions, fetchSummary, fetchBlockedData]);

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
    setRetryCount(0);
    await Promise.all([
      fetchSessions(),
      fetchSummary(),
      fetchBlockedData()
    ]);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
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

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <PhoneIcon />;
      case 'tablet':
        return <TabletIcon />;
      case 'desktop':
        return <ComputerIcon />;
      default:
        return <DevicesIcon />;
    }
  };

  if (authLoading) {
    return <EnhancedLoading message="Authenticating..." fullScreen />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" className="fade-in">
            Analytics Dashboard
          </Typography>
          
          {lastRefresh && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Typography>
          )}
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
            className="hover-lift"
          >
            Dashboard
          </Button>
          
          <Button
            variant="contained"
            className="button-glow"
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
            className="hover-lift"
          >
            Rate Limits
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => { localStorage.removeItem('admin_token'); router.push('/admin/login'); }}
            className="hover-lift"
          >
            Logout
          </Button>
        </Box>
      </div>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Error Display */}
        {error && (
          <Fade in>
            <Alert 
              severity={error.type} 
              sx={{ mb: 3 }} 
              onClose={clearError}
              action={
                retryCount > 0 && (
                  <Button color="inherit" size="small" onClick={handleRefreshAll}>
                    Retry ({retryCount}/3)
                  </Button>
                )
              }
            >
              <AlertTitle>
                {error.type === 'error' && <ErrorIcon sx={{ mr: 1 }} />}
                {error.type === 'warning' && <WarningIcon sx={{ mr: 1 }} />}
                {error.type === 'info' && <InfoIcon sx={{ mr: 1 }} />}
                {error.message}
              </AlertTitle>
              {error.details && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {error.details}
                </Typography>
              )}
            </Alert>
          </Fade>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshAll}
            disabled={loading}
            className="hover-lift"
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            disabled={loading || sessions.length === 0}
            className="hover-lift"
          >
            Export CSV
          </Button>
          
          <Button
            variant="outlined"
            color="warning"
            startIcon={<DeleteIcon />}
            disabled={loading}
            className="hover-lift"
          >
            Cleanup
          </Button>
        </Box>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Loading analytics data...
            </Typography>
          </Box>
        )}

        {/* Tabs */}
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
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="card-hover scale-in">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <PeopleIcon />
                      </Avatar>
                      <Typography color="textSecondary" gutterBottom>
                        Total Sessions
                      </Typography>
                    </Box>
                    <Typography variant="h4">
                      {summary.totalSessions.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card className="card-hover scale-in stagger-1">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                        <TrendingUpIcon />
                      </Avatar>
                      <Typography color="textSecondary" gutterBottom>
                        Active Sessions
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {summary.activeSessions.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card className="card-hover scale-in stagger-2">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                        <PublicIcon />
                      </Avatar>
                      <Typography color="textSecondary" gutterBottom>
                        Top Country
                      </Typography>
                    </Box>
                    <Typography variant="h6">
                      {summary.topCountries[0]?.country || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {summary.topCountries[0]?.count || 0} sessions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card className="card-hover scale-in stagger-3">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                        {getDeviceIcon(summary.topDevices[0]?.device || 'desktop')}
                      </Avatar>
                      <Typography color="textSecondary" gutterBottom>
                        Top Device
                      </Typography>
                    </Box>
                    <Typography variant="h6">
                      {summary.topDevices[0]?.device || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {summary.topDevices[0]?.count || 0} sessions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Sessions Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3, mb: 3 }} className="fade-in">
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Date From"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Date To"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Country"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Browser"
                  value={filters.browser}
                  onChange={(e) => handleFilterChange('browser', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="User ID"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="IP Address"
                  value={filters.ipAddress}
                  onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                  <Button variant="contained" onClick={handleApplyFilters} className="button-glow">
                    Apply
                  </Button>
                  <Button variant="outlined" onClick={handleClearFilters}>
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper className="fade-in">
            {loading ? (
              <TableSkeleton rows={5} columns={6} />
            ) : (
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
                    {sessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <Box sx={{ py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                              No sessions found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your filters or check back later
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sessions.map((session, index) => (
                        <TableRow 
                          key={session.sessionId}
                          className="fade-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
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
                                <Chip label="Blocked" size="small" color="error" variant="outlined" />
                              ) : (
                                <Chip label="Active" size="small" color="success" variant="outlined" />
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
                                  <Chip label="Blocked" size="small" color="error" variant="outlined" />
                                ) : (
                                  <Chip label="Active" size="small" color="success" variant="outlined" />
                                )
                              ) : (
                                <Chip label="No Code" size="small" variant="outlined" color="warning" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getDeviceIcon(session.deviceType)}
                              <Chip label={session.deviceType} size="small" variant="outlined" />
                            </Box>
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
                            <Badge badgeContent={session.events.length} color="primary">
                              <Chip label="Events" size="small" />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setSessionDetailOpen(true);
                                }}
                                className="hover-lift"
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
            )}
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Paper>
        </TabPanel>

        {/* Geographic Tab */}
        <TabPanel value={tabValue} index={2}>
          {summary && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }} className="fade-in">
                  <Typography variant="h6" gutterBottom>
                    Country Distribution
                  </Typography>
                  <List>
                    {summary.topCountries.map((item, index) => (
                      <ListItem key={item.country} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <ListItemText
                          primary={`${index + 1}. ${item.country}`}
                          secondary={`${item.count} sessions (${((item.count / summary.totalSessions) * 100).toFixed(1)}%)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }} className="fade-in stagger-1">
                  <Typography variant="h6" gutterBottom>
                    Top Referrers
                  </Typography>
                  <List>
                    {summary.topReferrers.slice(0, 10).map((item, index) => (
                      <ListItem key={item.referrer} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <ListItemText
                          primary={`${index + 1}. ${item.referrer || 'Direct'}`}
                          secondary={`${item.count} sessions`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Technical Tab */}
        <TabPanel value={tabValue} index={3}>
          {summary && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }} className="fade-in">
                  <Typography variant="h6" gutterBottom>
                    Device Types
                  </Typography>
                  <List>
                    {summary.topDevices.map((item, index) => (
                      <ListItem key={item.device} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <ListItemText
                          primary={`${index + 1}. ${item.device}`}
                          secondary={`${item.count} sessions (${((item.count / summary.totalSessions) * 100).toFixed(1)}%)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }} className="fade-in stagger-1">
                  <Typography variant="h6" gutterBottom>
                    Browser Distribution
                  </Typography>
                  <List>
                    {summary.topBrowsers.map((item, index) => (
                      <ListItem key={item.browser} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <ListItemText
                          primary={`${index + 1}. ${item.browser}`}
                          secondary={`${item.count} sessions (${((item.count / summary.totalSessions) * 100).toFixed(1)}%)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Session ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 2 }}>
                      {selectedSession.sessionId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      User ID
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedSession.userId || 'Guest'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Timestamp
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {formatTimestamp(selectedSession.timestamp)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {formatDuration(selectedSession.sessionDuration)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      IP Address
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedSession.ipAddress}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedSession.city}, {selectedSession.region}, {selectedSession.country}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Device
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedSession.deviceType} - {selectedSession.operatingSystem}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Browser
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedSession.browser} {selectedSession.browserVersion}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSessionDetailOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}
