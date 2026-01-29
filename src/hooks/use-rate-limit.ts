"use client";

import { useRef, useCallback } from "react";

const RATE_LIMIT_MS = 2000;

export function useRateLimit() {
  const lastCallRef = useRef<number>(0);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    
    if (timeSinceLastCall < RATE_LIMIT_MS) {
      return false;
    }
    
    lastCallRef.current = now;
    return true;
  }, []);

  const getRemainingTime = useCallback((): number => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    return Math.max(0, RATE_LIMIT_MS - timeSinceLastCall);
  }, []);

  return { checkRateLimit, getRemainingTime };
}
