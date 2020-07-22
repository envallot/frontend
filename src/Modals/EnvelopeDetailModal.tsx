import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Avatar,
  Typography,
  Container,
  Grid,
  Paper
} from '@material-ui/core'

import { useDebounce } from '../hooks'
import { Email } from '@material-ui/icons'

import { fetch, NetworkError, validateMoney, Item, Envelope, DEBOUNCE_DELAY } from '../utils'
import { useStyles } from '../styles'

interface EnvelopeDetailModalPropsType {
  setSelectedEnvelope:(e:any) => void
  selectedEnvelope: any
  open: boolean
  handleClose: () => void
  items: Item[]
  envelope: Envelope 
  setEnvelopes: (e: Envelope[]) => void
  envelopes: Envelope[]
  handleErrorAndRevertState: (e: NetworkError) => void
  unassignItem: (i: Item, eID: number) => void
  updateEnvelope: (e:number, e2: Envelope) => void
}


/**
 * The debouncing is a bit confusing, since we have to keep track of 'ready' state. When this component renders,
 * it is not provided with a default form state, since the envelope this is for hasn't been clicked yet. We get
 * that on open. Because this changes our formState, and our debouncer is waiting for hat to run, we have to stop
 * from running our query on open. When a user makes a change, our 'ready' state is toggled to true, and now our
 * useEffect that runs the query can will fire. Our debouncer returns a piece of state that our useEffect is listening
 * to.
 * @param param0 props
 */
export default function EnvelopeDetailModal({
  selectedEnvelope,
  setSelectedEnvelope,
  handleClose,
  open,
  items,
  envelope,
  setEnvelopes,
  envelopes,
  handleErrorAndRevertState,
  unassignItem,
  updateEnvelope
}: EnvelopeDetailModalPropsType) {
  const classes = useStyles();


  // ********************************** Form State ********************************** \\

  const [formState, setFormState] = useState({
    name: "",
    limit_amount: 0,
    id: 0
  })

  const [total, setTotal] = useState(envelope.total)

  // This hook listens to form state changing, but will delay its output using useTimeout internally
  const debouncedFormState = useDebounce(formState, DEBOUNCE_DELAY)
  // This makes sure api is called only after user has changed form state
  const [ready, setReady] = useState(false)
  // Data validation state
  const [valid, setValid] = useState(true)


  const handleChange = (event: any) => {
    if (event.target.name === "limit_amount") {
      const dollars = validateMoney(event.target.value)
      if (!dollars || parseInt(event.target.value) < envelope.total!) {
        setValid(false)
      } else if (!valid) {
        setValid(true)
      }
    }

    // Standard form state management, but also triggers the ready state, which allows update query to run
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    })
    setReady(true)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    handleClose()
  }


  // ********************************** API Calls ********************************** \\

  const submit = async () => {

    try {      
      updateEnvelope(envelope.id, debouncedFormState)
      await fetch('/envelopes', "PUT", formState)
    } catch (error) {
      handleErrorAndRevertState(error)
      setFormState({
        name: envelope.name,
        limit_amount: envelope.limit_amount,
        id: envelope.id
      })
    } finally {
      setReady(false)
    }
  }


  // ********************************** Schedule Tasks ********************************** \\

  useEffect(() => {
    if (open) {
      // Since this form is rendered on startup, not on open, we have to hydrate form state on open
      setFormState({ ...envelope })
    } else if (ready) {
      // Takes care of user closing modal before debounce triggers
      const newEnvelopes = envelopes.map((env: Envelope) => {
        return env.id !== formState.id ? env : formState
      })

      setEnvelopes(newEnvelopes)
    }
  }, [open])


  const handleBlur = (event: any) => {
    setFormState({
      name: envelope.name,
      limit_amount: envelope.limit_amount,
      id: envelope.id
    })
    setValid(true)
  }

  useEffect(() => {
    // This hook runs every time debounce changes, as long as the user has triggerd handleChange
    if (ready && debouncedFormState && valid) {
      submit()
    }
  }, [debouncedFormState])

  useEffect(() => {
    setTotal(envelope.total)
  }, [envelope.total])


  const handleClickItem = async (event: any, item: Item) => {
    try {
      // Here we change the envelope_id of an item to null, and then
      // make the api call, reversing the transacion if there's an error
      unassignItem(item, envelope.id)
      await fetch("/envelopes/unassignItem", "PUT", { id: envelope.id, itemID: item.id })

    } catch (error) {
      handleErrorAndRevertState(error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Container component="main" maxWidth="xs">
        <Avatar className={classes.avatar}>
          <Email />
        </Avatar>
        <p className={classes.labelModal}>Total: {total} </p>

        <form
          onSubmit={handleSubmit}
        >
          <label className={classes.labelModal} htmlFor="name">
            Name: 
          </label>
          <input
            className={classes.borderlessInputModal}
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            value={formState.name}
          />

          <label className={classes.labelModal} htmlFor="limit_amount">
            Limit: 
            </label>
          <input
            onBlur={handleBlur}
            style={{
              color: valid ? "black" : "red"
            }}
            className={classes.borderlessInputModal}
            onChange={handleChange}
            type="text"
            name="limit_amount"
            id="limit_amount"
            value={formState.limit_amount}
          />
        </form>
        {items.filter((i: Item) => i.envelope_id === envelope.id).length > 0 ?
          <Typography
            component="h1"
            variant="h5"
          >
            Items:
          </Typography> : null}

        <Grid container direction="column" >
          {items.map((item: Item) => {
            return item.envelope_id !== envelope.id ? null :

              <Grid
                key={item.id}
                item xs={12}
                onClick={(event) => handleClickItem(event, item)}
              >
                <Paper
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px"
                  }}
                  className={classes.paper}>
                  {item.name}
                </Paper>

              </Grid>

          })}
        </Grid>

      </Container>
    </Dialog>
  )
}