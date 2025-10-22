/**
 * Custom hook for country detection and recommendations
 */

import { useState, useEffect } from 'react';
import {
  detectCountryFromIP,
  detectCountryFromTimezone,
  getCountryByCode,
  type Country,
} from '@/utils/countries';

export interface CountryDetectionResult {
  country: Country | null;
  loading: boolean;
  error: string | null;
  detectionMethod: 'ip' | 'timezone' | 'manual' | null;
}

export function useCountryDetection() {
  const [result, setResult] = useState<CountryDetectionResult>({
    country: null,
    loading: true,
    error: null,
    detectionMethod: null,
  });

  useEffect(() => {
    detectCountry();
  }, []);

  const detectCountry = async () => {
    try {
      setResult(prev => ({ ...prev, loading: true, error: null }));

      // Check localStorage first
      const saved = localStorage.getItem('detectedCountry');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const country = getCountryByCode(parsed.code);
          if (country) {
            setResult({
              country,
              loading: false,
              error: null,
              detectionMethod: parsed.method || 'manual',
            });
            return;
          }
        } catch (e) {
          // Invalid saved data, continue with detection
          localStorage.removeItem('detectedCountry');
        }
      }

      // Try IP-based detection first
      const ipCountry = await detectCountryFromIP();
      if (ipCountry) {
        const detectionData = {
          code: ipCountry.code,
          method: 'ip' as const,
          timestamp: Date.now(),
        };
        localStorage.setItem('detectedCountry', JSON.stringify(detectionData));
        setResult({
          country: ipCountry,
          loading: false,
          error: null,
          detectionMethod: 'ip',
        });
        return;
      }

      // Fallback to timezone-based detection
      const timezoneCountry = detectCountryFromTimezone();
      if (timezoneCountry) {
        const detectionData = {
          code: timezoneCountry.code,
          method: 'timezone' as const,
          timestamp: Date.now(),
        };
        localStorage.setItem('detectedCountry', JSON.stringify(detectionData));
        setResult({
          country: timezoneCountry,
          loading: false,
          error: null,
          detectionMethod: 'timezone',
        });
        return;
      }

      // If all fails, use default (US)
      const defaultCountry = getCountryByCode('US');
      setResult({
        country: defaultCountry || null,
        loading: false,
        error: 'Could not detect country, using default',
        detectionMethod: null,
      });
    } catch (error) {
      console.error('Country detection error:', error);
      setResult({
        country: getCountryByCode('US') || null,
        loading: false,
        error: 'Detection failed, using default country',
        detectionMethod: null,
      });
    }
  };

  const setManualCountry = (countryCode: string) => {
    const country = getCountryByCode(countryCode);
    if (country) {
      const detectionData = {
        code: country.code,
        method: 'manual' as const,
        timestamp: Date.now(),
      };
      localStorage.setItem('detectedCountry', JSON.stringify(detectionData));
      setResult({
        country,
        loading: false,
        error: null,
        detectionMethod: 'manual',
      });
    }
  };

  const resetCountry = () => {
    localStorage.removeItem('detectedCountry');
    detectCountry();
  };

  return {
    ...result,
    setManualCountry,
    resetCountry,
    refresh: detectCountry,
  };
}
