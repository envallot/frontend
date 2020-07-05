import React, { useEffect } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useHistory } from 'react-router'

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

interface WelcomePropType {
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
export default function Welcome({ setUser, setError, setShowErrorModal }: WelcomePropType) {

  const history = useHistory()

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(process.env.REACT_APP_URL + '/user', { method: 'POST', credentials: 'include' })
        const json = await response.json()
        if (response.status > 400) {
          console.log(json)
          throw new NetworkError(response.status.toString(), json.name, json.message)
        }
        setUser({
          id: json.id,
          authorized:json.authorized
        })
        history.push('home')
      } catch (error) {
        setError({
          code: error.code,
          name: error.name,
          message: error.message,
        })
        setShowErrorModal(true)
      }
    })()

  }, [history, setUser, setError, setShowErrorModal])

  return (
    <Container>
      <Typography variant="h3" component="h1">
        WELCOME
      </Typography>
    </Container>
  )
}

// export default Welcome