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
  Add as AddIcon,
} from '@material-ui/icons';
import { Loader, Item, Envelope, DeleteIcon, ItemsBanner } from './index'
import axios from 'axios'
import { useStyles } from '../styles'
import { ItemFormModal, EnvelopeFormModal, EnvelopeDetailModal } from '../Modals'
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

  const [items, setItems] = useState([] as any)
  const [envelopes, setEnvelopes] = useState([])

  const [selectedItem, setSelectedItem] = useState({ selected: false, item: {} })
  const [selectedEnvelope, setSelectedEnvelope] = useState({ selected: false, envelope: {} })
  const [deleteSelected, setDeleteSelected] = useState(false)

  useEffect(() => {
    console.log('***********************envelopes', selectedEnvelope, "items:", selectedItem)
  }, [selectedItem, selectedEnvelope])

  useEffect(() => {
    console.log('deleteSelected', deleteSelected)
  }, [deleteSelected])

  const [openItemForm, setOpenItemForm] = useState(false);
  const [openEnvelopeForm, setOpenEnvelopeForm] = useState(false);
  const [envelopeDetail, setEnvelopeDetail] = useState({ open: false, envelope: {} });
  const [itemsBannerSelected, setItemsBannerSelected] = useState(false)

  useEffect(() => console.log('itemsBannerSelected', itemsBannerSelected), [itemsBannerSelected])

  useEffect(() => console.log('deleteSelected', deleteSelected), [deleteSelected])

  const unassignItems = (envelopeID: number) => {
    const newItems = items.map((item: any) => {
      return item.envelope_id === envelopeID ? { ...item, envelope_id: null } : item
    })
    setItems(newItems)
  }

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
        <Grid justify="center" container>

          <DeleteIcon
            deleteSelected={deleteSelected}
            setDeleteSelected={setDeleteSelected}
          />
          {/* </Grid> */}
        </Grid>

        <Grid container direction="row" spacing={8}>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={3}>
              {/* <Grid item container key="item_buttons" xs={12} > */}
              <ItemsBanner
                setOpenItemForm={setOpenItemForm}
                selectedEnvelope={selectedEnvelope}
                setItemsBannerSelected={setItemsBannerSelected}
                itemsBannerSelected={itemsBannerSelected}
              />

              {items.map((item: any) => {
                // We only show the envelopes which have a null envelope_id, the rest go into their envelope
                return !item.envelope_id ? (
                  <Item
                    setSelectedEnvelope={setSelectedEnvelope}
                    items={items}
                    selectedEnvelope={selectedEnvelope}
                    setItems={setItems}
                    key={item.id}
                    setSelectedItem={setSelectedItem} item={item}
                    selectedItem={selectedItem}
                    deleteSelected={deleteSelected}
                    setDeleteSelected={setDeleteSelected}
                  />
                ) : null
              })}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container direction="column" spacing={3
              }>
              {/* <Grid container direction="column" spacing={3}> */}
              <Grid
                item
                container
                key="item_buttons"
                xs={12}
              >
                <AddIcon
                  // className={selectedEnvelope.selected ? classes.noEvents : ''}
                  fontSize={"large"}
                  onClick={() => { setOpenEnvelopeForm(true) }}
                />
                <Typography
                  // className={selectedEnvelope.selected ? classes.noEvents : ''}
                  display="block"
                  variant="h4"
                  component="h2"

                >
                  Envelopes
                </Typography>
              </Grid>

              {/* {Object.entries(envelopes).map(([id, envelope]: any) => { */}
              {envelopes.map((envelope: any) => {
                return (
                  <Envelope
                    unassignItems={unassignItems}
                    key={envelope.id}
                    selectedEnvelope={selectedEnvelope}
                    envelope={envelope}
                    setSelectedEnvelope={setSelectedEnvelope}
                    setEnvelopeDetail={setEnvelopeDetail}
                    deleteSelected={deleteSelected}
                    setEnvelopes={setEnvelopes}
                    envelopes={envelopes}
                    selectedItem={selectedItem}
                    setDeleteSelected={setDeleteSelected}
                    setItemsBannerSelected={setItemsBannerSelected}
                    itemsBannerSelected={itemsBannerSelected}
                  />
                )
              })}
            </Grid>
          </Grid>
          {/* </Grid> */}
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
        <EnvelopeDetailModal
          open={envelopeDetail.open}
          envelope={envelopeDetail.envelope}
          setItems={setItems}
          items={items}
          handleClose={() => { setEnvelopeDetail({ open: false, envelope: {} }) }}
        />
      </Container>
  )
}
