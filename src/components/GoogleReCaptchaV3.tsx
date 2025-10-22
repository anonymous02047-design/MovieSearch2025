'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface ReCaptchaV3Props {
  siteKey?: string;
  action?: string;
  onVerify?: (token: string) => void;
  onError?: (error: Error) => void;
}

export function useReCaptchaV3() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    }
  }, [isLoaded]);

  const executeRecaptcha = useCallback(async (action: string = 'submit'): Promise<string> => {
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured');
      return '';
    }

    if (!isReady || !window.grecaptcha) {
      throw new Error('reCAPTCHA not ready');
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      throw error;
    }
  }, [siteKey, isReady]);

  return {
    isLoaded,
    isReady,
    executeRecaptcha,
    setIsLoaded,
  };
}

export default function GoogleReCaptchaV3({
  siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  action = 'homepage',
  onVerify,
  onError,
}: ReCaptchaV3Props) {
  const { executeRecaptcha, setIsLoaded } = useReCaptchaV3();

  const handleLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    const verify = async () => {
      if (!siteKey || !onVerify) return;

      try {
        const token = await executeRecaptcha(action);
        if (token) {
          onVerify(token);
        }
      } catch (error) {
        if (onError) {
          onError(error as Error);
        }
      }
    };

    verify();
  }, [siteKey, action, onVerify, onError, executeRecaptcha]);

  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured. reCAPTCHA will not be loaded.');
    }
    return null;
  }

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      onLoad={handleLoad}
      strategy="afterInteractive"
    />
  );
}

// Server-side verification utility
export async function verifyRecaptchaToken(
  token: string,
  secretKey?: string
): Promise<{ success: boolean; score?: number; action?: string; hostname?: string; error?: string }> {
  const secret = secretKey || process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return { success: false, error: 'reCAPTCHA secret key not configured' };
  }

  if (!token) {
    return { success: false, error: 'No token provided' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secret}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data['error-codes']?.join(', ') || 'Verification failed',
      };
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

// Higher-order component to protect forms
export function withRecaptcha<P extends object>(
  Component: React.ComponentType<P>,
  action: string = 'submit'
) {
  return function RecaptchaProtectedComponent(props: P & { onRecaptchaVerify?: (token: string) => void }) {
    const { onRecaptchaVerify, ...rest } = props;
    const { executeRecaptcha, isReady } = useReCaptchaV3();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const verify = async () => {
        if (isReady && !verified) {
          try {
            const token = await executeRecaptcha(action);
            if (token && onRecaptchaVerify) {
              onRecaptchaVerify(token);
            }
            setVerified(true);
          } catch (error) {
            console.error('reCAPTCHA verification error:', error);
          }
        }
      };

      verify();
    }, [isReady, verified, executeRecaptcha, onRecaptchaVerify]);

    return <Component {...(rest as P)} />;
  };
}

