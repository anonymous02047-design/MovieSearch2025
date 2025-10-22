/**
 * Skip to Main Content Link
 * Accessibility feature for keyboard navigation
 */

'use client';

import React from 'react';
import { Box, Button } from '@mui/material';

export default function SkipToContent() {
  const skipToMain = () => {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        '&:focus-within': {
          left: '50%',
          top: '10px',
          transform: 'translateX(-50%)',
        },
      }}
    >
      <Button
        onClick={skipToMain}
        variant="contained"
        color="primary"
        sx={{
          px: 3,
          py: 1.5,
          fontWeight: 600,
          boxShadow: 3,
          '&:focus': {
            outline: '3px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
        }}
      >
        Skip to main content
      </Button>
    </Box>
  );
}

