import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core'

interface ErrorModalPropsType {
  open: boolean
  message: string
  name: string
  code: string
  handleClose: () => void
}

export default function ErrorModal({ handleClose, message, code, name, open }: ErrorModalPropsType) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{code}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {name || message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}