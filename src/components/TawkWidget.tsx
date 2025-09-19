'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Fade,
  Zoom,
  Tooltip,
  Badge,
  Stack,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  Person as PersonIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
} from '@mui/icons-material';
import { useTawk } from '@/hooks/useTawk';

interface TawkWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  showAgent?: boolean;
  customGreeting?: string;
  customOfflineMessage?: string;
  notificationsEnabled?: boolean;
  onChatStart?: () => void;
  onChatEnd?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function TawkWidget({
  position = 'bottom-right',
  theme = 'light',
  showAgent = true,
  customGreeting,
  customOfflineMessage,
  notificationsEnabled = true,
  onChatStart,
  onChatEnd,
  onMinimize,
  onMaximize,
}: TawkWidgetProps) {
  const {
    isVisible,
    isExpanded,
    isMinimized,
    chatStatus,
    unreadCount,
    agent,
    show,
    hide,
    toggle,
    minimize,
    maximize,
    startChat,
    endChat,
  } = useTawk();

  const [isChatActive, setIsChatActive] = useState(false);

  useEffect(() => {
    // Initialize Tawk.to widget
    show();
  }, [show]);

  const handleToggle = () => {
    toggle();
    if (isExpanded) {
      onMinimize?.();
    } else {
      onMaximize?.();
    }
  };

  const handleMinimize = () => {
    minimize();
    onMinimize?.();
  };

  const handleStartChat = () => {
    startChat();
    setIsChatActive(true);
    onChatStart?.();
  };

  const handleEndChat = () => {
    endChat();
    setIsChatActive(false);
    onChatEnd?.();
  };

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 9999,
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyles, bottom: 20, left: 20 };
      case 'top-right':
        return { ...baseStyles, top: 20, right: 20 };
      case 'top-left':
        return { ...baseStyles, top: 20, left: 20 };
      case 'bottom-right':
      default:
        return { ...baseStyles, bottom: 20, right: 20 };
    }
  };

  return (
    <Box sx={getPositionStyles()}>
      {/* Chat Widget */}
      <Fade in={isVisible || isExpanded} timeout={300}>
        <Box>
          {isExpanded ? (
            <Paper
              elevation={8}
              sx={{
                width: 350,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: theme === 'dark' ? 'grey.900' : 'white',
                color: theme === 'dark' ? 'white' : 'text.primary',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Chat Support
                </Typography>
                <Stack direction="row" spacing={1}>
                  {notificationsEnabled && (
                    <Tooltip title="Toggle Notifications">
                      <IconButton size="small" sx={{ color: 'white' }}>
                        {notificationsEnabled ? <NotificationsIcon /> : <NotificationsOffIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Minimize">
                    <IconButton size="small" onClick={handleMinimize} sx={{ color: 'white' }}>
                      <MinimizeIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Close">
                    <IconButton size="small" onClick={hide} sx={{ color: 'white' }}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Agent Info */}
              {showAgent && agent && (
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={agent.avatar} alt={agent.name}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{agent.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {agent.title || 'Support Agent'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* Chat Area */}
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                {!isChatActive ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      {customGreeting || 'Hello! How can we help you today?'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {chatStatus === 'offline' 
                        ? (customOfflineMessage || 'We are currently offline. Please leave a message and we will get back to you soon.')
                        : 'Click the button below to start a conversation with our support team.'
                      }
                    </Typography>
                    {chatStatus !== 'offline' && (
                      <IconButton
                        variant="contained"
                        onClick={handleStartChat}
                        sx={{ mt: 2 }}
                      >
                        <ChatIcon />
                        Start Chat
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Chat started! You can now send messages.
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                      Chat is active. Send a message to get started.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Footer */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" disabled>
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton size="small" disabled>
                    <EmojiIcon />
                  </IconButton>
                  <IconButton size="small" disabled>
                    <SettingsIcon />
                  </IconButton>
                  {isChatActive && (
                    <IconButton
                      size="small"
                      onClick={handleEndChat}
                      color="error"
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            </Paper>
          ) : (
            <Zoom in={!isMinimized} timeout={300}>
              <Tooltip title="Open Chat Support">
                <IconButton
                  onClick={handleToggle}
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    boxShadow: 3,
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <ChatIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Zoom>
          )}
        </Box>
      </Fade>

      {/* Minimized State */}
      {isMinimized && !isExpanded && (
        <Zoom in={isMinimized} timeout={300}>
          <Tooltip title="Restore Chat">
            <IconButton
              onClick={maximize}
              sx={{
                width: 50,
                height: 50,
                bgcolor: 'grey.600',
                color: 'white',
                '&:hover': {
                  bgcolor: 'grey.700',
                },
                boxShadow: 2,
              }}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </Zoom>
      )}
    </Box>
  );
}