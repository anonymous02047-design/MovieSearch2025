'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Get measurement ID from environment variable if not provided
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (typeof window !== 'undefined' && gaId) {
      // Initialize Google Analytics
      window.gtag = window.gtag || function() {
        (window.gtag.q = window.gtag.q || []).push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
      });

      // Log for debugging
      console.log('Google Analytics initialized with ID:', gaId);
    } else if (typeof window !== 'undefined') {
      console.warn('Google Analytics not initialized: No measurement ID provided');
    }
  }, [gaId]);

  if (!gaId) {
    console.warn('Google Analytics: No measurement ID found. Please set NEXT_PUBLIC_GA_MEASUREMENT_ID environment variable.');
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        onLoad={() => {
          console.log('Google Analytics script loaded');
        }}
        onError={() => {
          console.error('Failed to load Google Analytics script');
        }}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
            });
            console.log('Google Analytics configured with ID: ${gaId}');
          `,
        }}
      />
    </>
  );
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}
