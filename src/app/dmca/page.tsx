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
  Copyright as CopyrightIcon,
  Report as ReportIcon,
  Gavel as LegalIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import SEO from '@/components/SEO';

export default function DMCAPolicyPage() {
  const dmcaInfo = [
    {
      title: 'Copyright Protection',
      description: 'We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA).',
      icon: <CopyrightIcon />,
    },
    {
      title: 'Takedown Requests',
      description: 'We respond promptly to valid DMCA takedown requests and remove infringing content.',
      icon: <ReportIcon />,
    },
    {
      title: 'Legal Compliance',
      description: 'Our platform operates in full compliance with copyright laws and regulations.',
      icon: <LegalIcon />,
    },
    {
      title: 'User Responsibility',
      description: 'Users are responsible for ensuring their content does not infringe on copyrights.',
      icon: <WarningIcon />,
    },
  ];

  return (
    <>
      <SEO
        title="DMCA Policy - MovieSearch 2025"
        description="Learn about MovieSearch 2025's DMCA policy and how we handle copyright infringement claims."
        keywords={['DMCA', 'copyright', 'intellectual property', 'takedown', 'copyright protection']}
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
              ©️ DMCA Policy
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Our Digital Millennium Copyright Act (DMCA) policy and procedures for handling copyright infringement claims.
            </Typography>
          </Box>

          {/* DMCA Overview */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              DMCA Compliance
            </Typography>
            <Typography variant="body1" paragraph>
              MovieSearch 2025 respects the intellectual property rights of others and expects our users to do the same. 
              We comply with the Digital Millennium Copyright Act (DMCA) and will respond to valid takedown requests 
              in accordance with the law.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Important:</strong> We are a movie discovery platform that provides information about movies 
                from The Movie Database (TMDB). We do not host or distribute copyrighted content.
              </Typography>
            </Alert>
          </Paper>

          {/* DMCA Information */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              DMCA Information
            </Typography>
            <List>
              {dmcaInfo.map((item, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 2, mt: 1 }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="h3">
                          {item.title}
                        </Typography>
                        <Chip label="DMCA Policy" color="primary" size="small" />
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
              DMCA Contact
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              For DMCA takedown requests or copyright concerns, please contact us:
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
