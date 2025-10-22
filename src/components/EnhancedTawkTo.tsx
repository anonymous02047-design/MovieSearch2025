'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Script from 'next/script';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

interface TawkToProps {
  propertyId?: string;
  widgetId?: string;
  customStyle?: {
    visibility?: {
      desktop?: {
        position?: 'br' | 'bl' | 'cr' | 'cl';
        xOffset?: number;
        yOffset?: number;
      };
      mobile?: {
        position?: 'br' | 'bl' | 'cr' | 'cl';
        xOffset?: number;
        yOffset?: number;
      };
    };
    theme?: {
      background?: string;
      color?: string;
    };
  };
}

export function useTawkTo() {
  const [isReady, setIsReady] = useState(false);

  const maximize = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  };

  const minimize = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.minimize();
    }
  };

  const toggle = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.toggle();
    }
  };

  const showWidget = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.showWidget();
    }
  };

  const hideWidget = () => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  };

  const setAttributes = (attributes: Record<string, any>, callback?: (error: any) => void) => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.setAttributes(attributes, callback);
    }
  };

  const addEvent = (event: string, metadata?: Record<string, any>, callback?: (error: any) => void) => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.addEvent(event, metadata, callback);
    }
  };

  const addTags = (tags: string[], callback?: (error: any) => void) => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.addTags(tags, callback);
    }
  };

  const removeTags = (tags: string[], callback?: (error: any) => void) => {
    if (typeof window !== 'undefined' && window.Tawk_API) {
      window.Tawk_API.removeTags(tags, callback);
    }
  };

  return {
    isReady,
    setIsReady,
    maximize,
    minimize,
    toggle,
    showWidget,
    hideWidget,
    setAttributes,
    addEvent,
    addTags,
    removeTags,
  };
}

export default function EnhancedTawkTo({
  propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
  widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID,
  customStyle,
}: TawkToProps) {
  const { user, isSignedIn } = useUser();
  const { setIsReady, setAttributes } = useTawkTo();

  useEffect(() => {
    if (!propertyId || !widgetId || typeof window === 'undefined') return;

    // Set user attributes if signed in
    if (isSignedIn && user && window.Tawk_API) {
      window.Tawk_API.onLoad = function() {
        setIsReady(true);
        
        // Set visitor attributes
        window.Tawk_API.setAttributes({
          name: user.fullName || user.username || 'User',
          email: user.primaryEmailAddress?.emailAddress || '',
          userId: user.id,
          registrationDate: user.createdAt?.toISOString() || '',
          hash: '', // Server-side hash for secure mode
        }, (error: any) => {
          if (error) {
            console.error('Tawk.to: Failed to set attributes', error);
          }
        });

        // Add tags based on user status
        const tags = ['web-app', 'signed-in'];
        if (user.publicMetadata?.role) {
          tags.push(`role-${user.publicMetadata.role}`);
        }
        
        window.Tawk_API.addTags(tags, (error: any) => {
          if (error) {
            console.error('Tawk.to: Failed to add tags', error);
          }
        });
      };
    }

    // Apply custom styling
    if (customStyle && window.Tawk_API) {
      window.Tawk_API.onLoad = function() {
        if (customStyle.visibility) {
          if (customStyle.visibility.desktop) {
            window.Tawk_API.setDesktopPosition(customStyle.visibility.desktop.position || 'br');
            if (customStyle.visibility.desktop.xOffset) {
              window.Tawk_API.setXOffset(customStyle.visibility.desktop.xOffset);
            }
            if (customStyle.visibility.desktop.yOffset) {
              window.Tawk_API.setYOffset(customStyle.visibility.desktop.yOffset);
            }
          }
          
          if (customStyle.visibility.mobile) {
            window.Tawk_API.setMobilePosition(customStyle.visibility.mobile.position || 'br');
          }
        }

        if (customStyle.theme) {
          if (customStyle.theme.background) {
            window.Tawk_API.setBackgroundColor(customStyle.theme.background);
          }
          if (customStyle.theme.color) {
            window.Tawk_API.setBubbleBackgroundColor(customStyle.theme.color);
          }
        }
      };
    }

    // Hide on certain pages (optional)
    const hiddenPages = ['/admin', '/settings'];
    const currentPath = window.location.pathname;
    
    if (hiddenPages.some(page => currentPath.startsWith(page))) {
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    } else {
      if (window.Tawk_API) {
        window.Tawk_API.showWidget();
      }
    }

  }, [propertyId, widgetId, isSignedIn, user, customStyle, setIsReady, setAttributes]);

  // Track chat events
  useEffect(() => {
    if (!propertyId || !widgetId || typeof window === 'undefined') return;

    const handleChatStarted = () => {
      // Track with Google Analytics
      if (window.gtag) {
        window.gtag('event', 'chat_started', {
          event_category: 'engagement',
          event_label: 'Tawk.to Chat',
        });
      }
    };

    const handleChatEnded = () => {
      if (window.gtag) {
        window.gtag('event', 'chat_ended', {
          event_category: 'engagement',
          event_label: 'Tawk.to Chat',
        });
      }
    };

    const handleMessageReceived = () => {
      if (window.gtag) {
        window.gtag('event', 'chat_message_received', {
          event_category: 'engagement',
          event_label: 'Tawk.to Chat',
        });
      }
    };

    if (window.Tawk_API) {
      window.Tawk_API.onChatStarted = handleChatStarted;
      window.Tawk_API.onChatEnded = handleChatEnded;
      window.Tawk_API.onMessageReceived = handleMessageReceived;
    }
  }, [propertyId, widgetId]);

  if (!propertyId || !widgetId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Tawk.to Property ID or Widget ID not configured');
    }
    return null;
  }

  return (
    <Script
      id="tawk-to"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
    />
  );
}

