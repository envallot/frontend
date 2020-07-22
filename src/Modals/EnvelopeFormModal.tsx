import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Avatar,
  TextField,
  Typography,
  Container,
} from '@material-ui/core'

// import { makeStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons'

import { fetch, NetworkError, validateMoney, Envelope } from '../utils'
import { useStyles } from '../styles'

interface EnvelopeFormModalPropsType {
  open: boolean
  handleClose: () => void
  setAndShowError: (e: NetworkError) => void
  addEnvelope: (e: Envelope) => void
}

export default function EnvelopeFormModal({ addEnvelope, setAndShowError, handleClose, open }: EnvelopeFormModalPropsType) {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    name: "",
    limit_amount: "0"
  })

  const [validName, setValidName] = useState(false)
  const [validLimitAmount, setValidLimitAmount] = useState(true)


  useEffect(() => {
    console.log(formState)
  }, [formState])

  const handleChange = ({ target }: any) => {

    if (target.name === "limit_amount") {
      const dollars = validateMoney(target.value)
      if (!dollars) {
        setValidLimitAmount(false)
      } else {
        if (!validLimitAmount) {
          setValidLimitAmount(true)
        }
      }
    } else if (target.name === "name") {
      if (target.value === "") {
        setValidName(false)
      } else if (!validName) {
        setValidName(true)
      }
    }

    setFormState({
      ...formState,
      [target.name]: target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const { data } = await fetch('/envelopes', 'POST', formState)
      addEnvelope(data)
    } catch ({ response }) {
      const error = response.data
      setAndShowError(new NetworkError(error.code, error.message))
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
            InputProps={{
              style: {
                color: validLimitAmount ? "black" : "red"
              }
            }}
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
            disabled={!validName || !validLimitAmount}
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