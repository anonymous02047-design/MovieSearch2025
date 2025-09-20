'use client';

import { useCallback } from 'react';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function useGoogleAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }, []);

  const trackPageView = useCallback((url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_title: title || document.title,
        page_location: url,
      });
    }
  }, []);

  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    trackEvent({
      action: 'search',
      category: 'engagement',
      label: searchTerm,
      value: resultsCount,
    });
  }, [trackEvent]);

  const trackMovieView = useCallback((movieId: string, movieTitle: string) => {
    trackEvent({
      action: 'view_movie',
      category: 'content',
      label: movieTitle,
    });
  }, [trackEvent]);

  const trackUserAction = useCallback((action: string, category: string, label?: string) => {
    trackEvent({
      action,
      category,
      label,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackMovieView,
    trackUserAction,
  };
}
