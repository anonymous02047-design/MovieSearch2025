'use client';

import { useEffect } from 'react';
import { initializeResourceHints } from '@/lib/prefetch';

/**
 * Initialize resource hints for performance optimization
 */
export default function ResourceHints() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeResourceHints();
    }
  }, []);

  return null;
}

