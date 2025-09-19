'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Info as InfoIcon,
  BugReport as BugIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  Search as SearchIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface VersionInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function VersionInfoDialog({ open, onClose }: VersionInfoDialogProps) {
  const version = '2.1.0';
  const releaseDate = 'December 2024';
  
  const features = [
    { icon: <SearchIcon />, text: 'Advanced Movie Search', status: 'New' },
    { icon: <StarIcon />, text: 'Personalized Recommendations', status: 'Enhanced' },
    { icon: <PaletteIcon />, text: 'Dark Theme UI', status: 'Stable' },
    { icon: <SpeedIcon />, text: 'Performance Optimizations', status: 'Improved' },
    { icon: <SecurityIcon />, text: 'Enhanced Security', status: 'Updated' },
    { icon: <BugIcon />, text: 'Bug Fixes', status: 'Fixed' },
  ];

  const techStack = [
    'Next.js 15',
    'React 18',
    'TypeScript',
    'Material-UI v5',
    'TMDB API',
    'Axios',
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="primary" />
          <Typography variant="h6">Application Information</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ color: 'white' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {/* Version Info */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Version Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={`v${version}`}
                  color="primary"
                  variant="outlined"
                  size="medium"
                />
                <Typography variant="body2" color="text.secondary">
                  Released: {releaseDate}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                MovieSearch 2025 - Advanced Movie Discovery Platform
              </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Technology Stack
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {techStack.map((tech) => (
                  <Chip
                    key={tech}
                    label={tech}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: 'text.secondary',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Features */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Latest Features
            </Typography>
            <List dense>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.text}
                    secondary={
                      <Chip
                        label={feature.status}
                        size="small"
                        color={
                          feature.status === 'New' ? 'success' :
                          feature.status === 'Enhanced' ? 'primary' :
                          feature.status === 'Improved' ? 'warning' : 'default'
                        }
                        sx={{ fontSize: '0.7rem', height: 18 }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Developer Info */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Developer Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Developed by <strong>Naushad Alam</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: naushadalamprivate@gmail.com | Phone: +91 7209752686
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Made with ❤️ for movie enthusiasts worldwide
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button onClick={onClose} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
