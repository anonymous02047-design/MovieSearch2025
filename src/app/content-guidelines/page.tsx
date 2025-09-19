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
  Chip,
  Alert,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Rule as RuleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

export default function ContentGuidelinesPage() {
  const guidelines = [
    {
      guideline: 'Respectful Communication',
      description: 'All content should be respectful and appropriate for all audiences.',
      icon: <CheckIcon />,
    },
    {
      guideline: 'No Spam or Advertising',
      description: 'Do not post spam, advertisements, or promotional content.',
      icon: <CancelIcon />,
    },
    {
      guideline: 'Accurate Information',
      description: 'Ensure all information shared is accurate and factual.',
      icon: <CheckIcon />,
    },
    {
      guideline: 'Respect Copyright',
      description: 'Do not share copyrighted content without permission.',
      icon: <RuleIcon />,
    },
  ];

  return (
    <>
      <SEO
        title="Content Guidelines - MovieSearch 2025"
        description="Learn about MovieSearch 2025's content guidelines and community standards for users."
        keywords={['content guidelines', 'community standards', 'user guidelines', 'content policy', 'rules']}
      />
      <RecaptchaProtection action="content-guidelines" showStatus={false}>
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
              📋 Content Guidelines
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Our community guidelines and content standards to ensure a positive experience for all users.
            </Typography>
          </Box>

          {/* Guidelines Overview */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Community Guidelines
            </Typography>
            <Typography variant="body1" paragraph>
              At MovieSearch 2025, we strive to create a welcoming and respectful community for all movie enthusiasts. 
              These guidelines help ensure that everyone can enjoy our platform safely and respectfully.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Remember:</strong> These guidelines apply to all user-generated content, comments, 
                and interactions on our platform.
              </Typography>
            </Alert>
          </Paper>

          {/* Guidelines List */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Content Guidelines
            </Typography>
            <List>
              {guidelines.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, mt: 1 }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {item.guideline}
                        </Typography>
                        <Chip label="Guideline" color="primary" size="small" />
                      </Box>
                    }
                    secondary={item.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Contact Information */}
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Report Violations
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If you encounter content that violates our guidelines, please report it to us:
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Email: naushadnaushad7777@gmail.com
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Phone: +91 7492068998
              </Typography>
            </Box>
          </Paper>
        </Container>
      </RecaptchaProtection>
    </>
  );
}
