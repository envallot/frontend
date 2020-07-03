import React, { useEffect } from 'react';
import { useGetCookie } from '../hooks'
import { Container, Typography } from '@material-ui/core';

/**
 * Welcome makes a get request to test backend. If the cookie it sent has
 * a valid id, it redirects to dashboard. Else it registers a fresh users,
 * gets a cookie, and then redirects to dashboard
 */
export default function Welcome() {

  // make a call to api to get cookie, redirect after response
  return (
    <Container>
      <Typography variant="h3" component="h1">
        WELCOME
      </Typography>
    </Container>
  )

}