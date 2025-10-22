'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Enhanced Google Analytics with event tracking
export function useGoogleAnalytics() {
  const trackEvent = ({ action, category, label, value }: GAEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_path: url,
      });
    }
  };

  const trackTiming = (name: string, value: number, category?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: value,
        event_category: category || 'Performance',
      });
    }
  };

  const trackException = (description: string, fatal: boolean = false) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: description,
        fatal: fatal,
      });
    }
  };

  const trackUser = (userId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        user_id: userId,
      });
    }
  };

  const trackConversion = (transactionId: string, value: number, currency: string = 'USD') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
      });
    }
  };

  const trackSearch = (searchTerm: string, resultsCount?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm,
        results_count: resultsCount,
      });
    }
  };

  const trackSocialShare = (network: string, target: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: network,
        content_type: 'movie',
        content_id: target,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackTiming,
    trackException,
    trackUser,
    trackConversion,
    trackSearch,
    trackSocialShare,
  };
}

export default function EnhancedGoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', gaId, {
        page_path: url,
        anonymize_ip: true, // GDPR compliance
        cookie_flags: 'SameSite=None;Secure',
      });
    }
  }, [pathname, searchParams, gaId]);

  // Performance monitoring
  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    // Track page load time
    if (window.performance && window.performance.timing) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      
      if (loadTime > 0 && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'load',
          value: loadTime,
          event_category: 'Page Load Performance',
        });
      }
    }

    // Track Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (window.gtag && lastEntry.startTime) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals',
          });
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (window.gtag && entry.processingStart) {
            window.gtag('event', 'web_vitals', {
              metric_name: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              event_category: 'Web Vitals',
            });
          }
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Report CLS on page unload
      const reportCLS = () => {
        if (window.gtag && clsValue > 0) {
          window.gtag('event', 'web_vitals', {
            metric_name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals',
          });
        }
      };

      window.addEventListener('beforeunload', reportCLS);

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        window.removeEventListener('beforeunload', reportCLS);
      };
    }
  }, [gaId]);

  // Error tracking
  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
          fatal: false,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: `Unhandled Promise Rejection: ${event.reason}`,
          fatal: false,
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [gaId]);

  if (!gaId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics Measurement ID not configured');
    }
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
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
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              cookie_domain: 'auto',
              cookie_expires: 63072000, // 2 years
              send_page_view: true,
              custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'device_category',
                'metric1': 'page_load_time'
              }
            });
            
            // Track outbound links
            document.addEventListener('click', function(e) {
              var target = e.target.closest('a');
              if (target && target.href && target.hostname !== window.location.hostname) {
                gtag('event', 'click', {
                  event_category: 'outbound',
                  event_label: target.href,
                  transport_type: 'beacon'
                });
              }
            });
            
            // Track file downloads
            document.addEventListener('click', function(e) {
              var target = e.target.closest('a');
              if (target && target.href && /\\.(pdf|xlsx?|docx?|txt|csv|zip|mp4|mp3)$/i.test(target.href)) {
                gtag('event', 'download', {
                  event_category: 'file',
                  event_label: target.href,
                  transport_type: 'beacon'
                });
              }
            });
          `,
        }}
      />
    </>
  );
}

