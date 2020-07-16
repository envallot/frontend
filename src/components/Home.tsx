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
  More as MoreIcon,
  Add as AddIcon
} from '@material-ui/icons';
import { Loader } from './index'
import axios from 'axios'
import { useStyles } from '../styles'
import { ItemFormModal, EnvelopeFormModal } from '../Modals'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

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
 * Home does a lot: it requests a cookie from backend, then authorizes user. Once authorized, we get 
 * all of the item and envelope data for a user and populate state. It's important to remember there
 * is no user authentication - if there is no current cookie, we automatically create a new user and 
 * send down a cookie.
 * 
 * @param param0 Porps passed from home
 */
export default function Home({ setUser, setError, setShowErrorModal, user }: HomePropType) {

  const classes = useStyles()
  const [loading, setLoading] = useState(false)

  const [items, setItems] = useState({})
  const [envelopes, setEnvelopes] = useState({})


  useEffect(() => {
    console.log('***********************envelopes', envelopes, "items:", items)
  }, [envelopes, items])

  const [openItemForm, setOpenItemForm] = useState(false);
  const [openEnvelopeForm, setOpenEnvelopeForm] = useState(false);


  useEffect(() => {
    const getEnvelopes = async () => {
      try {
        const { data } = await axios(process.env.REACT_APP_URL + '/envelopes', { method: "GET", withCredentials: true })
        setEnvelopes(data)
      } catch (error) {
        console.log(error)
      }
    }

    const getItems = async () => {
      try {
        const { data } = await axios(process.env.REACT_APP_URL + '/items', { method: "GET", withCredentials: true })

        setItems(data)
      } catch (error) {

        console.log(error)
      }
    }
    // If user is authorized, we make a call to get items and envelopes data
    if (user.authorized) {
      getItems()
      getEnvelopes()

    }

  }, [user])

  useEffect(() => {

    (async () => {
      setLoading(true)
      try {
        const { data } = await axios(process.env.REACT_APP_URL + '/users', { method: 'POST', withCredentials: true })
        setUser({
          id: data.id,
          authorized: data.success
        })
        console.log('user authed', user, data)

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
            <IconButton aria-label="search" color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton aria-label="display more actions" edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          </Toolbar>
        </AppBar>


        <Grid container direction="row" spacing={8}>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={3}>
              <Grid item key="item_buttons" xs={12}>
                <AddIcon
                  fontSize={"large"}
                  onClick={() => { setOpenItemForm(true) }}
                />
              </Grid>
              {Object.entries(items).filter((item:any)=>item.envelope_id == null).map(([id, item]: any) => {                
                return (
                  <Grid key={id} item xs={12}>
                    <Paper className={classes.paper}>{item.name}:{item.amount}</Paper>
                  </Grid>
                )

              })}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={3}>
              <Grid item key="item_buttons" xs={12}>
                <AddIcon
                  fontSize={"large"}
                  onClick={() => { setOpenEnvelopeForm(true) }}
                />
              </Grid>
              {Object.entries(envelopes).map(([id, envelope]: any) => {
                return (
                  <Grid key={id} item xs={12}>
                    <Paper className={classes.paper}>{envelope.name}:{envelope.limit_amount}</Paper>
                  </Grid>)
              })}
            </Grid>
          </Grid>
        </Grid>

        <ItemFormModal
          items={items}
          setItems={setItems}
          open={openItemForm}
          handleClose={() => { setOpenItemForm(false) }}
        />
        <EnvelopeFormModal
          envelopes={envelopes}
          setEnvelopes={setEnvelopes}
          open={openEnvelopeForm}
          handleClose={() => { setOpenEnvelopeForm(false) }}
        />
      </Container>
  )
}
