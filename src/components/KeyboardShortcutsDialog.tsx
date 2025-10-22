'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { Keyboard as KeyboardIcon } from '@mui/icons-material';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['H'], description: 'Go to Home' },
  { keys: ['Ctrl', 'F'], description: 'Focus Search' },
  { keys: ['T'], description: 'View Trending' },
  { keys: ['B'], description: 'Browse Genres' },
  { keys: ['W'], description: 'View Watchlist' },
  { keys: ['Shift', 'F'], description: 'View Favorites' },
  { keys: ['S'], description: 'View Stats' },
  { keys: ['?'], description: 'Show Shortcuts' },
  { keys: ['Esc'], description: 'Close Dialog' },
];

export default function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <KeyboardIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Keyboard Shortcuts
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 1 }}>
          {shortcuts.map((shortcut, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                }}
              >
                <Typography variant="body1">{shortcut.description}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {shortcut.keys.map((key, keyIndex) => (
                    <Chip
                      key={keyIndex}
                      label={key}
                      size="small"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
              {index < shortcuts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            💡 Tip: Press <Chip label="?" size="small" sx={{ mx: 0.5 }} /> at any time to view this help
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

