'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

interface EnhancedShareDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
}

export default function EnhancedShareDialog({
  open,
  onClose,
  title,
  url,
  description = 'Check out this amazing movie!',
}: EnhancedShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title} - ${description}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(title);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const shareButtons = [
    {
      icon: <FacebookIcon />,
      label: 'Facebook',
      color: '#1877F2',
      platform: 'facebook',
    },
    {
      icon: <TwitterIcon />,
      label: 'Twitter',
      color: '#1DA1F2',
      platform: 'twitter',
    },
    {
      icon: <WhatsAppIcon />,
      label: 'WhatsApp',
      color: '#25D366',
      platform: 'whatsapp',
    },
    {
      icon: <LinkedInIcon />,
      label: 'LinkedIn',
      color: '#0A66C2',
      platform: 'linkedin',
    },
    {
      icon: <EmailIcon />,
      label: 'Email',
      color: '#EA4335',
      platform: 'email',
    },
  ];

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Share "{title}"</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            {/* Social Media Buttons */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Share on Social Media
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {shareButtons.map((button) => (
                  <Button
                    key={button.platform}
                    variant="outlined"
                    startIcon={button.icon}
                    onClick={() => handleShare(button.platform)}
                    sx={{
                      borderColor: button.color,
                      color: button.color,
                      '&:hover': {
                        bgcolor: button.color,
                        color: 'white',
                        borderColor: button.color,
                      },
                    }}
                  >
                    {button.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Copy Link */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Or Copy Link
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  value={shareUrl}
                  InputProps={{
                    readOnly: true,
                  }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  variant="contained"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyLink}
                >
                  Copy
                </Button>
              </Stack>
            </Box>

            {/* Native Share (Mobile) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <>
                <Divider />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title,
                        text: description,
                        url: shareUrl,
                      });
                    } catch (err) {
                      console.error('Share failed:', err);
                    }
                  }}
                >
                  Share via...
                </Button>
              </>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setCopied(false)}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}

