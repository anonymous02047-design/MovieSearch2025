'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
// No unused imports to clean up
import AppLoading from './AppLoading';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function RouteGuard({ 
  children, 
  requireAuth = true,
  redirectTo = '/welcome'
}: RouteGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // If user is authenticated but trying to access welcome page
    if (user && pathname === '/welcome') {
      router.push('/');
      return;
    }
  }, [isLoaded, user, router, pathname, requireAuth, redirectTo]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return <AppLoading message="Loading..." />;
  }

  // If authentication is required but user is not authenticated, show loading
  if (requireAuth && !user) {
    return <AppLoading message="Redirecting to login..." />;
  }

  // If user is authenticated but on welcome page, show loading
  if (user && pathname === '/welcome') {
    return <AppLoading message="Redirecting to home..." />;
  }

  return <>{children}</>;
}
