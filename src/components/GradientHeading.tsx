'use client';

import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface GradientHeadingProps extends Omit<TypographyProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: string;
  fallbackColor?: string;
  children: React.ReactNode;
}

export default function GradientHeading({
  variant = 'h3',
  gradient = 'linear-gradient(45deg, #1976d2, #42a5f5)',
  fallbackColor = 'primary.main',
  children,
  sx,
  ...props
}: GradientHeadingProps) {
  return (
    <Typography
      variant={variant}
      component={variant}
      sx={{
        fontWeight: 'bold',
        color: fallbackColor,
        // Ensure proper display and positioning
        display: 'block',
        width: '100%',
        textAlign: 'center',
        lineHeight: 1.2,
        wordBreak: 'break-word',
        overflow: 'visible',
        whiteSpace: 'nowrap',
        // Gradient text effect with fallback
        background: gradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        // Fallback for browsers that don't support background-clip: text
        '@supports not (background-clip: text)': {
          color: fallbackColor,
          background: 'none',
          WebkitTextFillColor: 'initial',
        },
        // Additional fallback for older browsers
        '@media screen and (-webkit-min-device-pixel-ratio: 0)': {
          '&:not([style*="background-clip"])': {
            color: fallbackColor,
            background: 'none',
            WebkitTextFillColor: 'initial',
          },
        },
        // Mobile responsive
        '@media (max-width: 600px)': {
          whiteSpace: 'normal',
          fontSize: '2rem',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
