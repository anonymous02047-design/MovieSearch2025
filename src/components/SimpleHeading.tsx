'use client';

import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface SimpleHeadingProps extends Omit<TypographyProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export default function SimpleHeading({
  variant = 'h3',
  children,
  sx,
  ...props
}: SimpleHeadingProps) {
  return (
    <Typography
      variant={variant}
      component={variant}
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        textAlign: 'center',
        display: 'block',
        width: '100%',
        margin: '0 auto',
        padding: '0',
        lineHeight: 1.3,
        wordBreak: 'break-word',
        overflow: 'visible',
        whiteSpace: 'nowrap',
        fontSize: {
          xs: '1.5rem',
          sm: '2rem',
          md: '2.5rem',
          lg: '3rem',
        },
        '@media (max-width: 600px)': {
          whiteSpace: 'normal',
          fontSize: '1.5rem',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
