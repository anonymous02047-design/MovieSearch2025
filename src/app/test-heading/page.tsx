'use client';

import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import SimpleHeading from '@/components/SimpleHeading';

export default function TestHeadingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        {/* Test SimpleHeading component */}
        <SimpleHeading variant="h1" gutterBottom>
          🎬 Test Heading 1
        </SimpleHeading>
        
        <SimpleHeading variant="h2" gutterBottom sx={{ color: '#FF6B6B' }}>
          🍪 Test Heading 2
        </SimpleHeading>
        
        <SimpleHeading variant="h3" gutterBottom sx={{ color: '#4CAF50' }}>
          🔒 Test Heading 3
        </SimpleHeading>
        
        {/* Test regular Typography */}
        <Typography variant="h4" component="h4" gutterBottom sx={{
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
          fontSize: '2rem',
          '@media (max-width: 600px)': {
            whiteSpace: 'normal',
            fontSize: '1.5rem',
          },
        }}>
          🎯 Regular Typography Test
        </Typography>
        
        {/* Test with emoji and long text */}
        <SimpleHeading variant="h3" gutterBottom sx={{ color: '#9C27B0' }}>
          🎬 Welcome back, Naushad! This is a long heading to test text wrapping and display
        </SimpleHeading>
      </Box>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          This is a test page to verify heading display functionality.
        </Typography>
      </Box>
    </Container>
  );
}
