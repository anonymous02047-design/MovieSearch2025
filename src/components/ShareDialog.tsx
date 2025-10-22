'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Email as EmailIcon
} from '@mui/icons-material';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
}

export default function ShareDialog({ open, onClose, title, url, description }: ShareDialogProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const theme = useTheme();
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `Check out ${title}!`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedDescription = encodeURIComponent(description || '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FacebookIcon />,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'Twitter',
      icon: <TwitterIcon />,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: '#25D366',
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon />,
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    },
    {
      name: 'Email',
      icon: <EmailIcon />,
      color: '#EA4335',
      url: `mailto:?subject=${encodedText}&body=${encodedDescription}%0A%0A${encodedUrl}`
    }
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(50, 50, 50, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 240, 240, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Share {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Share via
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                mt: 2
              }}
            >
              {shareLinks.map((link) => (
                <Box
                  key={link.name}
                  component="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
                    borderRadius: 2,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    backgroundColor: alpha(link.color, 0.1),
                    border: `1px solid ${alpha(link.color, 0.2)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(link.color, 0.2),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(link.color, 0.3)}`
                    }
                  }}
                >
                  <Box sx={{ color: link.color }}>{link.icon}</Box>
                  <Typography variant="caption" sx={{ color: 'text.primary' }}>
                    {link.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Or copy link
            </Typography>
            <TextField
              fullWidth
              value={shareUrl}
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={handleCopy} edge="end" size="small">
                    <CopyIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setCopySuccess(false)}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}

