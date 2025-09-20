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
  Divider,
  Chip,
} from '@mui/material';
import {
  Cookie as CookieIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';


export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      type: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Authentication', 'Security', 'Load balancing'],
      required: true,
    },
    {
      type: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Page views', 'User behavior', 'Performance metrics'],
      required: false,
    },
    {
      type: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Theme settings', 'User preferences'],
      required: false,
    },
    {
      type: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements.',
      examples: ['Ad targeting', 'Campaign tracking', 'Social media integration'],
      required: false,
    },
  ];

  return (
    <>
      <SEO
        title="Cookie Policy - MovieSearch 2025"
        description="Learn about how MovieSearch 2025 uses cookies to enhance your browsing experience and provide personalized content."
        keywords={['cookie policy', 'privacy', 'data protection', 'website cookies', 'user preferences']}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              🍪 Cookie Policy
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              This Cookie Policy explains how MovieSearch 2025 uses cookies and similar technologies when you visit our website.
            </Typography>
          </Box>

          {/* What are Cookies */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              What are Cookies?
            </Typography>
            <Typography variant="body1" paragraph>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to website owners.
            </Typography>
            <Typography variant="body1">
              At MovieSearch 2025, we use cookies to enhance your browsing experience, analyze site traffic, 
              and personalize content and advertisements.
            </Typography>
          </Paper>

          {/* Types of Cookies */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="primary" />
              Types of Cookies We Use
            </Typography>
            <Box sx={{ mt: 3 }}>
              {cookieTypes.map((cookie, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h6" component="h3">
                      {cookie.type}
                    </Typography>
                    <Chip
                      label={cookie.required ? 'Required' : 'Optional'}
                      color={cookie.required ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {cookie.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Examples:
                  </Typography>
                  <List dense>
                    {cookie.examples.map((example, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemText primary={`• ${example}`} />
                      </ListItem>
                    ))}
                  </List>
                  {index < cookieTypes.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Cookie Management */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              Managing Your Cookie Preferences
            </Typography>
            <Typography variant="body1" paragraph>
              You can control and manage cookies in various ways:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Browser Settings"
                  secondary="Most web browsers allow you to control cookies through their settings preferences."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Cookie Consent Banner"
                  secondary="When you first visit our site, you can choose which types of cookies to accept."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Opt-out Links"
                  secondary="You can opt out of specific cookie types through the links provided in our privacy policy."
                />
              </ListItem>
            </List>
          </Paper>

          {/* Contact Information */}
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Questions About Our Cookie Policy?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              If you have any questions about our use of cookies, please contact us at{' '}
              <Typography component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                naushadnaushad7777@gmail.com
              </Typography>
            </Typography>
          </Paper>
        </Container>
      </>
  );
}
