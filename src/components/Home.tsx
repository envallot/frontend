import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  More as MoreIcon
} from '@material-ui/icons';
import { Loader } from './index'
import axios from 'axios'
import { useStyles } from '../styles'

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

  const classes = useStyles()
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
    loading ? <Loader /> :
      <Container>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h5" noWrap>
              Material-UI
          </Typography>
            <IconButton aria-label="search" color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton aria-label="display more actions" edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

      </Container>
  )
}
