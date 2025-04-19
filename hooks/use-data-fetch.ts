"use client"

import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// In-memory cache
const globalCache: Record<string, CacheItem<any>> = {};

interface UseFetchOptions {
  cacheTime?: number; // How long to cache data in milliseconds (default: 5 min)
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | null; // Auto refetch interval in ms
  initialData?: any;
}

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isValidating: boolean; // When revalidating cache
}

export function useDataFetch<T = any>(
  url: string | null,
  options: UseFetchOptions = {}
) {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes default cache
    refetchOnWindowFocus = true,
    refetchInterval = null,
    initialData = null,
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isValidating: false,
  });

  const activeRequestRef = useRef<AbortController | null>(null);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef(true);

  const fetchData = useCallback(
    async (skipCache = false) => {
      if (!url) return;

      // Check cache first if not skipping
      if (!skipCache && globalCache[url]) {
        const cacheItem = globalCache[url];
        const now = Date.now();
        
        // If cache is still valid
        if (now - cacheItem.timestamp < cacheTime) {
          setState(prev => ({ 
            ...prev, 
            data: cacheItem.data,
            isLoading: false,
            isValidating: false 
          }));
          return;
        }
        
        // Cache exists but expired, use it but revalidate
        setState(prev => ({ 
          ...prev, 
          data: cacheItem.data,
          isValidating: true,
          isLoading: false
        }));
      } else {
        // No cache, start loading
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      }

      // Abort previous request if exists
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      activeRequestRef.current = abortController;

      try {
        const response = await fetch(url, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Update cache
        globalCache[url] = {
          data,
          timestamp: Date.now(),
        };

        // Update state if component is still mounted
        if (isMountedRef.current) {
          setState({
            data,
            isLoading: false,
            error: null,
            isValidating: false,
          });
        }
      } catch (error: any) {
        // Ignore abort errors
        if (error.name === 'AbortError') return;

        // Update state with error if component is still mounted
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            error,
            isLoading: false,
            isValidating: false,
          }));
        }
      } finally {
        if (activeRequestRef.current === abortController) {
          activeRequestRef.current = null;
        }
      }
    },
    [url, cacheTime]
  );

  // Effect to handle window focus revalidation
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      fetchData(false);
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchData, refetchOnWindowFocus]);

  // Effect to handle interval revalidation
  useEffect(() => {
    if (!refetchInterval || !url) return;

    const startInterval = () => {
      refetchTimeoutRef.current = setTimeout(() => {
        fetchData(false).finally(() => {
          if (isMountedRef.current) {
            startInterval();
          }
        });
      }, refetchInterval);
    };

    startInterval();

    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, [fetchData, refetchInterval, url]);

  // Initial fetch and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    if (url) {
      fetchData(false);
    }

    return () => {
      isMountedRef.current = false;
      
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, [url, fetchData]);

  // Refetch method (for manual refetching)
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return {
    ...state,
    refetch,
  };
} 