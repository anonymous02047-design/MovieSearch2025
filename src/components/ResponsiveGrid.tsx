'use client';

import React from 'react';
import { Box, BoxProps, useTheme, useMediaQuery } from '@mui/material';

interface ResponsiveGridProps extends Omit<BoxProps, 'display'> {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  spacing?: number;
  minItemWidth?: number;
}

export default function ResponsiveGrid({ 
  children, 
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = 3,
  minItemWidth = 250,
  ...props 
}: ResponsiveGridProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  const getCurrentColumns = () => {
    if (isXl) return columns.xl || columns.lg || 4;
    if (isLg) return columns.lg || 4;
    if (isMd) return columns.md || 3;
    if (isSm) return columns.sm || 2;
    return columns.xs || 1;
  };

  const currentColumns = getCurrentColumns();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${columns.xs || 1}, 1fr)`,
          sm: `repeat(${columns.sm || 2}, 1fr)`,
          md: `repeat(${columns.md || 3}, 1fr)`,
          lg: `repeat(${columns.lg || 4}, 1fr)`,
          xl: `repeat(${columns.xl || columns.lg || 4}, 1fr)`,
        },
        gap: spacing,
        // Ensure minimum item width for better responsive behavior
        gridAutoRows: 'minmax(auto, max-content)',
        // Enhanced grid styling
        '& > *': {
          minHeight: 0, // Prevent grid items from stretching
          display: 'flex',
          flexDirection: 'column',
        },
        // Smooth transitions for responsive changes
        transition: 'grid-template-columns 0.3s ease',
        // Fallback for very small screens
        ...(isXs && {
          gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
