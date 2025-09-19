'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignUpSuccessHandler() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if this is a new user (created within last 5 minutes)
      const userCreatedAt = new Date(user.createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (userCreatedAt > fiveMinutesAgo) {
        // Check if user came from deletion flow
        const fromDeletion = searchParams.get('deleted') === 'true';
        
        if (fromDeletion) {
          // Redirect to sign-in with welcome back message
          router.push('/sign-in?welcome_back=true');
        } else {
          // Normal new user flow - redirect to home
          router.push('/');
        }
      }
    }
  }, [isLoaded, user, router, searchParams]);

  return null; // This component doesn't render anything
}
