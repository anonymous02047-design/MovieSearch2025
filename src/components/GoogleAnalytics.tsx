'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && measurementId) {
      // Initialize Google Analytics
      window.gtag = window.gtag || function() {
        (window.gtag.q = window.gtag.q || []).push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
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
