'use client';

import { useState, useCallback } from 'react';
import type { RandomResponse } from '@/types/api';

export function useRandomNumber() {
  const [data, setData] = useState<RandomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useCallback(async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      const result: RandomResponse = await res.json();
      setData(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandom = useCallback(() => {
    fetchApi('/api/random');
  }, [fetchApi]);

  const fetchRandomInRange = useCallback((min: number, max: number) => {
    fetchApi(`/api/random/range/${min}/${max}`);
  }, [fetchApi]);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, fetchRandom, fetchRandomInRange, clearData };
} 