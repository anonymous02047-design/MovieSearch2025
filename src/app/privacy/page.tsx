'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Storage as StorageIcon,
  Public as PublicIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <StorageIcon />,
      content: [
        'MovieSearch 2025 is designed with privacy in mind. We do not collect, store, or transmit any personal information to our servers.',
        'All user data including favorites, watchlist, and search history is stored locally on your device using your browser\'s local storage.',
        'We may collect anonymous usage statistics to improve the app, but this data cannot be used to identify you personally.',
        'When you use the search functionality, your search queries are sent to The Movie Database (TMDB) API, but we do not store these queries.',
      ],
    },
    {
      title: 'How We Use Your Information',
      icon: <PublicIcon />,
      content: [
        'Your locally stored data is used solely to provide you with a personalized movie discovery experience.',
        'Favorites and watchlist data helps us provide better recommendations and maintain your preferences.',
        'Search history is used to improve your search experience and provide quick access to recent searches.',
        'We do not share, sell, or distribute any of your personal information to third parties.',
      ],
    },
    {
      title: 'Data Security',
      icon: <SecurityIcon />,
      content: [
        'All data is stored locally on your device, which means it\'s as secure as your device and browser.',
        'We use industry-standard security practices to protect any data that may be transmitted.',
        'Your data is not stored on our servers, eliminating the risk of data breaches on our end.',
        'We recommend keeping your device and browser updated for optimal security.',
      ],
    },
    {
      title: 'Third-Party Services',
      icon: <ShieldIcon />,
      content: [
        'We use The Movie Database (TMDB) API to provide movie information. Please review their privacy policy.',
        'We may use analytics services to understand app usage, but these are configured to be privacy-friendly.',
        'External links to movie trailers or official websites are not under our control.',
        'We do not have access to data collected by third-party services we integrate with.',
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Privacy Policy
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          Your privacy is important to us. This policy explains how we handle your information when you use MovieSearch 2025.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Chip label="Last Updated: December 2024" color="primary" variant="outlined" />
          <Chip label="Version 2.1.0" color="primary" variant="outlined" />
        </Stack>
      </Box>

      {/* Introduction */}
      <Paper sx={{ p: 6, mb: 6, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
          Our Privacy Commitment
        </Typography>
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
          MovieSearch 2025 is built with privacy-first principles. We believe your movie preferences and personal data should remain private and under your control. 
          This is why we store everything locally on your device and don&apos;t collect personal information on our servers.
        </Typography>
      </Paper>

      {/* Privacy Sections */}
      {sections.map((section, index) => (
        <Paper key={index} sx={{ p: 6, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 2, 
              borderRadius: 2, 
              mr: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {section.icon}
            </Box>
            <Typography variant="h4" component="h2">
              {section.title}
            </Typography>
          </Box>
          
          <Stack spacing={3}>
            {section.content.map((paragraph, pIndex) => (
              <Typography key={pIndex} variant="body1" sx={{ lineHeight: 1.7 }}>
                {paragraph}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ))}

      {/* Your Rights */}
      <Paper sx={{ p: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Your Rights and Choices
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Data Control
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              Since all your data is stored locally, you have complete control. You can clear your favorites, watchlist, 
              and search history at any time through the app settings or by clearing your browser&apos;s local storage.
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Data Portability
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              You can export your favorites and watchlist data as JSON files, making it easy to backup or transfer 
              your data to other applications or devices.
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Opt-Out Options
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              You can disable search history tracking, clear all stored data, or stop using the app entirely. 
              Since we don&apos;t store data on our servers, stopping use of the app effectively removes all your data.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Children's Privacy */}
      <Paper sx={{ p: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Children&apos;s Privacy
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
          MovieSearch 2025 is suitable for users of all ages. Since we don&apos;t collect personal information, 
          there are no special considerations for children&apos;s privacy. However, we recommend parental supervision 
          for younger users when browsing movie content.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          Parents can easily monitor and control their children&apos;s usage by checking the browser&apos;s local storage 
          or using the app&apos;s export features to review saved content.
        </Typography>
      </Paper>

      {/* Changes to Policy */}
      <Paper sx={{ p: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
          We may update this privacy policy from time to time to reflect changes in our practices or for other 
          operational, legal, or regulatory reasons. We will notify users of any material changes by updating 
          the &ldquo;Last Updated&rdquo; date at the top of this policy.
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
          We encourage you to review this privacy policy periodically to stay informed about how we protect your information.
        </Typography>
      </Paper>

      {/* Contact Information */}
      <Paper sx={{ p: 6, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Questions About Privacy?
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 4 }}>
          If you have any questions about this privacy policy or our privacy practices, please contact us.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            📧 Email: naushadalamprivate@gmail.com
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            📱 Phone: +91 7209752686
          </Typography>
          <Typography variant="body1">
            🌍 Location: India
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
