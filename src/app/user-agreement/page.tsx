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
  Gavel as GavelIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';
import GradientHeading from '@/components/GradientHeading';

export default function UserAgreementPage() {
  const agreementPoints = [
    {
      point: 'Service Usage',
      description: 'You agree to use our service in accordance with these terms and applicable laws.',
      icon: <CheckIcon />,
    },
    {
      point: 'Account Responsibility',
      description: 'You are responsible for maintaining the security of your account and password.',
      icon: <CheckIcon />,
    },
    {
      point: 'Content Ownership',
      description: 'You retain ownership of content you create, but grant us necessary usage rights.',
      icon: <CheckIcon />,
    },
    {
      point: 'Service Availability',
      description: 'We strive for high availability but cannot guarantee uninterrupted service.',
      icon: <InfoIcon />,
    },
  ];

  return (
    <>
      <SEO
        title="User Agreement - MovieSearch 2025"
        description="Read the MovieSearch 2025 user agreement and terms of service for using our platform."
        keywords={['user agreement', 'terms of service', 'user terms', 'service agreement', 'legal terms']}
      />
      <RecaptchaProtection action="user-agreement" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <GradientHeading
              variant="h3"
              gradient="linear-gradient(45deg, #1976d2, #42a5f5)"
              fallbackColor="primary.main"
              gutterBottom
              sx={{
                textAlign: 'center',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflow: 'visible',
                whiteSpace: 'nowrap',
                '@media (max-width: 600px)': {
                  whiteSpace: 'normal',
                  fontSize: '2rem',
                },
              }}
            >
              ⚖️ User Agreement
            </GradientHeading>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              The terms and conditions governing your use of MovieSearch 2025 and our services.
            </Typography>
          </Box>

          {/* Agreement Overview */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              User Agreement
            </Typography>
            <Typography variant="body1" paragraph>
              This User Agreement ("Agreement") governs your use of MovieSearch 2025 and our services. 
              By using our platform, you agree to be bound by these terms and conditions.
            </Typography>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Important:</strong> Please read this agreement carefully before using our service. 
                Your continued use constitutes acceptance of these terms.
              </Typography>
            </Alert>
          </Paper>

          {/* Agreement Points */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Key Terms
            </Typography>
            <List>
              {agreementPoints.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, mt: 1 }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {item.point}
                        </Typography>
                        <Chip label="Agreement Term" color="primary" size="small" />
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
              Questions About This Agreement?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If you have questions about this user agreement or need clarification on any terms, 
              please contact us:
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
