'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAdsProps {
  adClient?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adStyle?: React.CSSProperties;
  className?: string;
  fullWidth?: boolean;
}

export default function GoogleAds({
  adClient = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT,
  adSlot,
  adFormat = 'auto',
  adLayout,
  adStyle = {},
  className = '',
  fullWidth = false,
}: GoogleAdsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && adClient) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adClient]);

  if (!adClient) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div 
          className={className}
          style={{
            ...adStyle,
            background: '#f0f0f0',
            padding: '20px',
            textAlign: 'center',
            color: '#666',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(fullWidth && { width: '100%' }),
          }}
        >
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📢</div>
            <div style={{ fontSize: '14px' }}>Google Ad Placeholder</div>
            <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
              Add NEXT_PUBLIC_GOOGLE_ADS_CLIENT to show ads
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <ins
        className={`adsbygoogle ${className}`}
        style={{
          display: 'block',
          ...adStyle,
          ...(fullWidth && { width: '100%' }),
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </>
  );
}

// Pre-configured ad components
export function DisplayAd({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <GoogleAds
      adFormat="auto"
      fullWidth
      className={className}
      adStyle={style}
    />
  );
}

export function InFeedAd({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <GoogleAds
      adFormat="fluid"
      adLayout="in-article"
      className={className}
      adStyle={style}
    />
  );
}

export function MultiplexAd({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <GoogleAds
      adFormat="autorelaxed"
      className={className}
      adStyle={style}
    />
  );
}

// AdSense Script Component
export function GoogleAdsScript() {
  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT;

  if (!adClient) return null;

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

