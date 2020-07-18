import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Avatar,
  TextField,
  Typography,
  Container,
  Grid,
  Paper
} from '@material-ui/core'

import { useDebounce } from '../hooks'
import { makeStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons'

import axios from 'axios'

interface EnvelopeDetailModalPropsType {
  open: boolean
  handleClose: () => void
  items: any[]
  setItems: (i: any) => void
  envelope: any
  setEnvelopes: (e: any) => void
  envelopes: any[]
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: theme.palette.secondary.main,

  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  borderlessInput: {
    border: "none",
    borderColor: "transparent",
    fontSize: "1.5rem",
    fontFamily: theme.typography.fontFamily,
    outline: "none"
  },
  label: {
    fontSize: "1.5rem",
    fontFamily: theme.typography.fontFamily,
    marginRight: "10px"
  }
}));

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
  handleClose,
  open,
  items,
  setItems,
  envelope,
  setEnvelopes,
  envelopes
}: EnvelopeDetailModalPropsType) {

  const [formState, setFormState] = useState({
    name: "",
    limit_amount: ""
  })

  const [ready, setReady] = useState(false)

  // Since this form is rendered on startup, not on open, we have to hydrate form state on open
  useEffect(() => {
    open && setFormState({
      name: envelope.name,
      limit_amount: envelope.limit_amount
    })
  }, [open])

  // This hook listens to form state changing, but will delay its output using useTimeout internally
  const debouncedFormState = useDebounce(formState, 1000)

  // This hook runs every time debounce changes, as long as the user has triggerd handleChange
  useEffect(() => {
    const submit = async () => {
      try {

        const newEnvelopes = [...envelopes]
        const index = newEnvelopes.indexOf(envelope)
        newEnvelopes[index] = { ...newEnvelopes[index], ...debouncedFormState }

        setEnvelopes(newEnvelopes)

        return await axios(process.env.REACT_APP_URL + '/envelopes', {
          method: "PUT",
          withCredentials: true,
          data: {
            ...formState,
            id: envelope.id
          }
        })

      } catch (error) {
        console.log(error)
      } finally {
        setReady(false)
      }
    }

    ready && debouncedFormState && submit()
  }, [debouncedFormState])

  // Standard form state management, but also triggers the ready state, which allows update query to run
  const handleChange = (event: any) => {
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

  const classes = useStyles();

  // Here we change the envelope_id of an item to null, and 
  const handleClickItem = async (event: any, item: any) => {
    try {
      const newItems = [...items]
      const index = newItems.indexOf(item)
      newItems[index] = { ...item, envelope_id: null }
      setItems(newItems)
      const { data } = await axios(process.env.REACT_APP_URL + "/items", {
        method: "PUT",
        withCredentials: true,
        data: { ...item, envelope_id: null }
      })

    } catch (error) {
      console.log('unassignitem error', error)
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
        <form
          onSubmit={handleSubmit}
        >
          <label className={classes.label} htmlFor="name">
            Name:
          </label>
          <input
            className={classes.borderlessInput}
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            value={formState.name}
          />

          <label className={classes.label} htmlFor="limit_amount">
            Limit:
          </label>
          <input
            className={classes.borderlessInput}
            onChange={handleChange}
            type="text"
            name="limit_amount"
            id="limit_amount"
            value={formState.limit_amount}
          />
        </form>

        <Typography component="h1" variant="h5">
          Items:
        </Typography>

        <Grid container direction="column" >
          {items.map((item: any) => {
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