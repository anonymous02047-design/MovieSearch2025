'use client';

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, Paper } from '@mui/material';

interface CardProps extends MuiCardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  hover?: boolean;
  interactive?: boolean;
}

export default function Card({
  variant = 'elevated',
  hover = false,
  interactive = false,
  sx,
  children,
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': hover ? {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-4px)',
          } : {},
        };
      case 'outlined':
        return {
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          '&:hover': hover ? {
            borderColor: 'primary.main',
            transform: 'translateY(-2px)',
          } : {},
        };
      case 'filled':
        return {
          backgroundColor: 'background.paper',
          boxShadow: 'none',
          '&:hover': hover ? {
            backgroundColor: 'action.hover',
            transform: 'translateY(-2px)',
          } : {},
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    borderRadius: 3,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: interactive ? 'pointer' : 'default',
  };

  return (
    <MuiCard
      sx={{
        ...baseStyles,
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}
