import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ShoppingCart } from '@material-ui/icons'

import axios from 'axios'

interface ItemFormModalPropsType {
  open: boolean
  handleClose: () => void
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
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

export default function ItemFormModal({ handleClose, open }: ItemFormModalPropsType) {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    name: "",
    amount: ""
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

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    console.log('onSubmitted')

    try {
      const { data } = await axios(process.env.REACT_APP_URL + '/items', {
        method: 'POST',
        withCredentials: true,
        data: formState
      })
      console.log('post item', data)
      // setUser({
      //   id: data.id,
      //   authorized: data.authorized
      // })
    } catch (error) {
      console.log('post item error', error)
      // setError({
      //   code: error.code,
      //   name: error.name,
      //   message: error.message,
      // })
      // setShowErrorModal(true)
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
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