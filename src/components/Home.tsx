import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
} from '@material-ui/icons';
import axios from 'axios'
import { Loader, Item, Envelope, DeleteIcon, ItemsBanner, Bar } from './index'
import { useStyles } from '../styles'
import { ItemFormModal, EnvelopeFormModal, EnvelopeDetailModal } from '../Modals'
import Grid from "@material-ui/core/Grid";
import { fetch } from '../utils'

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
  username: string,
  email: string
}

interface HomePropType {
  setUser: (arg0: User) => void,
  user: User,
  error: NetworkError,
  setError: (arg0: NetworkError) => void
  setShowErrorModal: (arg0: boolean) => void
  setAndShowError: (e: any) => void
}

/**
 * Home does a lot: it requests a cookie from backend, then authorizes user. Once authorized, we get 
 * all of the item and envelope data for a user and populate state. It's important to remember there
 * is no user authentication - if there is no current cookie, we automatically create a new user and 
 * send down a cookie.
 * 
 * @param param0 Porps passed from home
 */
export default function Home({ setUser, setError, setShowErrorModal, user, setAndShowError }: HomePropType) {

  const [loading, setLoading] = useState(true)


  // ********************************** App State ********************************** \\
  const [items, setItems] = useState([] as any)
  const [envelopes, setEnvelopes] = useState([])


  // ********************************** DND selectors ********************************** \\
  const [selectedItem, setSelectedItem] = useState({ selected: false, item: {} })
  const [selectedEnvelope, setSelectedEnvelope] = useState({ selected: false, envelope: {} })
  const [deleteSelected, setDeleteSelected] = useState(false)
  const [itemsBannerSelected, setItemsBannerSelected] = useState(false)


  // ********************************** Show/Hide Modals ********************************** \\
  const [openItemForm, setOpenItemForm] = useState(false);
  const [openEnvelopeForm, setOpenEnvelopeForm] = useState(false);
  const [envelopeDetail, setEnvelopeDetail] = useState({ open: false, envelope: {} });


  // ********************************** helpers ********************************** \\
  const unassignItems = (envelopeID: number) => {
    const newItems = items.map((item: any) => {
      return item.envelope_id === envelopeID ? { ...item, envelope_id: null } : item
    })
    setItems(newItems)
  }


  // ********************************** API calls ********************************** \\
  const getEnvelopes = async () => {
    try {
      const { data } = await fetch(process.env.REACT_APP_URL + '/envelopes', "GET")
      setEnvelopes(data)
    } catch (error) {
      setAndShowError(error)
    }
  }

  const getItems = async () => {
    try {
      const { data } = await fetch('/items', "GET")
      setItems(data)
    } catch (error) {
      console.log(error)
    }
  }

  const hydrateState = () => {
    getItems()
    getEnvelopes()
  }

  useEffect(() => {
    if (user.authorized) {
      hydrateState()
    }
  }, [user])

  useEffect(() => {

    (async () => {
      setLoading(true)
      try {
        const { data } = await fetch('/users', 'POST')
        setUser({
          authorized: data.success,
          ...data
        })

      } catch (error) {
        console.log(error)
        setAndShowError(error)
      } finally {
        setLoading(false)
      }
    })()

  }, [setUser, setError, setShowErrorModal])

  return (
    loading ? <Loader /> :
      <Container>
        <Bar user={user} setUser={setUser} />

        <Grid justify="center" container>
          <DeleteIcon
            deleteSelected={deleteSelected}
            setDeleteSelected={setDeleteSelected}
          />
        </Grid>

        <Grid container direction="row" spacing={8}>
          <Grid item xs={6}>
            <Grid container direction="column" spacing={3}>
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
              <Grid
                item
                container
                key="item_buttons"
                xs={12}
              >
                <AddIcon
                  fontSize={"large"}
                  onClick={() => { setOpenEnvelopeForm(true) }}
                />
                <Typography
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
          setEnvelopes={setEnvelopes}
          envelopes={envelopes}
          handleClose={() => { setEnvelopeDetail({ open: false, envelope: {} }) }}
        />
      </Container>
  )
}
