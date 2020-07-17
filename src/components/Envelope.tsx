import React, { useState } from 'react'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useStyles } from '../styles'
import axios from 'axios'

interface EnvelopePropsType {
  envelope: any
  selectedEnvelope: any
  // setItems: (i: any) => void
  // selectedEnvelope: any
  // selectedItem: any
  setSelectedEnvelope: (e: any) => void
  setEnvelopeDetail:  (e: any) => void
}

export default function Envelope({ envelope, setSelectedEnvelope, selectedEnvelope, setEnvelopeDetail }: EnvelopePropsType) {

  const handleDragOver = (event: any) => {
    event.preventDefault()

    if (!selectedEnvelope.selected || selectedEnvelope.envelope.id !== envelope.id) {
      setSelectedEnvelope({
        selected: true,
        envelope
      })
    }
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault()
    setSelectedEnvelope({
      selected: false,
      envelope: {}
    })
  }

  const classes = useStyles()
  return (
    <Grid
      item xs={12}
      onClick={()=> setEnvelopeDetail({open: true, envelope})}

      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Paper
        className={selectedEnvelope.envelope.id === envelope.id ? classes.hovering : classes.paper}
      >
        {envelope.name}:{envelope.limit_amount}
      </Paper>
    </Grid>)


}