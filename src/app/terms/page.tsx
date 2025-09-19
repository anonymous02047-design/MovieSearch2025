'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Security as SecurityIcon,
  PrivacyTip as PrivacyIcon,
  Copyright as CopyrightIcon,
  ContactSupport as SupportIcon,
} from '@mui/icons-material';

export default function TermsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          📋 Terms of Service
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Please read these terms carefully before using our service
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      {/* Quick Navigation */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Quick Navigation
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="1. Acceptance" icon={<GavelIcon />} color="primary" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <Chip label="2. Service Description" icon={<SupportIcon />} color="secondary" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <Chip label="3. User Responsibilities" icon={<SecurityIcon />} color="info" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <Chip label="4. Privacy & Data" icon={<PrivacyIcon />} color="warning" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <Chip label="5. Intellectual Property" icon={<CopyrightIcon />} color="error" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }} />
        </Stack>
      </Paper>

      {/* Terms Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Section 1: Acceptance */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <GavelIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              1. Acceptance of Terms
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            By accessing and using MovieSearch 2025 (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.8 }}>
            These Terms of Service (&quot;Terms&quot;) govern your use of our website located at MovieSearch 2025 (the &quot;Service&quot;) operated by our team (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </Typography>
        </Paper>

        {/* Section 2: Service Description */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SupportIcon sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              2. Service Description
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            MovieSearch 2025 is a comprehensive movie discovery platform that provides:
          </Typography>
          <List sx={{ color: 'white' }}>
            <ListItem>
              <ListItemText 
                primary="Movie search and discovery functionality"
                secondary="Access to extensive movie database with search, filtering, and recommendation features"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Personalized recommendations"
                secondary="AI-powered movie suggestions based on your preferences and viewing history"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="User accounts and preferences"
                secondary="Save favorites, create watchlists, and maintain search history"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Movie information and media"
                secondary="Detailed movie information, trailers, photos, cast details, and reviews"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Section 3: User Responsibilities */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SecurityIcon sx={{ mr: 2, color: 'info.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              3. User Responsibilities
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            As a user of our Service, you agree to:
          </Typography>
          <List sx={{ color: 'white' }}>
            <ListItem>
              <ListItemText 
                primary="Provide accurate information"
                secondary="Ensure all information provided during registration and use is accurate and up-to-date"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Use the service responsibly"
                secondary="Not use the service for any unlawful purpose or in any way that could damage, disable, or impair the service"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Respect intellectual property"
                secondary="Not reproduce, duplicate, copy, sell, or exploit any portion of the service without express written permission"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Maintain account security"
                secondary="Keep your account credentials secure and notify us immediately of any unauthorized use"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Section 4: Privacy and Data */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PrivacyIcon sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              4. Privacy and Data Protection
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy. We may collect:
          </Typography>
          <List sx={{ color: 'white' }}>
            <ListItem>
              <ListItemText 
                primary="Account information"
                secondary="Name, email address, and profile information you provide"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Usage data"
                secondary="Information about how you use our service, including search history and preferences"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Device information"
                secondary="IP address, browser type, and device information for service optimization"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Section 5: Intellectual Property */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CopyrightIcon sx={{ mr: 2, color: 'error.main', fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: 'white' }}>
              5. Intellectual Property Rights
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            The Service and its original content, features, and functionality are and will remain the exclusive property of MovieSearch 2025 and its licensors. The Service is protected by copyright, trademark, and other laws.
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            Movie data, images, and related content are provided by The Movie Database (TMDB) and are used under their terms of service. We do not claim ownership of movie-related content.
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.8 }}>
            You may not:
          </Typography>
          <List sx={{ color: 'white' }}>
            <ListItem>
              <ListItemText 
                primary="Modify or copy the materials"
                secondary="Use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Use for commercial purposes"
                secondary="Use the materials for any commercial purpose or for any public display without written permission"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Reverse engineer"
                secondary="Attempt to reverse engineer any software contained on the website"
              />
            </ListItem>
          </List>
        </Paper>

        {/* Section 6: Limitation of Liability */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            In no event shall MovieSearch 2025, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.8 }}>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, materials, or products included on the Service.
          </Typography>
        </Paper>

        {/* Section 7: Changes to Terms */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
            7. Changes to Terms
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', lineHeight: 1.8 }}>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </Typography>
        </Paper>

        {/* Section 8: Contact Information */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
            8. Contact Information
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2, lineHeight: 1.8 }}>
            If you have any questions about these Terms of Service, please contact us:
          </Typography>
          <List sx={{ color: 'white' }}>
            <ListItem>
              <ListItemText 
                primary="Email"
                secondary="naushadalamprivate@gmail.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="WhatsApp"
                secondary="+91 7209752686"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Website"
                secondary="MovieSearch 2025"
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

    </Container>
  );
}
