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
  Lock as LockIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';


export default function SecurityPolicyPage() {
  const securityMeasures = [
    {
      measure: 'Data Encryption',
      description: 'All data is encrypted using AES-256 encryption both in transit and at rest.',
      icon: <LockIcon />,
    },
    {
      measure: 'Secure Authentication',
      description: 'We use industry-standard authentication protocols including OAuth 2.0 and JWT tokens.',
      icon: <SecurityIcon />,
    },
    {
      measure: 'Regular Security Audits',
      description: 'We conduct regular security audits and penetration testing to identify vulnerabilities.',
      icon: <ShieldIcon />,
    },
    {
      measure: 'Incident Response',
      description: 'We have a comprehensive incident response plan for security breaches.',
      icon: <WarningIcon />,
    },
  ];

  return (
    <>
      <SEO
        title="Security Policy - MovieSearch 2025"
        description="Learn about MovieSearch 2025's comprehensive security measures and how we protect your data and privacy."
        keywords={['security policy', 'data security', 'privacy protection', 'cybersecurity', 'secure platform']}
      />
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
              🔐 Security Policy
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Your security is our priority. Learn about our comprehensive security measures and protocols.
            </Typography>
          </Box>

          {/* Security Overview */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Security Commitment
            </Typography>
            <Typography variant="body1" paragraph>
              At MovieSearch 2025, we implement multiple layers of security to protect your data and ensure 
              a safe browsing experience. Our security measures are designed to meet industry standards and 
              protect against various types of threats.
            </Typography>
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Security First:</strong> We continuously monitor and update our security measures 
                to stay ahead of emerging threats and protect your information.
              </Typography>
            </Alert>
          </Paper>

          {/* Security Measures */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Security Measures
            </Typography>
            <List>
              {securityMeasures.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, mt: 1 }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {item.measure}
                        </Typography>
                        <Chip label="Security Feature" color="success" size="small" />
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
              Report Security Issues
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If you discover a security vulnerability or have concerns about our security practices, 
              please contact us immediately:
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
      </>
  );
}
