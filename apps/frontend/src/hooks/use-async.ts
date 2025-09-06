// src/hooks/use-async.ts
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface State<D> {
  data: D | null;
  error: Error | null;
  status: 'idle' | 'loading' | 'error' | 'success';
}

export function useAsync<D = unknown>(initialState?: State<D>) {
  const [state, setState] = useState<State<D>>({
    data: null,
    error: null,
    status: 'idle',
    ...initialState,
  });
  const { toast } = useToast();

  const setData = useCallback((data: D) => {
    setState({
      data,
      error: null,
      status: 'success',
    });
  }, []);

  const setError = useCallback(
    (error: Error) => {
      setState({
        data: null,
        error,
        status: 'error',
      });

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    [toast]
  );

  const reset = useCallback(
    () =>
      setState({
        data: null,
        error: null,
        status: 'idle',
      }),
    []
  );

  const run = useCallback(
    async (promise: Promise<D>) => {
      if (!promise || !promise.then) {
        throw new Error('Parameter must be a Promise');
      }

      setState(prev => ({ ...prev, status: 'loading' }));

      try {
        const data = await promise;
        setData(data);
        return data;
      } catch (error) {
        setError(error as Error);
        return Promise.reject(error);
      }
    },
    [setData, setError]
  );

  return {
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    run,
    setData,
    setError,
    reset,
    ...state,
  };
}
