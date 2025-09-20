'use client';

import React from 'react';

// Prevent static generation
export const dynamic = 'force-dynamic';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  Accessibility as AccessibilityIcon,
  Shield as ShieldIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

import SEO from '@/components/SEO';
import GradientHeading from '@/components/GradientHeading';
// PageLayout is already provided by AdminLayoutWrapper

export default function AboutPage() {
  const features = [
    {
      icon: <MovieIcon />,
      title: 'Comprehensive Movie Database',
      description: 'Access to millions of movies with detailed information, ratings, and reviews.',
    },
    {
      icon: <StarIcon />,
      title: 'Personalized Recommendations',
      description: 'Get movie suggestions based on your preferences and viewing history.',
    },
    {
      icon: <PeopleIcon />,
      title: 'Community Features',
      description: 'Share your favorite movies, create watchlists, and connect with other movie lovers.',
    },
    {
      icon: <CodeIcon />,
      title: 'Modern Technology',
      description: 'Built with Next.js, React, and Material-UI for the best user experience.',
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security measures.',
    },
    {
      icon: <SpeedIcon />,
      title: 'Fast & Responsive',
      description: 'Optimized for speed with server-side rendering and efficient caching.',
    },
    {
      icon: <PaletteIcon />,
      title: 'Beautiful Design',
      description: 'Clean, modern interface that works perfectly on all devices.',
    },
    {
      icon: <AccessibilityIcon />,
      title: 'Accessibility First',
      description: 'Designed with accessibility in mind, supporting all users.',
    },
  ];

  const stats = [
    { label: 'Movies', value: '500K+', icon: <MovieIcon /> },
    { label: 'Users', value: '10K+', icon: <PeopleIcon /> },
    { label: 'Reviews', value: '1M+', icon: <StarIcon /> },
    { label: 'Countries', value: '190+', icon: <ShieldIcon /> },
  ];

  const team = [
    {
      name: 'Naushad Alam',
      role: 'Founder & Developer',
      email: 'naushadnaushad7777@gmail.com',
      phone: '+91 7492068998',
      avatar: '👨‍💻',
    },
  ];

  return (
    <>
      <SEO
        title="About MovieSearch 2025"
        description="Learn about MovieSearch 2025 - the ultimate movie discovery platform. Built with modern technology and designed for movie lovers worldwide."
        keywords={['about', 'moviesearch', 'movie database', 'movie discovery', 'cinema', 'movies']}
      />
      <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              🎬 About MovieSearch 2025
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
              The ultimate movie discovery platform built for movie lovers worldwide. 
              Discover, explore, and enjoy your favorite films with our comprehensive database and personalized features.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Chip label="Modern Technology" color="primary" />
              <Chip label="User-Friendly" color="secondary" />
              <Chip label="Accessibility First" color="success" />
              <Chip label="Secure & Private" color="info" />
            </Stack>
          </Box>

          {/* Stats Section */}
          <Paper elevation={3} sx={{ p: 4, mb: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Our Impact
            </Typography>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Features Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
              Why Choose MovieSearch 2025?
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%', transition: 'transform 0.3s ease', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
              Our Team
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {team.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: '3rem' }}>
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {member.role}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        📧 {member.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📱 {member.phone}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Mission Section */}
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Our Mission
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
              To create the most comprehensive, user-friendly, and accessible movie discovery platform that connects 
              movie lovers worldwide. We believe that everyone should have easy access to discover, explore, and enjoy 
              the magic of cinema, regardless of their background or abilities.
            </Typography>
          </Paper>

          {/* Contact Section */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Get in Touch
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Chip 
                label="naushadnaushad7777@gmail.com" 
                icon={<FavoriteIcon />} 
                color="primary" 
                clickable
                onClick={() => window.open('mailto:naushadnaushad7777@gmail.com')}
              />
              <Chip 
                label="+91 7492068998" 
                icon={<FavoriteIcon />} 
                color="secondary" 
                clickable
                onClick={() => window.open('tel:+917492068998')}
              />
            </Stack>
          </Box>
        </Container>
      </>
  );
}