'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  alpha,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Favorite as FavoriteIcon,
  Bookmark as BookmarkIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Movie as MovieIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Accessibility as AccessibilityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { getSearchHistory, clearSearchHistory } from '@/lib/storage';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import RateLimitStatus from './RateLimitStatus';
import AccessibilityCenter from './AccessibilityCenter';

interface HeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export default function Header({ onSearch, showSearch = true }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchHistoryOpen, setSearchHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  // Graceful handling of Clerk hooks in case API keys are not configured
  let user, isSignedIn, signOut;
  try {
    const clerkData = useUser();
    const clerkActions = useClerk();
    user = clerkData.user;
    isSignedIn = clerkData.isSignedIn;
    signOut = clerkActions.signOut;
  } catch (error) {
    // Fallback when Clerk is not configured
    user = null;
    isSignedIn = false;
    signOut = () => {};
  }

  React.useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);


  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchHistoryClick = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    setSearchHistoryOpen(false);
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  // Essential navigation items - most important pages in header
  const navigationItems = [
    { text: 'Home', icon: <MovieIcon />, path: '/' },
    { text: 'Popular', icon: <TrendingUpIcon />, path: '/popular' },
    { text: 'Top Rated', icon: <StarIcon />, path: '/top-rated' },
    { text: 'Now Playing', icon: <PlayIcon />, path: '/now-playing' },
    { text: 'Trending', icon: <TrendingUpIcon />, path: '/trending' },
    { text: 'Genres', icon: <MovieIcon />, path: '/genres' },
    { text: 'Actors', icon: <AccountIcon />, path: '/actors' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
  ];

  const userMenuItems = [
    { text: 'My Profile', icon: <AccountIcon />, path: '/profile' },
    { text: 'Favorites', icon: <FavoriteIcon />, path: '/favorites' },
    { text: 'Watchlist', icon: <BookmarkIcon />, path: '/watchlist' },
    { text: 'Search History', icon: <HistoryIcon />, path: '/history' },
    { text: 'Account Settings', icon: <SettingsIcon />, path: '/profile/manage' },
  ];

  const handleSignOut = () => {
    signOut();
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => router.push('/')}
          >
            <MovieIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              MovieSearch 2025
            </Typography>
          </Box>

          {/* Global Search */}
          {showSearch && (
            <Box sx={{ 
              width: '100%', 
              maxWidth: { xs: '100%', sm: 400, md: 500 },
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
              },
              [theme.breakpoints.down('md')]: {
                order: 3,
                width: '100%',
                mt: 1,
              },
            }}>
              <GlobalSearch 
                placeholder={isMobile ? "Search movies..." : "Search movies, actors, directors..."}
                onClose={() => setSearchHistoryOpen(false)}
              />
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navigationItems.slice(1).map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => router.push(item.path)}
                  startIcon={item.icon}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Accessibility Center */}
          <Tooltip title="Accessibility Settings">
            <IconButton
              color="inherit"
              onClick={() => setAccessibilityOpen(true)}
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                }
              }}
            >
              <AccessibilityIcon />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Rate Limit Status */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <RateLimitStatus compact />
          </Box>

          {/* User Menu */}
          {isSignedIn ? (
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                src={user?.imageUrl}
                alt={user?.fullName || 'User'}
              >
                {!user?.imageUrl && <AccountIcon />}
              </Avatar>
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
              <Button
                color="inherit"
                onClick={() => router.push('/sign-in')}
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                Sign In
              </Button>
              <Button
                color="inherit"
                onClick={() => router.push('/sign-up')}
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.2),
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileMenuToggle}
            sx={{ ml: 1, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => {
              router.push(item.path);
              handleProfileMenuClose();
            }}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.1),
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        onOpen={() => setMobileMenuOpen(true)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Menu
            </Typography>
            <IconButton onClick={handleMobileMenuToggle} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {navigationItems.map((item) => (
              <ListItem
                key={item.text}
                component="button"
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: 'white' }} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1, px: 2 }}>
            My Account
          </Typography>
          <List>
            {userMenuItems.map((item) => (
              <ListItem
                key={item.text}
                component="button"
                onClick={() => {
                  router.push(item.path);
                  setMobileMenuOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: 'white' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>

      {/* Search History Dropdown */}
      {searchHistoryOpen && searchHistory.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1300,
            width: '90%',
            maxWidth: 500,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Recent Searches
            </Typography>
          </Box>
          <List>
            {searchHistory.slice(0, 5).map((query, index) => (
              <ListItem
                key={index}
                component="button"
                onClick={() => handleSearchHistoryClick(query)}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.05),
                  }
                }}
              >
                <ListItemIcon>
                  <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={query} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Button
              size="small"
              onClick={handleClearHistory}
              sx={{ width: '100%' }}
            >
              Clear History
            </Button>
          </Box>
        </Box>
      )}

      {/* Accessibility Center */}
      <AccessibilityCenter 
        open={accessibilityOpen} 
        onClose={() => setAccessibilityOpen(false)}
      />
    </>
  );
}
