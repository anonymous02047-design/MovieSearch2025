'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { ClerkProvider } from '@clerk/nextjs';
import PageLayout from './PageLayout';
import AdminAnalyticsBeacon from './AdminAnalyticsBeacon';

interface AdminLayoutWrapperProps {
  children: ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // For admin routes, render without Header/Footer, ClerkProvider, and with admin styling
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        {children}
        <AdminAnalyticsBeacon currentPage={pathname} />
      </Box>
    );
  }

  // For non-admin routes, wrap with ClerkProvider and use PageLayout
  return (
    <ClerkProvider
      appearance={{
        theme: {
          baseTheme: {
            colors: {
              primary: '#2563eb',
              primaryHover: '#1d4ed8',
            },
          },
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
          card: 'shadow-lg',
          socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
          formFieldInput: 'border border-gray-300 focus:border-blue-500',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
        },
      }}
    >
      <PageLayout>
        {children}
      </PageLayout>
    </ClerkProvider>
  );
}
