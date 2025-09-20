'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  Cloud as CloudIcon,
  Api as ApiIcon,
  Folder as DatabaseIcon,
  Language as LanguageIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  GitHub as GitHubIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import SEO from '@/components/SEO';


const techStack = {
  frontend: [
    { name: 'Next.js 14', version: '14.0.0', description: 'React framework with App Router' },
    { name: 'React', version: '18.2.0', description: 'UI library' },
    { name: 'TypeScript', version: '5.0.0', description: 'Type-safe JavaScript' },
    { name: 'Material-UI', version: '5.14.0', description: 'Component library' },
    { name: 'Tailwind CSS', version: '3.3.0', description: 'Utility-first CSS' },
  ],
  backend: [
    { name: 'Next.js API Routes', version: '14.0.0', description: 'Serverless API endpoints' },
    { name: 'Clerk.js', version: '4.0.0', description: 'Authentication & user management' },
    { name: 'TMDB API', version: '3.0.0', description: 'Movie database integration' },
    { name: 'Google reCAPTCHA', version: 'v3', description: 'Bot protection' },
  ],
  deployment: [
    { name: 'Vercel', version: 'Latest', description: 'Hosting platform' },
    { name: 'Node.js', version: '18.x', description: 'Runtime environment' },
    { name: 'Git', version: '2.40.0', description: 'Version control' },
  ],
  tools: [
    { name: 'ESLint', version: '8.0.0', description: 'Code linting' },
    { name: 'Prettier', version: '3.0.0', description: 'Code formatting' },
    { name: 'TypeScript', version: '5.0.0', description: 'Type checking' },
  ],
};

const features = [
  {
    category: 'Performance',
    icon: <SpeedIcon />,
    items: [
      'Server-side rendering (SSR)',
      'Static site generation (SSG)',
      'Image optimization',
      'Code splitting',
      'Lazy loading',
      'Caching strategies',
    ],
  },
  {
    category: 'Security',
    icon: <SecurityIcon />,
    items: [
      'JWT authentication',
      'reCAPTCHA protection',
      'Rate limiting',
      'Input validation',
      'XSS protection',
      'CSRF protection',
    ],
  },
  {
    category: 'Accessibility',
    icon: <DevicesIcon />,
    items: [
      'WCAG 2.1 compliance',
      'Keyboard navigation',
      'Screen reader support',
      'High contrast mode',
      'Focus indicators',
      'ARIA labels',
    ],
  },
  {
    category: 'Responsive Design',
    icon: <DevicesIcon />,
    items: [
      'Mobile-first approach',
      'Breakpoint system',
      'Touch-friendly interfaces',
      'Adaptive layouts',
      'Cross-browser compatibility',
    ],
  },
];

const apiEndpoints = [
  { method: 'GET', endpoint: '/api/movies/popular', description: 'Get popular movies' },
  { method: 'GET', endpoint: '/api/movies/search', description: 'Search movies' },
  { method: 'GET', endpoint: '/api/movies/{id}', description: 'Get movie details' },
  { method: 'GET', endpoint: '/api/people/trending', description: 'Get trending people' },
  { method: 'GET', endpoint: '/api/tv/trending', description: 'Get trending TV shows' },
  { method: 'POST', endpoint: '/api/auth/signin', description: 'User authentication' },
  { method: 'POST', endpoint: '/api/recaptcha/verify', description: 'Verify reCAPTCHA' },
];

export default function TechSpecsPage() {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const renderTechStack = (category: string, items: any[]) => (
    <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {category}
        </Typography>
        <Stack spacing={2}>
          {items.map((item, index) => (
            <Box key={index}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {item.name}
                </Typography>
                <Chip label={item.version} size="small" color="primary" variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO
        title="Technical Specifications - MovieSearch 2025"
        description="Learn about the technical architecture, tech stack, and implementation details of MovieSearch 2025."
        keywords={['tech specs', 'technical specifications', 'architecture', 'tech stack', 'API', 'development']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="body1" component="p" sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: '14px',
              }}>
                🔧 Technical Specifications
              </Typography>
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Comprehensive technical details about MovieSearch 2025 architecture and implementation
            </Typography>
          </Box>

          {/* Tech Stack */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              🛠️ Technology Stack
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                {renderTechStack('Frontend', techStack.frontend)}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderTechStack('Backend', techStack.backend)}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderTechStack('Deployment', techStack.deployment)}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {renderTechStack('Development Tools', techStack.tools)}
              </Grid>
            </Grid>
          </Box>

          {/* Features */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              ⚡ Key Features & Capabilities
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Box sx={{ color: 'primary.main' }}>{feature.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {feature.category}
                        </Typography>
                      </Stack>
                      <List dense>
                        {feature.items.map((item, itemIndex) => (
                          <ListItem key={itemIndex} disableGutters>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={item} 
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* API Documentation */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              🔌 API Endpoints
            </Typography>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ApiIcon />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    RESTful API Documentation
                  </Typography>
                </Stack>
              </Box>
              <Box sx={{ p: 0 }}>
                {apiEndpoints.map((endpoint, index) => (
                  <Box key={index}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip 
                          label={endpoint.method} 
                          color={endpoint.method === 'GET' ? 'success' : 'primary'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                          {endpoint.endpoint}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {endpoint.description}
                        </Typography>
                      </Stack>
                      <Tooltip title={copiedText === endpoint.endpoint ? 'Copied!' : 'Copy endpoint'}>
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(endpoint.endpoint)}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {index < apiEndpoints.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Architecture Details */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              🏗️ Architecture Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <CloudIcon sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Frontend Architecture
                      </Typography>
                    </Stack>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Next.js App Router" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Server-side rendering" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Component-based architecture" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Responsive design system" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ height: '100%', borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <DatabaseIcon sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Backend Architecture
                      </Typography>
                    </Stack>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Serverless API routes" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="External API integration" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Authentication middleware" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary="Rate limiting & security" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Performance Metrics */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              📊 Performance Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ textAlign: 'center', borderRadius: 3 }}>
                  <CardContent>
                    <SpeedIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                      &lt; 2s
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Page Load Time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ textAlign: 'center', borderRadius: 3 }}>
                  <CardContent>
                    <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      95+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lighthouse Score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ textAlign: 'center', borderRadius: 3 }}>
                  <CardContent>
                    <DevicesIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      100%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mobile Responsive
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={3} sx={{ textAlign: 'center', borderRadius: 3 }}>
                  <CardContent>
                    <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      A+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Security Rating
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Development Info */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              👨‍💻 Development Information
            </Typography>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🚀 Getting Started
                  </Typography>
                  <List dense>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="Node.js 18+ required" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="npm install for dependencies" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="Environment variables setup" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="npm run dev for development" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📝 Code Quality
                  </Typography>
                  <List dense>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="TypeScript for type safety" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="ESLint for code linting" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="Prettier for formatting" />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText primary="Component documentation" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Contact for Technical Support */}
          <Box sx={{ textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Need Technical Support?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                For technical questions, API access, or development inquiries, contact our development team.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<LinkIcon />}
                  component={Link}
                  href="/contact"
                  sx={{ borderRadius: 8 }}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<GitHubIcon />}
                  href="#"
                  sx={{ borderRadius: 8, borderColor: 'white', color: 'white' }}
                >
                  View Source
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </>
  );
}
