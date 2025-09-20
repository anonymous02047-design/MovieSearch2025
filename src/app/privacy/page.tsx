'use client';

import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support.
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Account Information" 
                secondary="Name, email address, and profile information when you sign up using social login providers (Google, Microsoft)"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Usage Information" 
                secondary="Information about how you use our movie search and discovery features"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Device Information" 
                secondary="IP address, browser type, and device information for analytics and security"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Provide and maintain our movie search services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Authenticate users and manage accounts" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Improve our services and user experience" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Communicate with you about our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ensure security and prevent fraud" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. Information Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or otherwise transfer your personal information to third parties, 
            except in the following circumstances:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="With your explicit consent" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To comply with legal obligations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="To protect our rights and prevent fraud" />
            </ListItem>
            <ListItem>
              <ListItemText primary="With service providers who assist in operating our platform" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the internet is 100% secure.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Access your personal information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Correct inaccurate information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Delete your account and data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Withdraw consent for data processing" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Export your data" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
            and provide personalized content. You can control cookie settings through your browser.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            Our app integrates with third-party services including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Clerk (Authentication)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="The Movie Database (TMDB) API" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Social login providers (Google, Microsoft)" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            These services have their own privacy policies, and we encourage you to review them.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            8. Data Retention
          </Typography>
          <Typography variant="body1" paragraph>
            We retain your personal information for as long as necessary to provide our services 
            and comply with legal obligations. You can request deletion of your data at any time.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            9. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are not intended for children under 13. We do not knowingly collect 
            personal information from children under 13.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            10. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this privacy policy from time to time. We will notify you of any 
            changes by posting the new policy on this page and updating the "Last updated" date.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            11. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this privacy policy or our data practices, 
            please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: privacy@your-domain.com<br />
            Website: https://your-netlify-domain.netlify.app/contact
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}