import { RecaptchaConfig } from './recaptcha';

// reCAPTCHA Configuration
export const recaptchaConfig: RecaptchaConfig = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  threshold: parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5'),
  action: process.env.RECAPTCHA_ACTION || 'submit',
  timeout: parseInt(process.env.RECAPTCHA_TIMEOUT || '30000'),
};

// Action types for different forms and interactions
export const recaptchaActions = {
  // Form submissions
  CONTACT_FORM: 'contact_form',
  LOGIN: 'login',
  REGISTER: 'register',
  PASSWORD_RESET: 'password_reset',
  PROFILE_UPDATE: 'profile_update',
  
  // User interactions
  SEARCH: 'search',
  VOTE: 'vote',
  COMMENT: 'comment',
  REVIEW: 'review',
  BOOKMARK: 'bookmark',
  SHARE: 'share',
  
  // API requests
  API_REQUEST: 'api_request',
  DATA_EXPORT: 'data_export',
  BULK_ACTION: 'bulk_action',
  
  // Admin actions
  ADMIN_LOGIN: 'admin_login',
  ADMIN_ACTION: 'admin_action',
  USER_MANAGEMENT: 'user_management',
  
  // E-commerce
  ADD_TO_CART: 'add_to_cart',
  CHECKOUT: 'checkout',
  PAYMENT: 'payment',
  
  // Content creation
  CREATE_POST: 'create_post',
  UPLOAD_MEDIA: 'upload_media',
  EDIT_CONTENT: 'edit_content',
} as const;

// Threshold configurations for different actions
export const recaptchaThresholds = {
  // High security actions
  [recaptchaActions.ADMIN_LOGIN]: 0.8,
  [recaptchaActions.PAYMENT]: 0.8,
  [recaptchaActions.ADMIN_ACTION]: 0.8,
  
  // Medium security actions
  [recaptchaActions.LOGIN]: 0.6,
  [recaptchaActions.REGISTER]: 0.6,
  [recaptchaActions.PASSWORD_RESET]: 0.6,
  [recaptchaActions.CHECKOUT]: 0.6,
  
  // Standard security actions
  [recaptchaActions.CONTACT_FORM]: 0.5,
  [recaptchaActions.SEARCH]: 0.5,
  [recaptchaActions.COMMENT]: 0.5,
  [recaptchaActions.REVIEW]: 0.5,
  [recaptchaActions.API_REQUEST]: 0.5,
  
  // Low security actions
  [recaptchaActions.VOTE]: 0.3,
  [recaptchaActions.BOOKMARK]: 0.3,
  [recaptchaActions.SHARE]: 0.3,
} as const;

// Get threshold for a specific action
export function getThresholdForAction(action: string): number {
  return recaptchaThresholds[action as keyof typeof recaptchaThresholds] || 0.5;
}

// Check if reCAPTCHA is properly configured
export function isRecaptchaConfigured(): boolean {
  return !!(
    recaptchaConfig.siteKey &&
    recaptchaConfig.secretKey &&
    recaptchaConfig.siteKey !== 'your-site-key' &&
    recaptchaConfig.secretKey !== 'your-secret-key'
  );
}

// Get reCAPTCHA configuration for a specific action
export function getRecaptchaConfigForAction(action: string): RecaptchaConfig {
  return {
    ...recaptchaConfig,
    action,
    threshold: getThresholdForAction(action),
  };
}

// Environment validation
export function validateRecaptchaEnvironment(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    errors.push('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set');
  }

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    errors.push('RECAPTCHA_SECRET_KEY is not set');
  }

  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === 'your-site-key') {
    errors.push('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is using placeholder value');
  }

  if (process.env.RECAPTCHA_SECRET_KEY === 'your-secret-key') {
    errors.push('RECAPTCHA_SECRET_KEY is using placeholder value');
  }

  const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5');
  if (threshold < 0 || threshold > 1) {
    errors.push('RECAPTCHA_THRESHOLD must be between 0 and 1');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Development mode configuration
export const isDevelopment = process.env.NODE_ENV === 'development';

// reCAPTCHA badge configuration
export const recaptchaBadgeConfig = {
  // Hide badge in production (optional)
  hideInProduction: false,
  
  // Badge position
  position: 'bottom-right' as const,
  
  // Badge theme
  theme: 'light' as const,
  
  // Badge size
  size: 'normal' as const,
};

// reCAPTCHA script configuration
export const recaptchaScriptConfig = {
  // Load script asynchronously
  async: true,
  
  // Defer script loading
  defer: true,
  
  // Script timeout
  timeout: 10000,
  
  // Retry attempts
  retryAttempts: 3,
  
  // Retry delay
  retryDelay: 1000,
};
