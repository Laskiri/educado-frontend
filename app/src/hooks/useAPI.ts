// hooks/useApi.js
import { useState } from 'react';
import { useEffect } from 'react';
export const useApi = (apiFunc) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        console.log("SumbitLoading is set to:", isLoading);
      }, [isLoading])

    const call = async (...args) => {
        console.log("My error API call arguments:", args);
        setIsLoading(true);
        setError(null);
        try {
        
        const response = await apiFunc(...args);
        setIsLoading(false);
        return response;
      } catch (error) {
        console.error("My error API call error:", error);
        setError(error);
        setIsLoading(false);
        throw error;
      }
    };

    return { call, isLoading, error };
  };