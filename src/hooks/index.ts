import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'


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