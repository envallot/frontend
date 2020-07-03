import { useState } from 'react'
/**
 * useGetCookie makes an api call to either get new cookie, or use existing cookie
 * to authenticate user
 * 
 * @returns [data, error, loading]
 */
export const useGetCookie = () => {

  // useFetch to make call to backend go get cookie. 

}

export function useFetch(url: string, options: any) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      setData(json);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false)
    }
  }
  fetchData()

  return [data, error, loading]

}