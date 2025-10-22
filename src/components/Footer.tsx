'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Stack,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  Button,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  GitHub as GitHubIcon,
  Favorite as FavoriteIcon,
  Map as SitemapIcon,
} from '@mui/icons-material';
import SitemapSection from './SitemapSection';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIP, setCurrentIP] = useState<string>('Loading...');
  const [buildVersion, setBuildVersion] = useState<string>('2.0.0');
  const [buildTime, setBuildTime] = useState<string>('');
  const [showSitemap, setShowSitemap] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Get build version from environment variables
    const version = process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0';
    setBuildVersion(version);
    
    // Set build time
    setBuildTime(new Date().toLocaleString());

    // Get current IP address with fallback
    const fetchIP = async () => {
      try {
        const ipServices = [
          'https://api.ipify.org?format=json',
          'https://ipapi.co/json/',
        ];

        for (const service of ipServices) {
          try {
            const response = await fetch(service, { 
              headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
              const data = await response.json();
              const ip = data.ip || data.query || data.ip_address;
              if (ip) {
                setCurrentIP(ip);
                return;
              }
            }
          } catch (serviceError) {
            continue;
          }
        }
        
        setCurrentIP('Unable to detect');
      } catch (error) {
        setCurrentIP('Unknown');
      }
    };

    fetchIP();
  }, []);

  const footerLinks = {
    'Movies': [
      { text: 'Popular Movies', href: '/popular' },
      { text: 'Top Rated', href: '/top-rated' },
      { text: 'Now Playing', href: '/now-playing' },
      { text: 'Trending', href: '/trending' },
      { text: 'Upcoming', href: '/upcoming' },
      { text: 'Genres', href: '/genres' },
    ],
    'Discover': [
      { text: 'Actors', href: '/person' },
      { text: 'Directors', href: '/person' },
      { text: 'Studios', href: '/studios' },
      { text: 'Collections', href: '/collections' },
      { text: 'Awards', href: '/awards' },
      { text: 'Festivals', href: '/festivals' },
    ],
    'Account': [
      { text: 'My Profile', href: '/profile' },
      { text: 'Favorites', href: '/favorites' },
      { text: 'Watchlist', href: '/watchlist' },
      { text: 'Search History', href: '/history' },
      { text: 'My Stats', href: '/stats' },
    ],
    'Browse': [
      { text: 'Classics', href: '/classics' },
      { text: 'Indie Films', href: '/indie-films' },
      { text: 'Box Office', href: '/box-office' },
      { text: 'Streaming', href: '/streaming' },
      { text: 'Languages', href: '/languages' },
      { text: 'Decades', href: '/decades' },
    ],
    'Support': [
      { text: 'About Us', href: '/about' },
      { text: 'Contact', href: '/contact' },
      { text: 'Feature Request', href: '/feature-request' },
      { text: 'Feedback', href: '/feedback' },
      { text: 'Help Center', href: '/help' },
      { text: 'Privacy Policy', href: '/privacy' },
      { text: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        mt: 'auto',
        py: 6,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <MovieIcon sx={{ fontSize: 32, color: 'white' }} />
                <Typography variant="h5" component="h2" sx={{ 
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  MovieSearch 2025
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                mb: 3
              }}>
                The ultimate movie discovery platform built for movie lovers worldwide. 
                Discover, explore, and enjoy your favorite films with our comprehensive database.
              </Typography>
              
              {/* Contact Info */}
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmailIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Link 
                    href="mailto:naushadnaushad7777@gmail.com" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    naushadnaushad7777@gmail.com
                  </Link>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PhoneIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Link 
                    href="tel:+917492068998" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    +91 7492068998
                  </Link>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GitHubIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Link 
                    href="https://github.com/yourusername/MovieSearch2025" 
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      '&:hover': { color: 'white' }
                    }}
                  >
                    View on GitHub
                  </Link>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {Object.entries(footerLinks).map(([category, links]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    mb: 2
                  }}>
                    {category}
                  </Typography>
                  <Stack spacing={1}>
                    {links.map((link) => (
                      <Link
                        key={link.text}
                        href={link.href}
                        sx={{
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
                        {link.text}
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Sitemap Section */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<SitemapIcon />}
                onClick={() => setShowSitemap(!showSitemap)}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {showSitemap ? 'Hide' : 'Show'} Complete Site Map
              </Button>
              <Button
                variant="outlined"
                startIcon={<SitemapIcon />}
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                XML Sitemap
              </Button>
            </Stack>
          </Box>
          
          <Collapse in={showSitemap}>
            <SitemapSection />
          </Collapse>
        </Box>

        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.2)',
          my: 4 
        }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'center' : 'flex-end',
          gap: 2
        }}>
          <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 1
            }}>
              © {currentYear} MovieSearch 2025. Made with{' '}
              <FavoriteIcon sx={{ fontSize: 14, color: '#ff6b6b', mx: 0.5 }} />
              {' '}by Naushad Alam. All rights reserved.
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem'
            }}>
              Build v{buildVersion} | IP: {currentIP} | Enhanced Security ✓
            </Typography>
          </Box>

          {/* GitHub Link */}
          <Stack direction="row" spacing={1}>
            <IconButton
              href="https://github.com/yourusername/MovieSearch2025"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              aria-label="GitHub Repository"
            >
              <GitHubIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
