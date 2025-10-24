/**
 * Advanced Resource Prefetching, Preloading, and Preconnecting
 * Optimizes page load performance
 */

/**
 * Preconnect to external domains
 */
export const preconnect = (url: string, crossOrigin: 'anonymous' | 'use-credentials' | '' = '') => {
  if (typeof window === 'undefined') return;

  // Check if already exists
  const existing = document.querySelector(`link[rel="preconnect"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  if (crossOrigin) {
    link.crossOrigin = crossOrigin;
  }
  document.head.appendChild(link);
};

/**
 * DNS prefetch for faster domain resolution
 */
export const dnsPrefetch = (url: string) => {
  if (typeof window === 'undefined') return;

  const existing = document.querySelector(`link[rel="dns-prefetch"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Preload critical resources
 */
export const preload = (
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch',
  options: {
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    media?: string;
  } = {}
) => {
  if (typeof window === 'undefined') return;

  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  if (options.type) link.type = options.type;
  if (options.crossOrigin) link.crossOrigin = options.crossOrigin;
  if (options.media) link.media = options.media;

  document.head.appendChild(link);
};

/**
 * Prefetch resources for future navigation
 */
export const prefetch = (url: string, as?: 'document' | 'script' | 'style') => {
  if (typeof window === 'undefined') return;

  const existing = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  if (as) link.as = as;

  document.head.appendChild(link);
};

/**
 * Prerender entire page for instant navigation
 */
export const prerender = (url: string) => {
  if (typeof window === 'undefined') return;

  const existing = document.querySelector(`link[rel="prerender"][href="${url}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'prerender';
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Initialize all critical resource hints
 */
export const initializeResourceHints = () => {
  // Preconnect to critical domains
  preconnect('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com', 'anonymous');
  preconnect('https://api.themoviedb.org');
  preconnect('https://image.tmdb.org');
  
  // DNS Prefetch for additional domains
  dnsPrefetch('https://www.google-analytics.com');
  dnsPrefetch('https://www.googletagmanager.com');
  dnsPrefetch('https://cdn.jsdelivr.net');
  
  // Preload critical fonts
  preload('/fonts/Roboto-Regular.woff2', 'font', {
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  });
};

/**
 * Prefetch movie images on hover
 */
export const prefetchMovieImages = (posterPath: string, backdropPath?: string) => {
  if (posterPath) {
    const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
    prefetch(posterUrl);
  }
  if (backdropPath) {
    const backdropUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;
    prefetch(backdropUrl);
  }
};

/**
 * Prefetch route on link hover
 */
export const prefetchRoute = (path: string) => {
  prefetch(path, 'document');
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, options);

    observer.observe(img);
    return observer;
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src;
  }
};

/**
 * Prefetch API data
 */
export const prefetchData = async (url: string): Promise<void> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
    });
    
    if (response.ok) {
      // Store in cache
      if ('caches' in window) {
        const cache = await caches.open('api-prefetch');
        await cache.put(url, response.clone());
      }
    }
  } catch (error) {
    console.warn('Prefetch failed:', url, error);
  }
};

/**
 * Get prefetched data from cache
 */
export const getPrefetchedData = async (url: string): Promise<Response | undefined> => {
  if ('caches' in window) {
    const cache = await caches.open('api-prefetch');
    return await cache.match(url);
  }
};

/**
 * Module preload for dynamic imports
 */
export const modulePreload = (path: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = path;
  document.head.appendChild(link);
};

/**
 * Batch prefetch multiple resources
 */
export const batchPrefetch = (urls: string[], type: 'prefetch' | 'preload' = 'prefetch') => {
  urls.forEach((url) => {
    if (type === 'prefetch') {
      prefetch(url);
    } else {
      preload(url, 'fetch');
    }
  });
};

export default {
  preconnect,
  dnsPrefetch,
  preload,
  prefetch,
  prerender,
  prefetchRoute,
  prefetchMovieImages,
  prefetchData,
  getPrefetchedData,
  lazyLoadImage,
  modulePreload,
  batchPrefetch,
  initializeResourceHints,
};

