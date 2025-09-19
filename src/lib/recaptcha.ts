import { errorHandler } from './errorHandler';

export interface RecaptchaConfig {
  siteKey: string;
  secretKey: string;
  threshold: number;
  action: string;
  timeout: number;
}

export interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

export interface RecaptchaToken {
  token: string;
  timestamp: number;
  action: string;
  expiresAt: number;
}

class RecaptchaService {
  private config: RecaptchaConfig;
  private scriptLoaded: boolean = false;
  private scriptLoading: boolean = false;
  private grecaptcha: any = null;

  constructor() {
    this.config = {
      siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
      secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
      threshold: parseFloat(process.env.RECAPTCHA_THRESHOLD || '0.5'),
      action: process.env.RECAPTCHA_ACTION || 'submit',
      timeout: parseInt(process.env.RECAPTCHA_TIMEOUT || '30000'),
    };

    if (!this.config.siteKey) {
      console.warn('reCAPTCHA site key not configured');
    }
    
    if (!this.config.secretKey) {
      console.warn('reCAPTCHA secret key not configured');
    }
  }

  /**
   * Load the reCAPTCHA script
   */
  async loadScript(): Promise<void> {
    if (this.scriptLoaded || this.scriptLoading) {
      return;
    }

    this.scriptLoading = true;

    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (typeof window !== 'undefined' && (window as any).grecaptcha) {
        this.grecaptcha = (window as any).grecaptcha;
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.config.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.grecaptcha = (window as any).grecaptcha;
        this.scriptLoaded = true;
        this.scriptLoading = false;
        resolve();
      };

      script.onerror = () => {
        this.scriptLoading = false;
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Execute reCAPTCHA and get token
   */
  async execute(action: string = this.config.action): Promise<RecaptchaToken> {
    try {
      await this.loadScript();

      if (!this.grecaptcha) {
        throw new Error('reCAPTCHA not loaded');
      }

      const token = await this.grecaptcha.execute(this.config.siteKey, { action });
      const timestamp = Date.now();
      const expiresAt = timestamp + this.config.timeout;

      return {
        token,
        timestamp,
        action,
        expiresAt,
      };
    } catch (error) {
      throw errorHandler.handleApiError(error, 'executeRecaptcha');
    }
  }

  /**
   * Verify reCAPTCHA token on server
   */
  async verifyToken(token: string, action?: string): Promise<RecaptchaResponse> {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('reCAPTCHA verification can only be performed in browser environment');
      }

      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          action: action || this.config.action,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Verification failed: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData['error-codes']) {
            errorMessage = `reCAPTCHA error: ${errorData['error-codes'].join(', ')}`;
          }
        } catch {
          // Use the default error message if parsing fails
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Don't throw the error, just log it and return a failure response
      console.warn('reCAPTCHA verification failed:', error);
      return {
        success: false,
        score: 0,
        action: action || this.config.action,
        challenge_ts: new Date().toISOString(),
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        error_codes: ['verification-failed'],
      };
    }
  }

  /**
   * Check if token is valid (not expired)
   */
  isTokenValid(token: RecaptchaToken): boolean {
    return Date.now() < token.expiresAt;
  }

  /**
   * Get cached token or execute new one
   */
  async getValidToken(action: string = this.config.action): Promise<RecaptchaToken> {
    const cacheKey = `recaptcha_token_${action}`;
    const cached = this.getCachedToken(cacheKey);

    if (cached && this.isTokenValid(cached)) {
      return cached;
    }

    const newToken = await this.execute(action);
    this.setCachedToken(cacheKey, newToken);
    return newToken;
  }

  /**
   * Cache token in sessionStorage
   */
  private setCachedToken(key: string, token: RecaptchaToken): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(key, JSON.stringify(token));
      } catch (error) {
        console.warn('Failed to cache reCAPTCHA token:', error);
      }
    }
  }

  /**
   * Get cached token from sessionStorage
   */
  private getCachedToken(key: string): RecaptchaToken | null {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.warn('Failed to get cached reCAPTCHA token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Clear cached tokens
   */
  clearCache(): void {
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
          if (key.startsWith('recaptcha_token_')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear reCAPTCHA cache:', error);
      }
    }
  }

  /**
   * Get reCAPTCHA configuration
   */
  getConfig(): RecaptchaConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RecaptchaConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Check if reCAPTCHA is properly configured
   */
  isConfigured(): boolean {
    return !!this.config.siteKey && !!this.config.secretKey;
  }

  /**
   * Get reCAPTCHA badge element
   */
  getBadgeElement(): HTMLElement | null {
    if (typeof window !== 'undefined') {
      return document.querySelector('.grecaptcha-badge');
    }
    return null;
  }

  /**
   * Hide reCAPTCHA badge
   */
  hideBadge(): void {
    const badge = this.getBadgeElement();
    if (badge) {
      (badge as HTMLElement).style.display = 'none';
    }
  }

  /**
   * Show reCAPTCHA badge
   */
  showBadge(): void {
    const badge = this.getBadgeElement();
    if (badge) {
      (badge as HTMLElement).style.display = 'block';
    }
  }

  /**
   * Reset reCAPTCHA
   */
  reset(): void {
    if (this.grecaptcha && this.grecaptcha.reset) {
      this.grecaptcha.reset();
    }
    this.clearCache();
  }
}

// Create and export a singleton instance
export const recaptchaService = new RecaptchaService();

// Export the class for custom instances
export { RecaptchaService };
