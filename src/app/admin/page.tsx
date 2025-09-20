'use client';

import { useEffect } from 'react';

// Prevent static generation for admin pages
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.expiresAt > Date.now()) {
          router.push('/admin/dashboard');
          return;
        }
      } catch (error) {
        // Invalid session, redirect to login
      }
    }
    
    // Redirect to login
    router.push('/admin/login');
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Redirecting to admin login...
      </Typography>
    </Box>
  );
}
