import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  More as MoreIcon,
} from '@material-ui/icons';
import { useStyles } from '../styles'
import { useDebounce } from '../hooks'

interface AppBarPropTypes {
  user: any,
  setUser: (u: any) => void
}

/**
 * A debouncer prevents too many calls from happening by delaying update to 
 * debouncedFormState by x miliseconds. A useEffect hook that listens on this reference
 * will run the query. Since the debouncer runs on every update to formState, including
 * on mount, we need to have a ready state that is turned on on change, turnd off after query
 * @param param0 
 */
export default function Bar({ user, setUser }: AppBarPropTypes) {

  const [formState, setFormState] = useState({
    ...user
  })
  
  const [ready, setReady] = useState(false)

  useEffect(() => console.log('user', user), [user])

  const handleChange = (event: any) => {
    setReady(true)
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    })
  }

  const debouncedFormState = useDebounce(formState, 1000)

  const submit = async () => {
    try {

      setUser(debouncedFormState.username)


      return await axios(process.env.REACT_APP_URL + '/users', {
        method: "PUT",
        withCredentials: true,
        data: {
          ...user,
          username: formState.username
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      setReady(false)
    }
  }

  useEffect(() => {

    if (ready) {
      submit()
    }

  }, [debouncedFormState])

  const classes = useStyles()
  return (
    <AppBar elevation={0} position="static">
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
          Env-Allot: easy budgeting
        </Typography>

        <form onSubmit={(e: any) => e.preventDefault()}>

          <label htmlFor="username"></label>
          <input
            className={classes.borderlessInputBar}
            id="username"
            name="username"
            placeholder="Add your username"
            type="text"
            value={formState.username}
            onChange={handleChange}
          />

        </form>
        <IconButton aria-label="search" color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton aria-label="display more actions" edge="end" color="inherit">
          <MoreIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}