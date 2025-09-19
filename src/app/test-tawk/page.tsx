'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Tag as TagIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  OnlinePrediction as OnlineIcon,
  OfflineBolt as OfflineIcon,
  Schedule as AwayIcon,
  DoNotDisturb as BusyIcon,
} from '@mui/icons-material';
import { useTawk } from '@/hooks/useTawk';
import { isTawkConfigured, validateTawkEnvironment } from '@/lib/tawkConfig';
import TawkWidget from '@/components/TawkWidget';

export default function TestTawkPage() {
  const [testMessage, setTestMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userTags, setUserTags] = useState('');
  const [customGreeting, setCustomGreeting] = useState('');
  const [customOfflineMessage, setCustomOfflineMessage] = useState('');
  const [widgetPosition, setWidgetPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [showStatus, setShowStatus] = useState(true);
  const [showAgent, setShowAgent] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);

  const {
    isLoaded,
    isConfigured,
    isVisible,
    isChatActive,
    chatStatus,
    agent,
    user,
    lastEvent,
    show,
    hide,
    toggle,
    maximize,
    minimize,
    startChat,
    endChat,
    sendMessage,
    setUser,
    addTags,
    removeTags,
    setCustomFields,
    setGreetingMessage,
    setOfflineMessage,
    setPosition,
    setTheme,
    setEnabled,
    reset,
  } = useTawk({
    autoInitialize: true,
    autoShow: false,
    onChatStarted: () => {
      console.log('Chat started');
    },
    onChatEnded: () => {
      console.log('Chat ended');
    },
    onMessageSent: (event) => {
      console.log('Message sent:', event);
    },
    onMessageReceived: (event) => {
      console.log('Message received:', event);
    },
    onWidgetOpened: () => {
      console.log('Widget opened');
    },
    onWidgetClosed: () => {
      console.log('Widget closed');
    },
    onAgentJoined: (event) => {
      console.log('Agent joined:', event);
    },
    onAgentLeft: (event) => {
      console.log('Agent left:', event);
    },
  });

  const handleSetUser = () => {
    const tags = userTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    setUser({
      name: userName || undefined,
      email: userEmail || undefined,
      phone: userPhone || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const handleAddTags = () => {
    const tags = userTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (tags.length > 0) {
      addTags(tags);
    }
  };

  const handleRemoveTags = () => {
    const tags = userTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    if (tags.length > 0) {
      removeTags(tags);
    }
  };

  const handleSendMessage = () => {
    if (testMessage.trim()) {
      sendMessage(testMessage);
      setTestMessage('');
    }
  };

  const handleSetGreeting = () => {
    if (customGreeting.trim()) {
      setGreetingMessage(customGreeting);
    }
  };

  const handleSetOfflineMessage = () => {
    if (customOfflineMessage.trim()) {
      setOfflineMessage(customOfflineMessage);
    }
  };

  const handleSetPosition = (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => {
    setWidgetPosition(position);
    setPosition(position);
  };

  const handleSetTheme = (theme: 'light' | 'dark' | 'auto') => {
    setWidgetTheme(theme);
    setTheme(theme);
  };

  const getStatusIcon = () => {
    switch (chatStatus) {
      case 'online':
        return <OnlineIcon color="success" />;
      case 'offline':
        return <OfflineIcon color="error" />;
      case 'away':
        return <AwayIcon color="warning" />;
      case 'busy':
        return <BusyIcon color="error" />;
      default:
        return <OfflineIcon color="error" />;
    }
  };

  const getStatusColor = () => {
    switch (chatStatus) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'away':
        return 'warning';
      case 'busy':
        return 'error';
      default:
        return 'error';
    }
  };

  const getStatusText = () => {
    switch (chatStatus) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      default:
        return 'Offline';
    }
  };

  const validation = validateTawkEnvironment();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Tawk.to Integration Test
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Test your Tawk.to chatbot integration and see the results.
      </Typography>

      {/* Configuration Status */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Configuration Status
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip
            icon={isConfigured ? <ChatIcon /> : <OfflineIcon />}
            label={isConfigured ? 'Configured' : 'Not Configured'}
            color={isConfigured ? 'success' : 'error'}
            variant="outlined"
          />
          <Chip
            icon={isLoaded ? <PlayIcon /> : <StopIcon />}
            label={isLoaded ? 'Loaded' : 'Not Loaded'}
            color={isLoaded ? 'success' : 'warning'}
            variant="outlined"
          />
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor() as any}
            variant="outlined"
          />
        </Stack>

        {!isConfigured && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Tawk.to is not properly configured. Please check your environment variables:
            <br />
            • NEXT_PUBLIC_TAWK_PROPERTY_ID
            <br />
            • NEXT_PUBLIC_TAWK_WIDGET_ID
            <br />
            • NEXT_PUBLIC_TAWK_ENABLED
          </Alert>
        )}

        {!validation.isValid && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Configuration issues found:
            <ul>
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Paper>

      {/* Widget Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Widget Controls
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={show}
              disabled={!isConfigured || !isLoaded}
              fullWidth
            >
              Show Widget
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<VisibilityOffIcon />}
              onClick={hide}
              disabled={!isConfigured || !isLoaded}
              fullWidth
            >
              Hide Widget
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<ChatIcon />}
              onClick={toggle}
              disabled={!isConfigured || !isLoaded}
              fullWidth
            >
              Toggle Widget
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={reset}
              disabled={!isConfigured}
              fullWidth
            >
              Reset
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<PlayIcon />}
              onClick={startChat}
              disabled={!isConfigured || !isLoaded || isChatActive}
              fullWidth
            >
              Start Chat
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              onClick={endChat}
              disabled={!isConfigured || !isLoaded || !isChatActive}
              fullWidth
            >
              End Chat
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={maximize}
              disabled={!isConfigured || !isLoaded}
              fullWidth
            >
              Maximize
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={minimize}
              disabled={!isConfigured || !isLoaded}
              fullWidth
            >
              Minimize
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* User Management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Management
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Phone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={userTags}
              onChange={(e) => setUserTags(e.target.value)}
              InputProps={{
                startAdornment: <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleSetUser}
            disabled={!isConfigured || !isLoaded}
          >
            Set User
          </Button>
          <Button
            variant="outlined"
            onClick={handleAddTags}
            disabled={!isConfigured || !isLoaded}
          >
            Add Tags
          </Button>
          <Button
            variant="outlined"
            onClick={handleRemoveTags}
            disabled={!isConfigured || !isLoaded}
          >
            Remove Tags
          </Button>
        </Stack>

        {user && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current User:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {user.name && <Chip label={`Name: ${user.name}`} size="small" />}
              {user.email && <Chip label={`Email: ${user.email}`} size="small" />}
              {user.phone && <Chip label={`Phone: ${user.phone}`} size="small" />}
              {user.tags && user.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" color="primary" />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* Message Testing */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Message Testing
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Test Message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!isConfigured || !isLoaded || !testMessage.trim()}
          >
            Send
          </Button>
        </Stack>
      </Paper>

      {/* Widget Configuration */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Widget Configuration
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={widgetPosition}
                onChange={(e) => handleSetPosition(e.target.value as any)}
                label="Position"
              >
                <MenuItem value="bottom-right">Bottom Right</MenuItem>
                <MenuItem value="bottom-left">Bottom Left</MenuItem>
                <MenuItem value="top-right">Top Right</MenuItem>
                <MenuItem value="top-left">Top Left</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={widgetTheme}
                onChange={(e) => handleSetTheme(e.target.value as any)}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={showStatus}
                  onChange={(e) => setShowStatus(e.target.checked)}
                />
              }
              label="Show Status"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={showAgent}
                  onChange={(e) => setShowAgent(e.target.checked)}
                />
              }
              label="Show Agent"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Custom Greeting"
              value={customGreeting}
              onChange={(e) => setCustomGreeting(e.target.value)}
              multiline
              rows={2}
            />
            <Button
              variant="outlined"
              onClick={handleSetGreeting}
              disabled={!isConfigured || !isLoaded || !customGreeting.trim()}
              sx={{ mt: 1 }}
            >
              Set Greeting
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Custom Offline Message"
              value={customOfflineMessage}
              onChange={(e) => setCustomOfflineMessage(e.target.value)}
              multiline
              rows={2}
            />
            <Button
              variant="outlined"
              onClick={handleSetOfflineMessage}
              disabled={!isConfigured || !isLoaded || !customOfflineMessage.trim()}
              sx={{ mt: 1 }}
            >
              Set Offline Message
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Status Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Status Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Widget Status
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={isVisible ? 'Visible' : 'Hidden'}
                    color={isVisible ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={isChatActive ? 'Active' : 'Inactive'}
                    color={isChatActive ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Chat Status
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {getStatusIcon()}
                  <Typography variant="body2">
                    {getStatusText()}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Agent Info
                </Typography>
                {agent ? (
                  <Typography variant="body2">
                    {agent.name || 'Unknown Agent'}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No agent
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Last Event
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lastEvent ? lastEvent.type : 'No events'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Environment Variables Check */}
      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Environment Variables Check
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Make sure these are set in your .env file:
        </Typography>
        
        <Box component="pre" sx={{ 
          bgcolor: 'grey.100', 
          p: 2, 
          borderRadius: 1, 
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
{`NEXT_PUBLIC_TAWK_PROPERTY_ID=your-property-id
NEXT_PUBLIC_TAWK_WIDGET_ID=your-widget-id
NEXT_PUBLIC_TAWK_ENABLED=true
NEXT_PUBLIC_TAWK_POSITION=bottom-right
NEXT_PUBLIC_TAWK_THEME=auto
NEXT_PUBLIC_TAWK_SHOW_MOBILE=true
NEXT_PUBLIC_TAWK_SHOW_DESKTOP=true
NEXT_PUBLIC_TAWK_AUTO_START=false
NEXT_PUBLIC_TAWK_GREETING_MESSAGE=Hello! How can we help you today?
NEXT_PUBLIC_TAWK_OFFLINE_MESSAGE=We are currently offline. Please leave a message.`}
        </Box>
      </Paper>

      {/* Tawk.to Widget */}
      <TawkWidget
        position={widgetPosition}
        theme={widgetTheme}
        showStatus={showStatus}
        showAgent={showAgent}
        showNotifications={showNotifications}
        customGreeting={customGreeting}
        customOfflineMessage={customOfflineMessage}
        onChatStarted={() => console.log('Chat started')}
        onChatEnded={() => console.log('Chat ended')}
        onMessageSent={(message) => console.log('Message sent:', message)}
        onMessageReceived={(message) => console.log('Message received:', message)}
        onWidgetOpened={() => console.log('Widget opened')}
        onWidgetClosed={() => console.log('Widget closed')}
        onAgentJoined={(agent) => console.log('Agent joined:', agent)}
        onAgentLeft={(agent) => console.log('Agent left:', agent)}
      />
    </Container>
  );
}
