import { TawkConfig } from './tawk';

// Tawk.to Configuration
export const tawkConfig: TawkConfig = {
  propertyId: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || '',
  widgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '',
  enabled: process.env.NEXT_PUBLIC_TAWK_ENABLED === 'true' && 
           process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID && 
           process.env.NEXT_PUBLIC_TAWK_WIDGET_ID &&
           process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID !== 'your-property-id' &&
           process.env.NEXT_PUBLIC_TAWK_WIDGET_ID !== 'your-widget-id',
  position: (process.env.NEXT_PUBLIC_TAWK_POSITION as any) || 'bottom-right',
  theme: (process.env.NEXT_PUBLIC_TAWK_THEME as any) || 'auto',
  showOnMobile: process.env.NEXT_PUBLIC_TAWK_SHOW_MOBILE !== 'false',
  showOnDesktop: process.env.NEXT_PUBLIC_TAWK_SHOW_DESKTOP !== 'false',
  autoStart: process.env.NEXT_PUBLIC_TAWK_AUTO_START === 'true',
  greetingMessage: process.env.NEXT_PUBLIC_TAWK_GREETING_MESSAGE || 'Hello! How can we help you today?',
  offlineMessage: process.env.NEXT_PUBLIC_TAWK_OFFLINE_MESSAGE || 'We are currently offline. Please leave a message and we will get back to you soon.',
  customCSS: `
    /* Custom Tawk.to styling */
    .tawk-widget {
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    }
    
    .tawk-widget-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border-radius: 12px 12px 0 0 !important;
    }
    
    .tawk-widget-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border-radius: 50% !important;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4) !important;
    }
    
    .tawk-widget-button:hover {
      transform: scale(1.05) !important;
      transition: transform 0.2s ease !important;
    }
    
    .tawk-message {
      border-radius: 18px !important;
      margin: 8px 0 !important;
    }
    
    .tawk-message-sent {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
    }
    
    .tawk-message-received {
      background: #f5f5f5 !important;
      color: #333 !important;
    }
    
    .tawk-input {
      border-radius: 24px !important;
      border: 2px solid #e0e0e0 !important;
      padding: 12px 16px !important;
    }
    
    .tawk-input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
    
    .tawk-send-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border-radius: 50% !important;
      border: none !important;
    }
    
    .tawk-send-button:hover {
      transform: scale(1.1) !important;
      transition: transform 0.2s ease !important;
    }
    
    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      .tawk-widget {
        background: #1a1a1a !important;
        color: #ffffff !important;
      }
      
      .tawk-message-received {
        background: #2d2d2d !important;
        color: #ffffff !important;
      }
      
      .tawk-input {
        background: #2d2d2d !important;
        color: #ffffff !important;
        border-color: #404040 !important;
      }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .tawk-widget {
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 9999 !important;
      }
      
      .tawk-widget-header {
        border-radius: 0 !important;
      }
    }
  `,
  customJS: `
    // Custom JavaScript for Tawk.to
    window.addEventListener('load', function() {
      // Add custom event listeners
      if (window.Tawk_API) {
        // Custom greeting based on time of day
        const hour = new Date().getHours();
        let greeting = 'Hello! How can we help you today?';
        
        if (hour < 12) {
          greeting = 'Good morning! How can we help you today?';
        } else if (hour < 18) {
          greeting = 'Good afternoon! How can we help you today?';
        } else {
          greeting = 'Good evening! How can we help you today?';
        }
        
        // Set custom greeting
        window.Tawk_API.setGreetingMessage(greeting);
        
        // Add custom user tracking
        window.Tawk_API.setAttributes({
          'page_url': window.location.href,
          'page_title': document.title,
          'user_agent': navigator.userAgent,
          'screen_resolution': screen.width + 'x' + screen.height,
          'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        
        // Track page views
        window.Tawk_API.onChatStarted = function() {
          // Track chat started event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'chat_started', {
              'event_category': 'engagement',
              'event_label': 'tawk_chat'
            });
          }
        };
        
        // Track chat ended
        window.Tawk_API.onChatEnded = function() {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'chat_ended', {
              'event_category': 'engagement',
              'event_label': 'tawk_chat'
            });
          }
        };
        
        // Track message sent
        window.Tawk_API.onMessageSent = function(message) {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'message_sent', {
              'event_category': 'engagement',
              'event_label': 'tawk_message'
            });
          }
        };
      }
    });
  `,
};

// Widget positions
export const tawkPositions = {
  'bottom-right': 'bottom-right',
  'bottom-left': 'bottom-left',
  'top-right': 'top-right',
  'top-left': 'top-left',
} as const;

// Widget themes
export const tawkThemes = {
  'light': 'light',
  'dark': 'dark',
  'auto': 'auto',
} as const;

// Chat status types
export const tawkChatStatus = {
  'online': 'online',
  'offline': 'offline',
  'away': 'away',
  'busy': 'busy',
} as const;

// Event types
export const tawkEvents = {
  'chat_started': 'chat_started',
  'chat_ended': 'chat_ended',
  'message_sent': 'message_sent',
  'message_received': 'message_received',
  'widget_opened': 'widget_opened',
  'widget_closed': 'widget_closed',
  'agent_joined': 'agent_joined',
  'agent_left': 'agent_left',
} as const;

// Check if Tawk.to is properly configured
export function isTawkConfigured(): boolean {
  return !!(
    tawkConfig.propertyId &&
    tawkConfig.widgetId &&
    tawkConfig.enabled &&
    tawkConfig.propertyId !== 'your-property-id' &&
    tawkConfig.widgetId !== 'your-widget-id'
  );
}

// Get Tawk.to configuration for a specific environment
export function getTawkConfigForEnvironment(environment: 'development' | 'production'): TawkConfig {
  const baseConfig = { ...tawkConfig };
  
  if (environment === 'development') {
    // Development-specific settings
    baseConfig.autoStart = false;
    baseConfig.greetingMessage = 'Hello from development! How can we help you today?';
    baseConfig.offlineMessage = 'Development mode - We are currently offline.';
  } else {
    // Production-specific settings
    baseConfig.autoStart = true;
    baseConfig.greetingMessage = 'Hello! How can we help you today?';
    baseConfig.offlineMessage = 'We are currently offline. Please leave a message and we will get back to you soon.';
  }
  
  return baseConfig;
}

// Environment validation
export function validateTawkEnvironment(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID) {
    errors.push('NEXT_PUBLIC_TAWK_PROPERTY_ID is not set');
  }

  if (!process.env.NEXT_PUBLIC_TAWK_WIDGET_ID) {
    errors.push('NEXT_PUBLIC_TAWK_WIDGET_ID is not set');
  }

  if (process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID === 'your-property-id') {
    errors.push('NEXT_PUBLIC_TAWK_PROPERTY_ID is using placeholder value');
  }

  if (process.env.NEXT_PUBLIC_TAWK_WIDGET_ID === 'your-widget-id') {
    errors.push('NEXT_PUBLIC_TAWK_WIDGET_ID is using placeholder value');
  }

  const position = process.env.NEXT_PUBLIC_TAWK_POSITION;
  if (position && !Object.values(tawkPositions).includes(position as any)) {
    errors.push('NEXT_PUBLIC_TAWK_POSITION must be one of: bottom-right, bottom-left, top-right, top-left');
  }

  const theme = process.env.NEXT_PUBLIC_TAWK_THEME;
  if (theme && !Object.values(tawkThemes).includes(theme as any)) {
    errors.push('NEXT_PUBLIC_TAWK_THEME must be one of: light, dark, auto');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Development mode configuration
export const isDevelopment = process.env.NODE_ENV === 'development';

// Tawk.to widget configuration
export const tawkWidgetConfig = {
  // Widget dimensions
  width: 350,
  height: 500,
  
  // Widget behavior
  autoOpen: false,
  autoClose: false,
  
  // Widget appearance
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  
  // Widget animations
  animationDuration: 300,
  animationType: 'fade',
  
  // Widget responsiveness
  mobileBreakpoint: 768,
  mobileFullScreen: true,
  
  // Widget features
  showAgentInfo: true,
  showStatusIndicator: true,
  showNotifications: true,
  showTypingIndicator: true,
  showMessageTime: true,
  showMessageStatus: true,
  
  // Widget customization
  customColors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  
  // Widget sounds
  enableSounds: true,
  soundVolume: 0.5,
  
  // Widget accessibility
  enableKeyboardNavigation: true,
  enableScreenReader: true,
  enableHighContrast: false,
  
  // Widget analytics
  enableAnalytics: true,
  trackEvents: true,
  trackUserBehavior: true,
};
