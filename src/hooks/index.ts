import { useState, useEffect } from 'react'

export const useDebounce = (value: any, delay: number) => {
  // We use useState so that our returned calue can be used in useEffect hook
  const [debouncedValue, setDebouncedValue] = useState(value);
  // On update to value, we set a timeout to write to debounceValue after delay amount of milliseconds. 
  // If value is updated before timeout, our timeout is cleaned up because of how useEffect works
  useEffect(
    () => {
      const timeoutHandler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Every time this is called, the last timeOuthandler is cleared
      return () => {
        clearTimeout(timeoutHandler);
      };
    },

    [value]
  );

  return debouncedValue;
}


export const useFetch = async (url: string, options: any): Promise<any> => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  setLoading(true);
  try {
    const res = await fetch(process.env.REACT_APP_URL + url, options);
    const json = await res.json();
    setData(json);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false)
  }

  return [data, error, loading]
}

/**
 * useGetCookie makes an api call to either get new cookie, or use existing cookie
 * to authenticate user
 * 
 * @returns [data, error, loading]
 */
export const useAuthorizeUser = async () => {
  const options = {
    method: 'post',
  }
  return await useFetch('/users', options)
} 