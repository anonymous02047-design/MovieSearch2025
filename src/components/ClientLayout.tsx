'use client';

import React from 'react';
import PageLayout from './PageLayout';
import GoogleAnalytics from './GoogleAnalytics';
import { CssBaseline } from '@mui/material';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {/* Google Analytics - Must be client component */}
      <GoogleAnalytics />
      
      {/* MUI CSS Baseline */}
      <CssBaseline />
      
      {/* Page Layout with Header and Footer */}
      <PageLayout>
        {children}
      </PageLayout>
    </>
  );
}


