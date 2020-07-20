import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
} from '@material-ui/icons';
import axios, { AxiosError } from 'axios'
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
  const [envelopes, setEnvelopes] = useState([] as any)


  // ********************************** DND selectors ********************************** \\

  const [selectedItem, setSelectedItem] = useState({ selected: false, item: {} })
  const [selectedEnvelope, setSelectedEnvelope] = useState({ selected: false, envelope: {} })
  const [deleteSelected, setDeleteSelected] = useState(false)
  const [itemsBannerSelected, setItemsBannerSelected] = useState(false)


  // ********************************** Show/Hide Modals ********************************** \\

  const [openItemForm, setOpenItemForm] = useState(false);
  const [openEnvelopeForm, setOpenEnvelopeForm] = useState(false);
  const [envelopeDetail, setEnvelopeDetail] = useState({ open: false, envelope: {} });


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
      setAndShowError(error)
    }
  }

  const getOrCreateUser = async () => {
    try {

      const { data } = await fetch('/users', 'POST')
      setUser({
        authorized: data.success,
        ...data
      })

    } catch (error) {
      setAndShowError(error)
    } finally {
      setLoading(false)
    }
  }


  // ********************************** Helpers ********************************** \\

  const handleErrorAndRevertState = (error: AxiosError) => {
    setAndShowError(error)
    getItems()
    getEnvelopes()
  }


  // ********************************** Item Helpers ********************************** \\

  const unassignItems = (envelopeID: number) => {
    const newItems = items.map((item: any) => {
      return item.envelope_id === envelopeID ? { ...item, envelope_id: null } : item
    })
    setItems(newItems)
  }

  const unassignItem = (item: any) => {
    const newItems = [...items]
    const index = newItems.indexOf(item)
    newItems[index] = { ...item, envelope_id: null }
    setItems(newItems)
  }

  const deleteItem = (item: any) => {
    const newItems = [...items]
    const index = newItems.indexOf(item)
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const updateItem = (oldItem: any, newItem: any) => {
    const newItems = [...items]
    const index = newItems.indexOf(oldItem)
    newItems[index] = { ...newItems[index], ...newItem }
    setItems(newItems)
  }

  const assignItem = (item: any, envelopeID: number) => {
    const newItems = [...items]
    const index = newItems.indexOf(item)
    newItems[index] = { ...item, envelope_id: envelopeID }
    setItems(newItems)
  }


  // ********************************** Envelope Helpers ********************************** \\

  const deleteEnvelope = (envelope: any) => {
    const newEnvelopes = [...envelopes as any]
    const index = newEnvelopes.indexOf(envelope)
    newEnvelopes.splice(index, 1)
    setEnvelopes(newEnvelopes)
  }


  // ********************************** Schedule Tasks ********************************** \\

  useEffect(() => {
    if (user.authorized) {
      getItems()
      getEnvelopes()
    }
  }, [user])

  useEffect(() => {
    getOrCreateUser()
  }, [setUser, setError, setShowErrorModal])



  return (
    loading ? <Loader /> :
      <Container>
        <Bar
          setAndShowError={setAndShowError}
          getOrCreateUser={getOrCreateUser}
          user={user} setUser={setUser}
        />

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
                    assignItem={assignItem}
                    updateItem={updateItem}
                    deleteItem={deleteItem}
                    setSelectedEnvelope={setSelectedEnvelope}
                    selectedEnvelope={selectedEnvelope}
                    key={item.id}
                    setSelectedItem={setSelectedItem} item={item}
                    selectedItem={selectedItem}
                    deleteSelected={deleteSelected}
                    setDeleteSelected={setDeleteSelected}
                    handleErrorAndRevertState={handleErrorAndRevertState}
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

              {envelopes.map((envelope: any) => {
                return (
                  <Envelope
                    deleteEnvelope={deleteEnvelope}
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
                    handleErrorAndRevertState={handleErrorAndRevertState}
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
          handleErrorAndRevertState={handleErrorAndRevertState}
          unassignItem={unassignItem}
          open={envelopeDetail.open}
          envelope={envelopeDetail.envelope}
          items={items}
          setEnvelopes={setEnvelopes}
          envelopes={envelopes}
          handleClose={() => { setEnvelopeDetail({ open: false, envelope: {} }) }}
        />
      </Container>
  )
}
