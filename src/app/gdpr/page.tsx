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
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';
import RecaptchaProtection from '@/components/RecaptchaProtection';

export default function GDPRCompliancePage() {
  const rights = [
    {
      right: 'Right to Access',
      description: 'You have the right to request access to your personal data.',
      icon: <PersonIcon />,
    },
    {
      right: 'Right to Rectification',
      description: 'You can request correction of inaccurate personal data.',
      icon: <PersonIcon />,
    },
    {
      right: 'Right to Erasure',
      description: 'You can request deletion of your personal data.',
      icon: <DeleteIcon />,
    },
    {
      right: 'Right to Portability',
      description: 'You can request a copy of your data in a portable format.',
      icon: <ShieldIcon />,
    },
  ];

  return (
    <>
      <SEO
        title="GDPR Compliance - MovieSearch 2025"
        description="Learn about MovieSearch 2025's compliance with the General Data Protection Regulation (GDPR) and your data protection rights."
        keywords={['GDPR', 'data protection', 'privacy rights', 'EU regulation', 'personal data']}
      />
      <RecaptchaProtection action="gdpr" showStatus={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="body1" component="p" gutterBottom sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              fontSize: '14px',
            }}>
              🔒 GDPR Compliance
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              MovieSearch 2025 is committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).
            </Typography>
          </Box>

          {/* GDPR Overview */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              What is GDPR?
            </Typography>
            <Typography variant="body1" paragraph>
              The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect 
              on May 25, 2018. It applies to all organizations that process personal data of EU residents, regardless of 
              where the organization is located.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Our Commitment:</strong> MovieSearch 2025 is fully committed to GDPR compliance and protecting 
                your personal data in accordance with these regulations.
              </Typography>
            </Alert>
          </Paper>

          {/* Your Rights */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Your Data Protection Rights
            </Typography>
            <Typography variant="body1" paragraph>
              Under GDPR, you have several important rights regarding your personal data:
            </Typography>
            <List>
              {rights.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, mt: 1 }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {item.right}
                        </Typography>
                        <Chip label="GDPR Right" color="primary" size="small" />
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
              Exercise Your Rights
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              To exercise any of your GDPR rights or if you have questions about our data processing practices, 
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
