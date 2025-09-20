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
        custom_parameter_1: 'ladlihub_in',
        custom_parameter_2: 'movie_search_app',
      });
    } else {
      console.warn('Google Analytics not loaded. Event not tracked:', event);
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

  const trackError = useCallback((error: string, errorType: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error,
        fatal: false,
        event_category: 'error',
        event_label: errorType,
        custom_parameter_1: 'ladlihub_in',
        custom_parameter_2: 'movie_search_app',
      });
    }
  }, []);

  const trackAuthentication = useCallback((method: string, action: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'login', {
        method: method,
        event_category: 'authentication',
        event_label: action,
        custom_parameter_1: 'ladlihub_in',
        custom_parameter_2: 'movie_search_app',
      });
    }
  }, []);

  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    trackEvent({
      action: 'click',
      category: 'engagement',
      label: `${buttonName}_${location}`,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackMovieView,
    trackUserAction,
    trackError,
    trackAuthentication,
    trackButtonClick,
  };
}
