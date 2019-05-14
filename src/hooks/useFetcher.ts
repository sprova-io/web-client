import { useEffect, useState } from 'react';

export type Fetcher<T> = (...args: any[]) => Promise<T>;

export function useFetcher<T>(fetcher: Fetcher<T>, ...args: any[]) {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const fetchedData = await fetcher(...args);
        setData(fetchedData);
      } catch (error) {
        setError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [...args]);

  return { data, setData, error, isLoading };
}
