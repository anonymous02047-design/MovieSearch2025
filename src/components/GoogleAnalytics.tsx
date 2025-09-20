'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

function GoogleAnalyticsContent({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Use the provided measurement ID or default to G-Z2QNY6M1QL
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-Z2QNY6M1QL';

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      window.gtag('config', gaId, {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
      
      // Send page view event
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams, gaId]);

  if (!gaId) {
    console.warn('Google Analytics: No measurement ID found.');
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics script loaded successfully');
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
              page_path: window.location.pathname,
              page_location: window.location.href,
              page_title: document.title,
              send_page_view: true,
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
            
            // Enhanced tracking
            gtag('event', 'page_view', {
              page_path: window.location.pathname,
              page_location: window.location.href,
              page_title: document.title,
              custom_parameter_1: 'ladlihub_in',
              custom_parameter_2: 'movie_search_app'
            });
            
            console.log('Google Analytics configured with ID: ${gaId}');
          `,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent measurementId={measurementId} />
    </Suspense>
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
