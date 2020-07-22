import React, { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Avatar,
  TextField,
  Typography,
  Container
} from '@material-ui/core'

import { ShoppingCart } from '@material-ui/icons'

import { validateMoney, NetworkError, fetch } from '../utils';
import { useStyles} from '../styles'

interface ItemFormModalPropsType {
  open: boolean
  handleClose: () => void
  addItem: (i: any) => void
  setAndShowError: (e: NetworkError) => void
}


export default function ItemFormModal({ addItem, handleClose, open, setAndShowError }: ItemFormModalPropsType) {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    name: "",
    amount: "0"
  })

  const [validName, setValidName] = useState(false)
  const [validAmount, setValidAmount] = useState(true)

  const handleChange = ({ target }: any) => {

    if (target.name === "amount") {
      const dollars = validateMoney(target.value)
      if (!dollars) {
        setValidAmount(false)
      } else {
        if (!validAmount) {
          setValidAmount(true)
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
      const { data } = await fetch('/items', 'POST', formState)
      addItem(data)
    } catch (error) {
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
          <ShoppingCart />
        </Avatar>
        <Typography component="h1" variant="h5">
          Add Item
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Item Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formState.name}
            onChange={handleChange}
          />

          <TextField
            InputProps={{
              style: {
                color: validAmount ? "black" : "red"
              }
            }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="amount"
            label="Item Amount"
            type="amount"
            id="amount"
            autoComplete="amount in dollars"
            value={formState.amount}
            onChange={handleChange}
          />
          <Button
            disabled={!validName || !validAmount}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add Item
          </Button>
        </form>
      </Container>
    </Dialog>
  )
}