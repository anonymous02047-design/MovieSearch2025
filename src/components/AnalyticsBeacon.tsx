/**
 * Client-side Analytics Beacon Script
 * Lightweight script that captures user interactions and sends them to the server
 */

'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

interface AnalyticsBeaconProps {
  sessionId?: string;
  currentPage: string;
}

export default function AnalyticsBeacon({ sessionId, currentPage }: AnalyticsBeaconProps) {
  const { user } = useUser();
  const sessionIdRef = useRef<string | null>(sessionId || null);
  const startTimeRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const eventQueueRef = useRef<any[]>([]);
  const isOnlineRef = useRef<boolean>(typeof window !== 'undefined' ? navigator.onLine : true);

  // Initialize analytics session
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Get or create session ID
        if (!sessionIdRef.current) {
          const response = await fetch('/api/analytics/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page: currentPage,
              userId: user?.id,
              clientInfo: getClientInfo(),
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            sessionIdRef.current = data.sessionId;
          }
        }

        // Send initial page view
        if (sessionIdRef.current) {
          await sendEvent('page_view', {
            page: currentPage,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
      }
    };

    initializeAnalytics();
  }, [currentPage, user?.id]);

  // Get comprehensive client information
  const getClientInfo = () => {
    if (typeof window === 'undefined') {
      return {
        language: 'en',
        timezone: 'UTC',
      };
    }
    
    const screen = window.screen;
    const navigator = window.navigator;
    
    return {
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      colorDepth: screen.colorDepth,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      localStorageSupport: typeof Storage !== 'undefined',
      javascriptEnabled: true,
      browserPlugins: Array.from(navigator.plugins).map(p => p.name),
      networkType: getNetworkType(),
      connectionSpeed: getConnectionSpeed(),
      cpuCores: navigator.hardwareConcurrency,
      memorySize: (navigator as any).deviceMemory,
      batteryStatus: getBatteryStatus(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  };

  const getNetworkType = () => {
    if (typeof window === 'undefined') return 'unknown';
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.effectiveType || 'unknown';
  };

  const getConnectionSpeed = () => {
    if (typeof window === 'undefined') return 'unknown';
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.downlink ? `${connection.downlink}Mbps` : 'unknown';
  };

  const getBatteryStatus = async () => {
    if (typeof window === 'undefined') return null;
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level,
        charging: battery.charging,
      };
    } catch (error) {
      return null;
    }
  };

  // Send event to server
  const sendEvent = async (type: string, data: any) => {
    if (!sessionIdRef.current) return;

    const event = {
      type,
      timestamp: Date.now(),
      page: currentPage,
      data,
    };

    // Add to queue if offline
    if (!isOnlineRef.current) {
      eventQueueRef.current.push(event);
      return;
    }

    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          event,
        }),
      });
    } catch (error) {
      // Queue event for retry when online
      eventQueueRef.current.push(event);
    }
  };

  // Send queued events when back online
  useEffect(() => {
    const handleOnline = async () => {
      isOnlineRef.current = true;
      
      while (eventQueueRef.current.length > 0) {
        const event = eventQueueRef.current.shift();
        if (event && sessionIdRef.current) {
          try {
            await fetch('/api/analytics/event', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: sessionIdRef.current,
                event,
              }),
            });
          } catch (error) {
            // Put event back in queue if it fails
            eventQueueRef.current.unshift(event);
            break;
          }
        }
      }
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track user interactions
  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      
      sendEvent('click', {
        element,
        className,
        id,
        x: event.clientX,
        y: event.clientY,
      });
      
      lastActivityRef.current = Date.now();
    };

    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollDepth;
        sendEvent('scroll', {
          depth: scrollDepth,
          maxDepth: maxScrollDepthRef.current,
        });
      }
      
      lastActivityRef.current = Date.now();
    };

    const trackFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const formFields: any = {};
      
      for (const [key, value] of formData.entries()) {
        formFields[key] = value;
      }
      
      sendEvent('form_submit', {
        formId: form.id,
        formClass: form.className,
        formAction: form.action,
        formFields,
      });
      
      lastActivityRef.current = Date.now();
    };

    const trackSearch = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.type === 'search' || input.name?.includes('search') || input.id?.includes('search')) {
        sendEvent('search', {
          query: input.value,
          inputId: input.id,
          inputName: input.name,
        });
      }
    };

    // Add event listeners
    document.addEventListener('click', trackClick);
    document.addEventListener('scroll', trackScroll, { passive: true });
    document.addEventListener('submit', trackFormSubmit);
    document.addEventListener('input', trackSearch);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendEvent('page_hidden', {
          duration: Date.now() - startTimeRef.current,
        });
      } else {
        sendEvent('page_visible', {
          duration: Date.now() - startTimeRef.current,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track beforeunload
    const handleBeforeUnload = () => {
      if (sessionIdRef.current && typeof window !== 'undefined') {
        // Send final session update
        navigator.sendBeacon('/api/analytics/session/end', JSON.stringify({
          sessionId: sessionIdRef.current,
          duration: Date.now() - startTimeRef.current,
          maxScrollDepth: maxScrollDepthRef.current,
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodic session updates
    const updateInterval = setInterval(() => {
      if (sessionIdRef.current) {
        sendEvent('session_update', {
          duration: Date.now() - startTimeRef.current,
          lastActivity: Date.now() - lastActivityRef.current,
          maxScrollDepth: maxScrollDepthRef.current,
        });
      }
    }, 30000); // Every 30 seconds

    return () => {
      document.removeEventListener('click', trackClick);
      document.removeEventListener('scroll', trackScroll);
      document.removeEventListener('submit', trackFormSubmit);
      document.removeEventListener('input', trackSearch);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(updateInterval);
    };
  }, [currentPage]);

  // Track specific movie app events
  useEffect(() => {
    const trackMovieEvent = (event: CustomEvent) => {
      if (sessionIdRef.current) {
        sendEvent('custom', {
          type: event.detail.type,
          data: event.detail.data,
        });
      }
    };

    // Listen for custom movie app events
    window.addEventListener('movie_rating', trackMovieEvent as EventListener);
    window.addEventListener('movie_favorite', trackMovieEvent as EventListener);
    window.addEventListener('movie_watchlist', trackMovieEvent as EventListener);
    window.addEventListener('movie_search', trackMovieEvent as EventListener);

    return () => {
      window.removeEventListener('movie_rating', trackMovieEvent as EventListener);
      window.removeEventListener('movie_favorite', trackMovieEvent as EventListener);
      window.removeEventListener('movie_watchlist', trackMovieEvent as EventListener);
      window.removeEventListener('movie_search', trackMovieEvent as EventListener);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Utility functions for tracking movie-specific events
export const trackMovieRating = (movieId: number, rating: number) => {
  window.dispatchEvent(new CustomEvent('movie_rating', {
    detail: { type: 'rating', data: { movieId, rating } }
  }));
};

export const trackMovieFavorite = (movieId: number, action: 'add' | 'remove') => {
  window.dispatchEvent(new CustomEvent('movie_favorite', {
    detail: { type: 'favorite', data: { movieId, action } }
  }));
};

export const trackMovieWatchlist = (movieId: number, action: 'add' | 'remove') => {
  window.dispatchEvent(new CustomEvent('movie_watchlist', {
    detail: { type: 'watchlist', data: { movieId, action } }
  }));
};

export const trackMovieSearch = (query: string, results: number) => {
  window.dispatchEvent(new CustomEvent('movie_search', {
    detail: { type: 'search', data: { query, results } }
  }));
};
