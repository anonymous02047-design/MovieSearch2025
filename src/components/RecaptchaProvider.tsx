'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { recaptchaService, RecaptchaConfig } from '@/lib/recaptcha';

interface RecaptchaContextType {
  isLoaded: boolean;
  isConfigured: boolean;
  config: RecaptchaConfig;
  error: string | null;
  loadScript: () => Promise<void>;
  execute: (action?: string) => Promise<any>;
  verify: (token: string, action?: string) => Promise<any>;
  reset: () => void;
  clearCache: () => void;
}

const RecaptchaContext = createContext<RecaptchaContextType | null>(null);

interface RecaptchaProviderProps {
  children: ReactNode;
  config?: Partial<RecaptchaConfig>;
  autoLoad?: boolean;
  hideBadge?: boolean;
}

export function RecaptchaProvider({
  children,
  config,
  autoLoad = true,
  hideBadge = false,
}: RecaptchaProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update configuration if provided
    if (config) {
      recaptchaService.updateConfig(config);
    }

    // Check if reCAPTCHA is configured
    setIsConfigured(recaptchaService.isConfigured());

    // Auto-load script if enabled
    if (autoLoad && recaptchaService.isConfigured()) {
      loadScript();
    }

    // Hide badge if requested
    if (hideBadge) {
      recaptchaService.hideBadge();
    }
  }, [config, autoLoad, hideBadge]);

  const loadScript = async () => {
    try {
      setError(null);
      await recaptchaService.loadScript();
      setIsLoaded(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load reCAPTCHA');
      setIsLoaded(false);
    }
  };

  const execute = async (action?: string) => {
    if (!isLoaded) {
      await loadScript();
    }
    return recaptchaService.execute(action);
  };

  const verify = async (token: string, action?: string) => {
    return recaptchaService.verifyToken(token, action);
  };

  const reset = () => {
    recaptchaService.reset();
  };

  const clearCache = () => {
    recaptchaService.clearCache();
  };

  const contextValue: RecaptchaContextType = {
    isLoaded,
    isConfigured,
    config: recaptchaService.getConfig(),
    error,
    loadScript,
    execute,
    verify,
    reset,
    clearCache,
  };

  return (
    <RecaptchaContext.Provider value={contextValue}>
      {children}
    </RecaptchaContext.Provider>
  );
}

export function useRecaptchaContext(): RecaptchaContextType {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error('useRecaptchaContext must be used within a RecaptchaProvider');
  }
  return context;
}
