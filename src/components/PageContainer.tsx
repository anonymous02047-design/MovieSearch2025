'use client';

import React from 'react';
import { Container, Box, useTheme } from '@mui/material';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: boolean;
  padding?: boolean;
}

export default function PageContainer({ 
  children, 
  maxWidth = 'xl',
  background = true,
  padding = true,
}: PageContainerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: background
          ? theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
          : 'transparent',
        minHeight: '100vh',
        py: padding ? 4 : 0,
      }}
    >
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
}

