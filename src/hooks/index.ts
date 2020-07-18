import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

export const useDebounce = (value:any, delay:number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const timeoutHandler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below). 
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(timeoutHandler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
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