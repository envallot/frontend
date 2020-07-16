import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Avatar,
  TextField,
  Typography,
  Container
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons'

import axios from 'axios'

interface EnvelopeFormModalPropsType {
  open: boolean
  handleClose: () => void
  setEnvelopes: (arg: any) => void
  envelopes: any
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
}));

export default function EnvelopeFormModal({ handleClose, open, setEnvelopes, envelopes }: EnvelopeFormModalPropsType) {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    name: "",
    limit_amount: ""
  })

  useEffect(() => {
    console.log(formState)
  }, [formState])

  const handleChange = ({ target }: any) => {
    setFormState({
      ...formState,
      [target.name]: target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log('onSubmitted')

    try {
      const { data } = await axios(process.env.REACT_APP_URL + '/envelopes', {
        method: 'POST',
        withCredentials: true,
        data: formState
      })
      console.log('data', data)
      console.log('envelopes', envelopes)
      const newEnvelopes = { ...envelopes }
      newEnvelopes[data.id] = data
      console.log('newEnvs', newEnvelopes)
      setEnvelopes(newEnvelopes)
      console.log('post env', data)

    } catch (error) {
      console.log('post env error', error)
    } finally {
      handleClose()
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
        <Typography component="h1" variant="h5">
          Create Envelope
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Envelope Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formState.name}
            onChange={handleChange}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="limit_amount"
            label="Limit Amount"
            type="limit_amount"
            id="limit_amount"
            autoComplete="limit amount in dollars"
            value={formState.limit_amount}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Envelope
          </Button>
        </form>
      </Container>
    </Dialog>
  )
}