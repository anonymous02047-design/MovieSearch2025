'use client';

import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function PageLayout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: PageLayoutProps) {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.default'
    }}>
      {showHeader && <Header />}
      
      <Box component="main" sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </Box>
      
      {showFooter && <Footer />}
    </Box>
  );
}