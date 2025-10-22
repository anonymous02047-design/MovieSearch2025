'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger (in pixels)
  rootMargin?: string; // Margin around root
}

export function useInfiniteScroll<T>(
  fetchMore: (page: number) => Promise<T[]>,
  initialPage: number = 1,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 300, rootMargin = '0px' } = options;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Load more items
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchMore(page);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'));
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchMore]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, loading, hasMore, rootMargin]);

  // Reset function
  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    items,
    loading,
    hasMore,
    error,
    observerTarget,
    loadMore,
    reset,
  };
}

// Alternative: Scroll event based infinite scroll
export function useScrollInfiniteLoad(
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 300 } = options;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < threshold) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, threshold]);
}

