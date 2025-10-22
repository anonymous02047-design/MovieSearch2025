'use client';

import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useTheme } from '@mui/material';
import { KeyboardArrowUp as ArrowUpIcon } from '@mui/icons-material';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        size="medium"
        aria-label="scroll to top"
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2, #1CB5E0)',
          }
        }}
      >
        <ArrowUpIcon />
      </Fab>
    </Zoom>
  );
}

