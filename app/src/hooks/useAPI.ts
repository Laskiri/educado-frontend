// hooks/useApi.js
// eslint-disable @typescript-eslint/no-explicit-any

import { useState, useEffect } from 'react';

type ApiFunction<T, A extends unknown[]> = (...args: A) => Promise<T>;

export const useApi = <T, A extends unknown[]>(apiFunc: ApiFunction<T, A>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        console.log("SumbitLoading is set to:", isLoading);
      }, [isLoading])

    const call = async (...args: A): Promise<T> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiFunc(...args);
            setIsLoading(false);
            return response;
        } catch (error) {
            setError(error as Error);
            setIsLoading(false);
            throw error;
        }
    };

    return { call, isLoading, error };
};