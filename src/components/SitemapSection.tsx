'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Link,
  Stack,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  AccountCircle as AccountIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Theaters as TheaterIcon,
  Language as LanguageIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

interface SitemapLink {
  text: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface SitemapCategory {
  title: string;
  icon: React.ReactNode;
  links: SitemapLink[];
  description?: string;
}

export default function SitemapSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const sitemapData: SitemapCategory[] = [
    {
      title: 'Movies & Entertainment',
      icon: <MovieIcon />,
      description: 'Discover movies, TV shows, and entertainment content',
      links: [
        { text: 'Popular Movies', href: '/popular', icon: <TrendingIcon />, description: 'Most popular movies right now', priority: 'high' },
        { text: 'Top Rated Movies', href: '/top-rated', icon: <StarIcon />, description: 'Highest rated movies of all time', priority: 'high' },
        { text: 'Now Playing', href: '/now-playing', icon: <TheaterIcon />, description: 'Movies currently in theaters', priority: 'high' },
        { text: 'Upcoming Movies', href: '/upcoming', icon: <TimelineIcon />, description: 'Coming soon to theaters', priority: 'medium' },
        { text: 'Movie Genres', href: '/genres', icon: <CategoryIcon />, description: 'Browse movies by genre', priority: 'medium' },
        { text: 'Movie Collections', href: '/collections', icon: <MovieIcon />, description: 'Curated movie collections', priority: 'low' },
      ],
    },
    {
      title: 'People & Cast',
      icon: <PersonIcon />,
      description: 'Explore actors, directors, and film industry professionals',
      links: [
        { text: 'Popular Actors', href: '/actors', icon: <PersonIcon />, description: 'Most popular actors and actresses', priority: 'high' },
        { text: 'Famous Directors', href: '/directors', icon: <PersonIcon />, description: 'Renowned film directors', priority: 'medium' },
        { text: 'Film Crew', href: '/crew', icon: <PersonIcon />, description: 'Cinematographers, writers, and more', priority: 'low' },
        { text: 'Celebrity News', href: '/celebrity-news', icon: <PublicIcon />, description: 'Latest celebrity updates', priority: 'low' },
      ],
    },
    {
      title: 'Discovery & Search',
      icon: <SearchIcon />,
      description: 'Find and explore content with advanced search',
      links: [
        { text: 'Advanced Search', href: '/search', icon: <SearchIcon />, description: 'Search movies, actors, and more', priority: 'high' },
        { text: 'Trending Now', href: '/trending', icon: <TrendingIcon />, description: 'What\'s trending today', priority: 'high' },
        { text: 'Movie Recommendations', href: '/recommendations', icon: <StarIcon />, description: 'Personalized movie suggestions', priority: 'medium' },
        { text: 'Similar Movies', href: '/similar', icon: <MovieIcon />, description: 'Find movies similar to your favorites', priority: 'medium' },
        { text: 'Movie Reviews', href: '/reviews', icon: <StarIcon />, description: 'Read and write movie reviews', priority: 'low' },
      ],
    },
    {
      title: 'User Account',
      icon: <AccountIcon />,
      description: 'Manage your profile and preferences',
      links: [
        { text: 'My Profile', href: '/profile', icon: <AccountIcon />, description: 'View and edit your profile', priority: 'high' },
        { text: 'My Favorites', href: '/favorites', icon: <StarIcon />, description: 'Your favorite movies and shows', priority: 'high' },
        { text: 'Watchlist', href: '/watchlist', icon: <MovieIcon />, description: 'Movies you want to watch', priority: 'high' },
        { text: 'Search History', href: '/history', icon: <TimelineIcon />, description: 'Your recent searches', priority: 'medium' },
        { text: 'Account Settings', href: '/settings', icon: <AccountIcon />, description: 'Manage your account preferences', priority: 'medium' },
        { text: 'Notifications', href: '/notifications', icon: <PublicIcon />, description: 'Your notification preferences', priority: 'low' },
      ],
    },
    {
      title: 'Browse by Category',
      icon: <CategoryIcon />,
      description: 'Explore content by different categories',
      links: [
        { text: 'Action Movies', href: '/genre/action', icon: <MovieIcon />, description: 'High-octane action films', priority: 'medium' },
        { text: 'Comedy Movies', href: '/genre/comedy', icon: <MovieIcon />, description: 'Funny and entertaining films', priority: 'medium' },
        { text: 'Drama Movies', href: '/genre/drama', icon: <MovieIcon />, description: 'Compelling dramatic stories', priority: 'medium' },
        { text: 'Horror Movies', href: '/genre/horror', icon: <MovieIcon />, description: 'Scary and thrilling films', priority: 'medium' },
        { text: 'Romance Movies', href: '/genre/romance', icon: <MovieIcon />, description: 'Love stories and romantic films', priority: 'medium' },
        { text: 'Sci-Fi Movies', href: '/genre/sci-fi', icon: <MovieIcon />, description: 'Science fiction adventures', priority: 'medium' },
        { text: 'Documentaries', href: '/genre/documentary', icon: <MovieIcon />, description: 'Real-world stories and facts', priority: 'low' },
        { text: 'Animated Movies', href: '/genre/animation', icon: <MovieIcon />, description: 'Animated films for all ages', priority: 'low' },
      ],
    },
    {
      title: 'Support & Information',
      icon: <SupportIcon />,
      description: 'Get help and learn more about our platform',
      links: [
        { text: 'About Us', href: '/about', icon: <PublicIcon />, description: 'Learn about MovieSearch 2025', priority: 'medium' },
        { text: 'Contact Us', href: '/contact', icon: <SupportIcon />, description: 'Get in touch with our team', priority: 'medium' },
        { text: 'Help Center', href: '/help', icon: <SupportIcon />, description: 'Find answers to common questions', priority: 'medium' },
        { text: 'Bug Report', href: '/bug-report', icon: <SupportIcon />, description: 'Report issues or bugs', priority: 'low' },
        { text: 'Feature Request', href: '/feature-request', icon: <SupportIcon />, description: 'Suggest new features', priority: 'low' },
        { text: 'API Documentation', href: '/api-docs', icon: <PublicIcon />, description: 'Developer API documentation', priority: 'low' },
      ],
    },
    {
      title: 'Legal & Privacy',
      icon: <SecurityIcon />,
      description: 'Important legal information and policies',
      links: [
        { text: 'Privacy Policy', href: '/privacy', icon: <SecurityIcon />, description: 'How we protect your privacy', priority: 'high' },
        { text: 'Terms of Service', href: '/terms', icon: <SecurityIcon />, description: 'Terms and conditions', priority: 'high' },
        { text: 'Cookie Policy', href: '/cookies', icon: <SecurityIcon />, description: 'Our cookie usage policy', priority: 'medium' },
        { text: 'GDPR Compliance', href: '/gdpr', icon: <SecurityIcon />, description: 'Data protection compliance', priority: 'medium' },
        { text: 'Accessibility Statement', href: '/accessibility', icon: <SecurityIcon />, description: 'Accessibility commitment', priority: 'low' },
        { text: 'DMCA Policy', href: '/dmca', icon: <SecurityIcon />, description: 'Copyright protection policy', priority: 'low' },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return '';
    }
  };

  if (isMobile) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" sx={{ 
          fontWeight: 'bold',
          color: 'white',
          mb: 3,
          textAlign: 'center'
        }}>
          Site Map
        </Typography>
        
        {sitemapData.map((category) => (
          <Accordion
            key={category.title}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              mb: 1,
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                margin: '0 0 8px 0',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 1,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {category.icon}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {category.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 2
              }}>
                {category.description}
              </Typography>
              <Stack spacing={1}>
                {category.links.map((link) => (
                  <Link
                    key={link.text}
                    href={link.href}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.icon}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {link.text}
                      </Typography>
                      {link.description && (
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.75rem'
                        }}>
                          {link.description}
                        </Typography>
                      )}
                    </Box>
                  </Link>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" sx={{ 
        fontWeight: 'bold',
        color: 'white',
        mb: 3,
        textAlign: 'center'
      }}>
        Complete Site Map
      </Typography>
      
      <Grid container spacing={3}>
        {sitemapData.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.title}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                p: 3,
                height: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                {category.icon}
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {category.title}
                </Typography>
              </Stack>
              
              {category.description && (
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 2,
                  fontSize: '0.85rem'
                }}>
                  {category.description}
                </Typography>
              )}
              
              <Stack spacing={1}>
                {category.links.map((link) => (
                  <Link
                    key={link.text}
                    href={link.href}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        textDecoration: 'none',
                      },
                    }}
                  >
                    {link.icon}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {link.text}
                      </Typography>
                      {link.description && (
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.75rem',
                          display: 'block'
                        }}>
                          {link.description}
                        </Typography>
                      )}
                    </Box>
                    {link.priority && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: getPriorityColor(link.priority),
                          title: getPriorityLabel(link.priority),
                        }}
                      />
                    )}
                  </Link>
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
