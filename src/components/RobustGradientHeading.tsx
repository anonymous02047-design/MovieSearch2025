'use client';

import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface RobustGradientHeadingProps extends Omit<TypographyProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: string;
  fallbackColor?: string;
  children: React.ReactNode;
}

export default function RobustGradientHeading({
  variant = 'h3',
  gradient = 'linear-gradient(45deg, #1976d2, #42a5f5)',
  fallbackColor = '#1976d2',
  children,
  sx,
  ...props
}: RobustGradientHeadingProps) {
  return (
    <Typography
      variant={variant}
      component={variant}
      sx={{
        // Base styling
        fontWeight: 'bold',
        color: fallbackColor,
        display: 'block',
        width: '100%',
        textAlign: 'center',
        lineHeight: 1.3,
        margin: 0,
        padding: 0,
        
        // Ensure proper text flow
        wordBreak: 'break-word',
        overflow: 'visible',
        whiteSpace: 'nowrap',
        
        // Gradient text effect
        background: gradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        
        // Fallback for unsupported browsers
        '@supports not (background-clip: text)': {
          color: fallbackColor,
          background: 'none',
          WebkitTextFillColor: 'initial',
        },
        
        // Additional fallback
        '@supports not (-webkit-background-clip: text)': {
          color: fallbackColor,
          background: 'none',
          WebkitTextFillColor: 'initial',
        },
        
        // Mobile responsive
        '@media (max-width: 768px)': {
          whiteSpace: 'normal',
          fontSize: '2rem',
          lineHeight: 1.2,
        },
        
        '@media (max-width: 480px)': {
          fontSize: '1.5rem',
          lineHeight: 1.1,
        },
        
        // Override any conflicting styles
        '& *': {
          color: 'inherit !important',
          background: 'inherit !important',
        },
        
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
