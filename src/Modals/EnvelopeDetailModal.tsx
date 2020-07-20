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
import { makeStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons'

import{ AxiosError } from 'axios'
import { fetch } from '../utils'

interface EnvelopeDetailModalPropsType {
  open: boolean
  handleClose: () => void
  items: any[]
  envelope: any
  setEnvelopes: (e: any) => void
  envelopes: any[]
  handleErrorAndRevertState: (e: AxiosError) => void
  unassignItem: (i:any) => void
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
  borderlessInputModal: {
    border: "none",
    borderColor: "transparent",
    fontSize: "1.5rem",
    fontFamily: theme.typography.fontFamily,
    outline: "none"
  },
  labelModal: {
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
  envelope,
  setEnvelopes,
  envelopes,
  handleErrorAndRevertState,
  unassignItem
}: EnvelopeDetailModalPropsType) {
  const classes = useStyles();


  // ********************************** Form State ********************************** \\

  const [formState, setFormState] = useState({
    name: "",
    limit_amount: "",
    id: 0
  })

  // This hook listens to form state changing, but will delay its output using useTimeout internally
  const debouncedFormState = useDebounce(formState, 1000)
  // This makes sure api is called only after user has changed form state
  const [ready, setReady] = useState(false)

  const handleChange = (event: any) => {
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
      const newEnvelopes = [...envelopes]
      const index = newEnvelopes.indexOf(envelope)
      newEnvelopes[index] = { ...newEnvelopes[index], ...debouncedFormState }

      setEnvelopes(newEnvelopes)

      return await fetch('/envelopes', "PUT", formState)

    } catch (error) {
      handleErrorAndRevertState(error)
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
      const newEnvelopes = envelopes.map((env: any) => {
        return env.id !== formState.id ? env : formState
      })

      setEnvelopes(newEnvelopes)
    }
  }, [open])



  useEffect(() => {
    // This hook runs every time debounce changes, as long as the user has triggerd handleChange
    if (ready && debouncedFormState) {
      submit()
    }
  }, [debouncedFormState])


  const handleClickItem = async (event: any, item: any) => {
    try {
      
      // Here we change the envelope_id of an item to null, and then
      // make the api call, reversing the transacion if there's an error
      unassignItem(item)
      await fetch("/items", "PUT", { ...item, envelope_id: null })

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
            className={classes.borderlessInputModal}
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