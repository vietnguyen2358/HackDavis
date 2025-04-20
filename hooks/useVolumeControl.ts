"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface VolumeState {
  volume: number;
  isPolling: boolean;
  error: string | null;
}

/**
 * A custom hook that monitors system volume changes by polling an API endpoint
 * @param onVolumeUp - Callback function when volume increases
 * @param onVolumeDown - Callback function when volume decreases
 * @param enabled - Whether the polling is enabled
 * @param interval - Polling interval in ms (default: 200ms)
 */
export function useVolumeControl(
  onVolumeUp: () => void,
  onVolumeDown: () => void,
  enabled: boolean = true,
  interval: number = 200
) {
  const [state, setState] = useState<VolumeState>({
    volume: 0,
    isPolling: false,
    error: null
  });
  
  // Use refs to store the latest callbacks without causing re-renders
  const onVolumeUpRef = useRef(onVolumeUp);
  const onVolumeDownRef = useRef(onVolumeDown);
  const enabledRef = useRef(enabled);
  
  // Update the refs when the callbacks change
  useEffect(() => {
    onVolumeUpRef.current = onVolumeUp;
    onVolumeDownRef.current = onVolumeDown;
    enabledRef.current = enabled;
  }, [onVolumeUp, onVolumeDown, enabled]);

  const startPolling = useCallback(() => {
    setState(prev => ({ ...prev, isPolling: true }));
  }, []);

  const stopPolling = useCallback(() => {
    setState(prev => ({ ...prev, isPolling: false }));
  }, []);

  useEffect(() => {
    if (!enabledRef.current) {
      stopPolling();
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let isMounted = true;
    let lastVolumeValue = 0;

    const pollVolume = async () => {
      if (!enabledRef.current) return;
      
      try {
        const response = await fetch('/api/system-volume');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch volume: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          // Update volume state only if it changed significantly
          if (Math.abs(data.volume - lastVolumeValue) > 0) {
            setState(prev => ({
              ...prev,
              volume: data.volume,
              error: null
            }));
            
            lastVolumeValue = data.volume;
          }
          
          // Trigger callbacks based on volume change
          if (data.change === 'up' && enabledRef.current) {
            onVolumeUpRef.current();
          } else if (data.change === 'down' && enabledRef.current) {
            onVolumeDownRef.current();
          }
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : 'Unknown error'
          }));
        }
      }
      
      // Continue polling if still enabled and mounted
      if (isMounted && enabledRef.current) {
        timeoutId = setTimeout(pollVolume, interval);
      }
    };

    startPolling();
    pollVolume();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      stopPolling();
    };
  }, [interval, startPolling, stopPolling]); // Dependencies reduced to stable values

  return {
    volume: state.volume,
    isPolling: state.isPolling,
    error: state.error,
    startPolling,
    stopPolling
  };
} 