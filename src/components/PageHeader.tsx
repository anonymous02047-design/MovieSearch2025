'use client';

import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  gradient?: boolean;
}

export default function PageHeader({ icon, title, subtitle, actions, gradient = false }: PageHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: gradient
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        py: { xs: 4, md: 6 },
        mb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center' }}>
          {icon && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  color: gradient ? 'white' : 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: { xs: 40, md: 48 },
                }}
              >
                {icon}
              </Box>
            </Box>
          )}
          
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{
              color: gradient ? 'white' : 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="h6"
              sx={{
                color: gradient ? 'rgba(255,255,255,0.9)' : 'text.secondary',
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          {actions && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {actions}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

