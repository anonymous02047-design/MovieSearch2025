'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';

export default function TestSimplePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        {/* Direct Typography without any custom components */}
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
            display: 'block',
            width: '100%',
            margin: '0 auto',
            padding: '0',
            lineHeight: 1.3,
            wordBreak: 'break-word',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            fontSize: '3rem',
            '@media (max-width: 600px)': {
              whiteSpace: 'normal',
              fontSize: '2rem',
            },
          }}
        >
          🎬 Welcome back, Naushad!
        </Typography>
        
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#FF6B6B',
            textAlign: 'center',
            display: 'block',
            width: '100%',
            margin: '0 auto',
            padding: '0',
            lineHeight: 1.3,
            wordBreak: 'break-word',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            fontSize: '2.5rem',
            '@media (max-width: 600px)': {
              whiteSpace: 'normal',
              fontSize: '1.8rem',
            },
          }}
        >
          🍪 Cookie Policy
        </Typography>
        
        <Typography 
          variant="h3" 
          component="h3" 
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#4CAF50',
            textAlign: 'center',
            display: 'block',
            width: '100%',
            margin: '0 auto',
            padding: '0',
            lineHeight: 1.3,
            wordBreak: 'break-word',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            fontSize: '2rem',
            '@media (max-width: 600px)': {
              whiteSpace: 'normal',
              fontSize: '1.5rem',
            },
          }}
        >
          🔒 GDPR Compliance
        </Typography>
      </Box>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          This is a simple test page with direct Typography components.
        </Typography>
      </Box>
    </Container>
  );
}
