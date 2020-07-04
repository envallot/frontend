import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useHistory } from 'react-router'
import { useFetch } from '../hooks'

interface User {
  authorized: boolean,
  id: string,
  email: string,
  name: string
}

interface WelcomePropType {
  setUser: (arg0: User) => void,
  user: User
}

/**
 * Welcome makes a get request to test backend. If the cookie it sent has
 * a valid id, it redirects to dashboard. Else it registers a fresh users,
 * gets a cookie, and then redirects to dashboard
 */
export default function Welcome({ user, setUser }: WelcomePropType) {

  const history = useHistory()

  useEffect(() => {
    (async () => {

      try {
        const response = await fetch(process.env.REACT_APP_URL + '/users', { method: 'POST', credentials: 'include' })
        const json = await response.json()
        if (json.success) {
          setUser({
            ...user,
            id: json.id,
            authorized: true
          })
          console.log('useEffect welcome data', json)
          history.push('/home')
        }
      } catch (error) {
        console.log('useEffect welcome error', error)
      }
    })()

  }, [user, setUser, history])

  // make a call to api to get cookie, redirect after response
  return (
    <Container>
      <Typography variant="h3" component="h1">
        WELCOME
      </Typography>
    </Container>
  )
}

// export default Welcome