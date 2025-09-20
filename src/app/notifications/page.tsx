'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  IconButton,
  Divider,
  Alert,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Person as PersonIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface Notification {
  id: string;
  type: 'movie' | 'tv' | 'person' | 'system' | 'recommendation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  imageUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'movie',
    title: 'New Movie Release',
    message: 'The new movie "Avatar: The Way of Water" is now available to watch!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/movie/76600',
    imageUrl: '/placeholder-movie.jpg',
  },
  {
    id: '2',
    type: 'tv',
    title: 'New Episode Available',
    message: 'New episode of "Stranger Things" season 4 is now streaming.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    actionUrl: '/tv/66732',
    imageUrl: '/placeholder-movie.jpg',
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Recommended for You',
    message: 'Based on your watchlist, you might like "The Mandalorian".',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionUrl: '/tv/82856',
    imageUrl: '/placeholder-movie.jpg',
  },
  {
    id: '4',
    type: 'system',
    title: 'Welcome to MovieSearch!',
    message: 'Thank you for joining MovieSearch 2025. Start exploring movies and TV shows!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];

export default function NotificationsPage() {
  const { user, isLoaded } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tabValue, setTabValue] = useState(0);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <MovieIcon />;
      case 'tv':
        return <TvIcon />;
      case 'person':
        return <PersonIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'primary';
      case 'tv':
        return 'secondary';
      case 'person':
        return 'success';
      case 'recommendation':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Unread
        return !notification.read;
      case 2: // Movies
        return notification.type === 'movie';
      case 3: // TV Shows
        return notification.type === 'tv';
      default:
        return true;
    }
  });

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
          Please sign in to view your notifications.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with your favorite movies and TV shows
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            href="/settings"
          >
            Settings
          </Button>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  All
                </Badge>
              } 
            />
            <Tab label="Unread" />
            <Tab label="Movies" />
            <Tab label="TV Shows" />
          </Tabs>
        </Box>

        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tabValue === 1 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
              }
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.type.toUpperCase()} 
                          size="small" 
                          color={getNotificationColor(notification.type) as any}
                          variant="outlined"
                        />
                        {!notification.read && (
                          <Chip label="NEW" size="small" color="error" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <MarkReadIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteNotification(notification.id)}
                      title="Delete notification"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Container>
  );
}
