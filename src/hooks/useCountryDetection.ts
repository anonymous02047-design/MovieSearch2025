'use client';

import { useState, useEffect } from 'react';

export interface CountryData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  currency: string;
  language: string;
  flag: string;
}

const STORAGE_KEY = 'user_country_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useCountryDetection = () => {
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    detectCountry();
  }, []);

  const detectCountry = async () => {
    try {
      // Check cached data first
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setCountryData(data);
          setLoading(false);
          return;
        }
      }

      // Try multiple geolocation services
      const data = await fetchCountryData();
      
      if (data) {
        setCountryData(data);
        // Cache the result
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      setLoading(false);
    } catch (err) {
      console.error('Country detection error:', err);
      setError('Failed to detect country');
      setLoading(false);
      
      // Fallback to default
      const fallbackData: CountryData = {
        country: 'United States',
        countryCode: 'US',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC',
        currency: 'USD',
        language: 'en',
        flag: '🇺🇸'
      };
      setCountryData(fallbackData);
    }
  };

  const fetchCountryData = async (): Promise<CountryData> => {
    // Try ipapi.co first (free, no API key required)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code) {
        return {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code,
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          currency: data.currency || 'USD',
          language: data.languages?.split(',')[0]?.toLowerCase() || 'en',
          flag: getCountryFlag(data.country_code)
        };
      }
    } catch (err) {
      console.error('ipapi.co failed:', err);
    }

    // Fallback to ip-api.com
    try {
      const response = await fetch('http://ip-api.com/json/');
      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          country: data.country || 'Unknown',
          countryCode: data.countryCode,
          region: data.regionName || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          currency: getCurrencyByCountry(data.countryCode),
          language: getLanguageByCountry(data.countryCode),
          flag: getCountryFlag(data.countryCode)
        };
      }
    } catch (err) {
      console.error('ip-api.com failed:', err);
    }

    // Last resort: use browser timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryFromTZ = getCountryFromTimezone(timezone);
    
    return {
      country: countryFromTZ.country,
      countryCode: countryFromTZ.code,
      region: 'Unknown',
      city: 'Unknown',
      timezone: timezone,
      currency: getCurrencyByCountry(countryFromTZ.code),
      language: navigator.language.split('-')[0] || 'en',
      flag: getCountryFlag(countryFromTZ.code)
    };
  };

  const refreshCountry = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLoading(true);
    detectCountry();
  };

  return {
    countryData,
    loading,
    error,
    refreshCountry
  };
};

// Helper functions
const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'IN': '🇮🇳',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'BR': '🇧🇷',
    'MX': '🇲🇽', 'AR': '🇦🇷', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳',
    'RU': '🇷🇺', 'TR': '🇹🇷', 'SA': '🇸🇦', 'AE': '🇦🇪', 'ZA': '🇿🇦',
    'NG': '🇳🇬', 'EG': '🇪🇬', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭',
    'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'PL': '🇵🇱',
  };
  return flags[countryCode] || '🌍';
};

const getCurrencyByCountry = (countryCode: string): string => {
  const currencies: Record<string, string> = {
    'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'IN': 'INR',
    'DE': 'EUR', 'FR': 'EUR', 'ES': 'EUR', 'IT': 'EUR', 'BR': 'BRL',
    'MX': 'MXN', 'AR': 'ARS', 'JP': 'JPY', 'KR': 'KRW', 'CN': 'CNY',
    'RU': 'RUB', 'TR': 'TRY', 'SA': 'SAR', 'AE': 'AED', 'ZA': 'ZAR',
  };
  return currencies[countryCode] || 'USD';
};

const getLanguageByCountry = (countryCode: string): string => {
  const languages: Record<string, string> = {
    'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'IN': 'hi',
    'DE': 'de', 'FR': 'fr', 'ES': 'es', 'IT': 'it', 'BR': 'pt',
    'MX': 'es', 'AR': 'es', 'JP': 'ja', 'KR': 'ko', 'CN': 'zh',
    'RU': 'ru', 'TR': 'tr', 'SA': 'ar', 'AE': 'ar', 'ZA': 'en',
  };
  return languages[countryCode] || 'en';
};

const getCountryFromTimezone = (timezone: string): { country: string; code: string } => {
  const tzMap: Record<string, { country: string; code: string }> = {
    'America/New_York': { country: 'United States', code: 'US' },
    'America/Chicago': { country: 'United States', code: 'US' },
    'America/Denver': { country: 'United States', code: 'US' },
    'America/Los_Angeles': { country: 'United States', code: 'US' },
    'Europe/London': { country: 'United Kingdom', code: 'GB' },
    'Europe/Paris': { country: 'France', code: 'FR' },
    'Europe/Berlin': { country: 'Germany', code: 'DE' },
    'Asia/Kolkata': { country: 'India', code: 'IN' },
    'Asia/Tokyo': { country: 'Japan', code: 'JP' },
    'Asia/Shanghai': { country: 'China', code: 'CN' },
    'Australia/Sydney': { country: 'Australia', code: 'AU' },
  };
  
  return tzMap[timezone] || { country: 'United States', code: 'US' };
};

