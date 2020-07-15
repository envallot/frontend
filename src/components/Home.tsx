import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { Loader } from './index'
import axios from 'axios'

class NetworkError {
  message: string
  code: string
  name: string
  constructor(code: string, name: string, message: string) {
    this.code = code
    this.name = name
    this.message = message
  }
}

interface User {
  authorized: boolean,
  id: string,
}

interface HomePropType {
  setUser: (arg0: User) => void,
  user: User,
  error: NetworkError,
  setError: (arg0: NetworkError) => void
  setShowErrorModal: (arg0: boolean) => void
}

/**
 * Welcome makes a get request to test backend. If the cookie it sent has
 * a valid id, it redirects to dashboard. Else it registers a fresh users,
 * gets a cookie, and then redirects to dashboard
 */
export default function Home({ setUser, setError, setShowErrorModal }: HomePropType) {

  const [loading, setLoading] = useState(false)

  useEffect(() => {

    (async () => {
      setLoading(true)
        try {
          const { data } = await axios(process.env.REACT_APP_URL + '/users', { method: 'POST', withCredentials: true })
          setUser({
            id: data.id,
            authorized: data.authorized
          })
        } catch (error) {
          setError({
            code: error.code,
            name: error.name,
            message: error.message,
          })
          setShowErrorModal(true)
        } finally {
          setLoading(false)
        }
      })()

  }, [setUser, setError, setShowErrorModal])

  return (
    loading ? <Loader/> :
    <Container>
      <Typography variant="h3" component="h1">
        WELCOME
      </Typography>
    </Container>
  )
}
