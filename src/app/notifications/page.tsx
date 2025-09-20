'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Movie as MovieIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';
import EnhancedLoading from '@/components/EnhancedLoading';
import SEO from '@/components/SEO';

export const dynamic = 'force-dynamic';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'movie' | 'rating' | 'follow' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New Movie Recommendation',
      message: 'Check out "The Matrix Resurrections" - it matches your preferences!',
      type: 'movie',
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: '/movie/624860',
    },
    {
      id: '2',
      title: 'Rating Update',
      message: 'Your rating for "Inception" has been updated to 5 stars.',
      type: 'rating',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '3',
      title: 'New Follower',
      message: 'John Doe started following you.',
      type: 'follow',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: '4',
      title: 'System Update',
      message: 'New features have been added to MovieSearch. Check them out!',
      type: 'system',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
  ];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    loadNotifications();
  }, [isLoaded, user, router]);

  const loadNotifications = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <MovieIcon />;
      case 'rating':
        return <StarIcon />;
      case 'follow':
        return <PersonIcon />;
      case 'system':
        return <SettingsIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'primary';
      case 'rating':
        return 'warning';
      case 'follow':
        return 'success';
      case 'system':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isLoaded) {
    return <EnhancedLoading message="Loading..." fullScreen />;
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  return (
    <>
      <SEO
        title="Notifications - MovieSearch 2025"
        description="Manage your notifications and stay updated with the latest movie recommendations and updates."
        keywords={['notifications', 'alerts', 'movie updates', 'recommendations']}
      />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="fade-in">
            Notifications
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in stagger-1">
            Stay updated with your movie recommendations and account activity
          </Typography>
        </Box>

        {/* Notification Settings */}
        <Card sx={{ mb: 4 }} className="fade-in stagger-2">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                }
                label="Push Notifications"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="fade-in stagger-3">
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Notifications
                {unreadCount > 0 && (
                  <Badge badgeContent={unreadCount} color="primary" sx={{ ml: 2 }}>
                    <NotificationsIcon />
                  </Badge>
                )}
              </Typography>
              {unreadCount > 0 && (
                <IconButton onClick={markAllAsRead} color="primary">
                  <MarkReadIcon />
                </IconButton>
              )}
            </Box>

            {loading ? (
              <EnhancedLoading type="default" message="Loading notifications..." />
            ) : notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No notifications yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You'll receive notifications about movie recommendations and account activity here.
                </Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      className="fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      sx={{
                        bgcolor: notification.read ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.type}
                              size="small"
                              color={getNotificationColor(notification.type) as any}
                            />
                            {!notification.read && (
                              <Chip label="New" size="small" color="primary" variant="outlined" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!notification.read && (
                            <IconButton
                              size="small"
                              onClick={() => markAsRead(notification.id)}
                              color="primary"
                            >
                              <MarkReadIcon />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => deleteNotification(notification.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}