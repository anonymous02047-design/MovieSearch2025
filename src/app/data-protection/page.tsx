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
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';


export default function DataProtectionPage() {
  const protectionMeasures = [
    {
      measure: 'Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard encryption protocols.',
      icon: <LockIcon />,
    },
    {
      measure: 'Access Controls',
      description: 'Strict access controls ensure only authorized personnel can access your data.',
      icon: <SecurityIcon />,
    },
    {
      measure: 'Regular Audits',
      description: 'We conduct regular security audits to identify and address potential vulnerabilities.',
      icon: <VisibilityIcon />,
    },
    {
      measure: 'Data Minimization',
      description: 'We only collect and process the minimum amount of data necessary for our services.',
      icon: <ShieldIcon />,
    },
  ];

  return (
    <>
      <SEO
        title="Data Protection - MovieSearch 2025"
        description="Learn about MovieSearch 2025's comprehensive data protection measures and how we safeguard your personal information."
        keywords={['data protection', 'privacy', 'security', 'data security', 'personal information']}
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
              🛡️ Data Protection
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Your privacy and data security are our top priorities. Learn about our comprehensive data protection measures.
            </Typography>
          </Box>

          {/* Data Protection Overview */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Our Data Protection Commitment
            </Typography>
            <Typography variant="body1" paragraph>
              At MovieSearch 2025, we take data protection seriously. We implement comprehensive security measures 
              to ensure your personal information is safe, secure, and handled in accordance with applicable data 
              protection laws and best practices.
            </Typography>
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Security First:</strong> We use industry-standard security measures to protect your data 
                from unauthorized access, alteration, disclosure, or destruction.
              </Typography>
            </Alert>
          </Paper>

          {/* Protection Measures */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Data Protection Measures
            </Typography>
            <List>
              {protectionMeasures.map((item, index) => (
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
                        <Chip label="Security Measure" color="success" size="small" />
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
              Questions About Data Protection?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              If you have any questions about our data protection practices or need to report a security concern, 
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
      </>
  );
}
