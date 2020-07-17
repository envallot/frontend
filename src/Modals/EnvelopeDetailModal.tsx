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

import { makeStyles } from '@material-ui/core/styles';
import { Email } from '@material-ui/icons'

import axios from 'axios'

interface EnvelopeDetailModalPropsType {
  open: boolean
  handleClose: () => void
  items: any[]
  setItems: (i: any) => void
  envelope: any
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

export default function EnvelopeDetailModal({ handleClose, open, items, setItems, envelope }: EnvelopeDetailModalPropsType) {
  const classes = useStyles();

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

      console.log('updatedItem', data)
    } catch (error) {
      console.log('unassignitem error', error)
    }
  }
  // const [formState, setFormState] = useState({setEnvelopes
  //   name: "",
  //   limit_amount: ""
  // })

  // useEffect(() => {
  //   console.log(formState)
  // }, [formState])

  // const handleChange = ({ target }: any) => {
  //   setFormState({
  //     ...formState,
  //     [target.name]: target.value
  //   })
  // }

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault()
  //   console.log('onSubmitted')

  //   try {
  //     const { data } = await axios(process.env.REACT_APP_URL + '/envelopes', {
  //       method: 'POST',
  //       withCredentials: true,
  //       data: formState
  //     })
  //     setEnvelopes([data, ...envelopes])

  //   } catch (error) {
  //     console.log('post env error', error)
  //   } finally {
  //     handleClose()
  //   }
  // }

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
          {envelope.name}'s Items
        </Typography>
        <Grid container direction="column" >
          {items.map((item: any) => {
            return item.envelope_id !== envelope.id ? null :
              <Grid
                key={item.id}
                item xs={12}
                onClick={(event) => handleClickItem(event, item)}
              >
                <Paper className={classes.paper}>
                  {item.name}
                </Paper>

              </Grid>

          })}
        </Grid>
        {/* <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
        </form> */}
      </Container>
    </Dialog>
  )
}