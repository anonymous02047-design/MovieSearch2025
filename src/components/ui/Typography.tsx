'use client';

import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';

interface TypographyProps extends MuiTypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'text' | 'error' | 'warning' | 'info' | 'success';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
}

export default function Typography({
  variant = 'body1',
  color = 'text',
  weight = 'normal',
  align = 'left',
  sx,
  children,
  ...props
}: TypographyProps) {
  const getWeightStyles = () => {
    switch (weight) {
      case 'light':
        return { fontWeight: 300 };
      case 'normal':
        return { fontWeight: 400 };
      case 'medium':
        return { fontWeight: 500 };
      case 'semibold':
        return { fontWeight: 600 };
      case 'bold':
        return { fontWeight: 700 };
      default:
        return { fontWeight: 400 };
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return { color: 'primary.main' };
      case 'secondary':
        return { color: 'secondary.main' };
      case 'text':
        return { color: 'text.primary' };
      case 'error':
        return { color: 'error.main' };
      case 'warning':
        return { color: 'warning.main' };
      case 'info':
        return { color: 'info.main' };
      case 'success':
        return { color: 'success.main' };
      default:
        return { color: 'text.primary' };
    }
  };

  const baseStyles = {
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  };

  return (
    <MuiTypography
      variant={variant}
      align={align}
      sx={{
        ...baseStyles,
        ...getWeightStyles(),
        ...getColorStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
}
