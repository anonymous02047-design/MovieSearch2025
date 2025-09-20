/**
 * Admin-specific Analytics Beacon Script
 * Lightweight script for admin pages that doesn't depend on Clerk
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface AdminAnalyticsBeaconProps {
  sessionId?: string;
  currentPage: string;
}

export default function AdminAnalyticsBeacon({ sessionId, currentPage }: AdminAnalyticsBeaconProps) {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(sessionId || null);
  const startTimeRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const eventQueueRef = useRef<any[]>([]);
  const isOnlineRef = useRef<boolean>(typeof window !== 'undefined' ? navigator.onLine : true);

  // Initialize analytics session for admin
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
              userId: 'admin', // Admin user identifier
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
            userType: 'admin',
          });
        }
      } catch (error) {
        console.error('Failed to initialize admin analytics:', error);
      }
    };

    initializeAnalytics();
  }, [currentPage]);

  // Get comprehensive client information
  const getClientInfo = () => {
    if (typeof window === 'undefined') {
      return {
        userType: 'admin',
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
      userType: 'admin',
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
      data: {
        ...data,
        userType: 'admin',
      },
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
        userType: 'admin',
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
          userType: 'admin',
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
        userType: 'admin',
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
          userType: 'admin',
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
          userType: 'admin',
        });
      } else {
        sendEvent('page_visible', {
          duration: Date.now() - startTimeRef.current,
          userType: 'admin',
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
          userType: 'admin',
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
          userType: 'admin',
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

  // Track admin-specific events
  useEffect(() => {
    const trackAdminEvent = (event: CustomEvent) => {
      if (sessionIdRef.current) {
        sendEvent('admin_action', {
          type: event.detail.type,
          data: event.detail.data,
          userType: 'admin',
        });
      }
    };

    // Listen for admin-specific events
    window.addEventListener('admin_block_ip', trackAdminEvent as EventListener);
    window.addEventListener('admin_block_country', trackAdminEvent as EventListener);
    window.addEventListener('admin_export_data', trackAdminEvent as EventListener);
    window.addEventListener('admin_cleanup', trackAdminEvent as EventListener);
    window.addEventListener('admin_view_analytics', trackAdminEvent as EventListener);

    return () => {
      window.removeEventListener('admin_block_ip', trackAdminEvent as EventListener);
      window.removeEventListener('admin_block_country', trackAdminEvent as EventListener);
      window.removeEventListener('admin_export_data', trackAdminEvent as EventListener);
      window.removeEventListener('admin_cleanup', trackAdminEvent as EventListener);
      window.removeEventListener('admin_view_analytics', trackAdminEvent as EventListener);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Utility functions for tracking admin-specific events
export const trackAdminBlockIP = (ip: string, reason: string) => {
  window.dispatchEvent(new CustomEvent('admin_block_ip', {
    detail: { type: 'block_ip', data: { ip, reason } }
  }));
};

export const trackAdminBlockCountry = (country: string, reason: string) => {
  window.dispatchEvent(new CustomEvent('admin_block_country', {
    detail: { type: 'block_country', data: { country, reason } }
  }));
};

export const trackAdminExportData = (type: string, recordCount: number) => {
  window.dispatchEvent(new CustomEvent('admin_export_data', {
    detail: { type: 'export_data', data: { exportType: type, recordCount } }
  }));
};

export const trackAdminCleanup = (cleanupType: string, recordsRemoved: number) => {
  window.dispatchEvent(new CustomEvent('admin_cleanup', {
    detail: { type: 'cleanup', data: { cleanupType, recordsRemoved } }
  }));
};

export const trackAdminViewAnalytics = (analyticsType: string) => {
  window.dispatchEvent(new CustomEvent('admin_view_analytics', {
    detail: { type: 'view_analytics', data: { analyticsType } }
  }));
};
