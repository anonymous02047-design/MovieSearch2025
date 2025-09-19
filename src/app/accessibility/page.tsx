'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Visibility as VisibilityIcon,
  Hearing as HearingIcon,
  TouchApp as TouchIcon,
  Keyboard as KeyboardIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

export default function AccessibilityStatementPage() {
  const accessibilityFeatures = [
    {
      category: 'Visual Accessibility',
      icon: <VisibilityIcon />,
      features: [
        'High contrast mode support',
        'Adjustable text sizes',
        'Color-blind friendly palettes',
        'Screen reader compatibility',
        'Alternative text for images',
        'Focus indicators',
      ],
    },
    {
      category: 'Motor Accessibility',
      icon: <TouchIcon />,
      features: [
        'Keyboard navigation support',
        'Large click targets',
        'Voice control compatibility',
        'Switch navigation support',
        'Touch-friendly interfaces',
        'Reduced motion options',
      ],
    },
    {
      category: 'Cognitive Accessibility',
      icon: <SpeedIcon />,
      features: [
        'Clear navigation structure',
        'Consistent design patterns',
        'Reading assistance tools',
        'Simplified interfaces',
        'Error prevention',
        'Task guidance',
      ],
    },
    {
      category: 'Auditory Accessibility',
      icon: <HearingIcon />,
      features: [
        'Visual alternatives to audio',
        'Caption support for videos',
        'Visual notifications',
        'Text-based communication',
        'Volume controls',
        'Audio descriptions',
      ],
    },
  ];

  const standards = [
    'WCAG 2.1 AA Compliance',
    'Section 508 Standards',
    'ADA Compliance',
    'EN 301 549 Standards',
    'ISO/IEC 40500 Guidelines',
  ];

  return (
    <>
      <SEO
        title="Accessibility Statement - MovieSearch 2025"
        description="MovieSearch 2025 is committed to providing an accessible and inclusive experience for all users. Learn about our accessibility features and compliance."
        keywords={['accessibility', 'inclusive design', 'WCAG compliance', 'disability support', 'assistive technology']}
      />
      <RecaptchaProtection action="accessibility" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
              textAlign: 'center',
              lineHeight: 1.2,
              wordBreak: 'break-word',
              overflow: 'visible',
              whiteSpace: 'nowrap',
            }}>
              ♿ Accessibility Statement
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              MovieSearch 2025 is committed to ensuring digital accessibility for all users, including those with disabilities.
            </Typography>
          </Box>

          {/* Commitment */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Commitment
            </Typography>
            <Typography variant="body1" paragraph>
              We believe that everyone should have equal access to information and services online. 
              MovieSearch 2025 is committed to providing an accessible and inclusive experience for all users, 
              regardless of their abilities or the technologies they use to access our website.
            </Typography>
            <Typography variant="body1">
              We continuously work to improve the accessibility of our platform and ensure compliance 
              with international accessibility standards.
            </Typography>
          </Paper>

          {/* Accessibility Features */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyboardIcon color="primary" />
              Accessibility Features
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {accessibilityFeatures.map((category, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {category.icon}
                        <Typography variant="h6" component="h3">
                          {category.category}
                        </Typography>
                      </Box>
                      <List dense>
                        {category.features.map((feature, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckIcon color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Standards Compliance */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Standards Compliance
            </Typography>
            <Typography variant="body1" paragraph>
              Our website strives to conform to the following accessibility standards:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {standards.map((standard, index) => (
                <Chip
                  key={index}
                  label={standard}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Paper>

          {/* Feedback */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Feedback and Support
            </Typography>
            <Typography variant="body1" paragraph>
              We welcome feedback on the accessibility of MovieSearch 2025. If you encounter any accessibility barriers 
              or have suggestions for improvement, please contact us:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Email"
                  secondary="naushadnaushad7777@gmail.com"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Phone"
                  secondary="+91 7492068998"
                />
              </ListItem>
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              We aim to respond to accessibility feedback within 2 business days.
            </Typography>
          </Paper>

          {/* Last Updated */}
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              This accessibility statement was last updated on {new Date().toLocaleDateString()}.
            </Typography>
          </Paper>
        </Container>
      </RecaptchaProtection>
    </>
  );
}
