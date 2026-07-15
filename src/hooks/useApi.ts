'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApiGet<T>(endpoint: string, params?: Record<string, string>) {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null });
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const query = new URLSearchParams();
      if (paramsRef.current) Object.entries(paramsRef.current).forEach(([k, v]) => { if (v) query.set(k, v); });
      const qs = query.toString();
      const res = await api.get(`${endpoint}${qs ? '?' + qs : ''}`);
      setState({ data: res.data.data, loading: false, error: null });
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.response?.data?.error || 'Something went wrong' });
    }
  }, [endpoint]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useApiMutation<T, B = unknown>(endpoint: string, method: 'POST' | 'DELETE' = 'POST') {
  const [state, setState] = useState<{ loading: boolean; error: string | null; success: boolean }>({ loading: false, error: null, success: false });

  const mutate = useCallback(async (body?: B, id?: string) => {
    setState({ loading: true, error: null, success: false });
    try {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const res = method === 'DELETE' ? await api.delete(url) : await api.post(url, body);
      setState({ loading: false, error: null, success: true });
      return res.data as { success: boolean; data: T; message?: string };
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setState({ loading: false, error: msg, success: false });
      throw new Error(msg);
    }
  }, [endpoint, method]);

  return { ...state, mutate };
}