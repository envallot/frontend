import React, { useEffect, useState } from 'react';

import { Container, Typography, Grid } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import {
  Loader,
  ItemComponent,
  EnvelopeComponent,
  DeleteIcon,
  ItemsBanner,
  Bar
} from './index'

import { ItemFormModal, EnvelopeFormModal, EnvelopeDetailModal } from '../Modals'
import { fetch, NetworkError, round, Item, Envelope, User } from '../utils'


interface HomePropType {
  setUser: (arg0: User) => void,
  user: User,
  error: NetworkError,
  setError: (arg0: NetworkError) => void
  setShowErrorModal: (arg0: boolean) => void
  setAndShowError: (e: NetworkError) => void
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

  const [items, setItems] = useState([] as Item[])
  const [envelopes, setEnvelopes] = useState([] as Envelope[])


  // ********************************** DND selectors ********************************** \\

  const [selectedItem, setSelectedItem] = useState({ selected: false, item: {} })
  const [selectedEnvelope, setSelectedEnvelope] = useState({ selected: false, envelope: {} })
  const [deleteSelected, setDeleteSelected] = useState(false)
  const [itemsBannerSelected, setItemsBannerSelected] = useState(false)


  // ********************************** Show/Hide Modals ********************************** \\

  const [openItemForm, setOpenItemForm] = useState(false);
  const [openEnvelopeForm, setOpenEnvelopeForm] = useState(false);
  const [envelopeDetail, setEnvelopeDetail] = useState({ open: false, envelope: new Envelope("", 0, 0, 0) });


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

  const handleErrorAndRevertState = (error: NetworkError) => {
    setAndShowError(error)
    getItems()
    getEnvelopes()
  }


  // ********************************** Item Helpers ********************************** \\

  const unassignItem = (item: Item, envelopeID: number) => {
    const newItems = [...items]
    const index = newItems.indexOf(item)
    newItems[index] = { ...item, envelope_id: null }
    setItems(newItems)

    const newEnvelopes = envelopes.map((e: Envelope) => {
      if (e.id === envelopeID) {
        e.total = round(e.total! - item.amount)
        return e
      }
      return e
    })
    setEnvelopes(newEnvelopes)
  }

  const deleteItem = (item: Item) => {
    const newItems = [...items]
    const index = newItems.indexOf(item)
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const updateItem = (oldItem: Item, newItem: Item) => {
    const newItems = [...items]
    const index = newItems.indexOf(oldItem)
    newItems[index] = { ...newItems[index], ...newItem }
    setItems(newItems)
  }

  const addItem = (item: Item) => {
    setItems([item, ...items])
  }

  const assignItem = (item: Item, envelopeID: number) => {
    const newItems = [...items]
    const index = newItems.indexOf(item)
    newItems[index] = { ...item, envelope_id: envelopeID }
    setItems(newItems)

    const newEnvelopes = envelopes.map((e: Envelope) => {
      if (e.id === envelopeID) {
        e.total = round(e.total! + item.amount)
        return e
      }
      return e
    })
    setEnvelopes(newEnvelopes)
  }


  // ********************************** Envelope Helpers ********************************** \\

  const deleteEnvelope = (envelope: Envelope) => {
    const newEnvelopes = [...envelopes]
    const index = newEnvelopes.indexOf(envelope)
    newEnvelopes.splice(index, 1)
    setEnvelopes(newEnvelopes)
  }

  const updateEnvelope = (id: number, newEnvelope: Envelope) => {

    const newEnvelopes = envelopes.map((env: Envelope) => {
      if (env.id === id) {
        return newEnvelope
      }
      return env
    })
    setEnvelopes(newEnvelopes)
  }

  const addEnvelope = (envelope: Envelope) => {
    setEnvelopes([envelope, ...envelopes])
  }

  const unassignItems = (envelopeID: number) => {
    const newItems = items.map((item: Item) => {
      return item.envelope_id === envelopeID ? { ...item, envelope_id: null } : item
    })
    setItems(newItems)
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

              {items.map((item: Item) => {
                // We only show the envelopes which have a null envelope_id, the rest go into their envelope
                return !item.envelope_id ? (
                  <ItemComponent
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

              {envelopes.map((envelope: Envelope) => {
                return (
                  <EnvelopeComponent
                    deleteEnvelope={deleteEnvelope}
                    unassignItems={unassignItems}
                    key={envelope.id}
                    selectedEnvelope={selectedEnvelope}
                    envelope={envelope}
                    setSelectedEnvelope={setSelectedEnvelope}
                    setEnvelopeDetail={setEnvelopeDetail}
                    deleteSelected={deleteSelected}
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
          open={openItemForm}
          handleClose={() => { setOpenItemForm(false) }}
          addItem={addItem}
          setAndShowError={setAndShowError}
        />
        <EnvelopeFormModal
          open={openEnvelopeForm}
          handleClose={() => { setOpenEnvelopeForm(false) }}
          setAndShowError={setAndShowError}
          addEnvelope={addEnvelope}
        />
        <EnvelopeDetailModal
          setSelectedEnvelope={setSelectedEnvelope}
          selectedEnvelope={selectedEnvelope}
          handleErrorAndRevertState={handleErrorAndRevertState}
          unassignItem={unassignItem}
          open={envelopeDetail.open}
          envelope={envelopeDetail.envelope}
          items={items}
          setEnvelopes={setEnvelopes}
          envelopes={envelopes}
          updateEnvelope={updateEnvelope}
          handleClose={() => { setEnvelopeDetail({ open: false, envelope: new Envelope("", 0, 0, 0) }) }}
        />
      </Container>
  )
}
