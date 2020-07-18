import React, { useState } from 'react'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useStyles } from '../styles'
import axios from 'axios'

interface EnvelopePropsType {
  envelope: any
  envelopes: any[]
  selectedEnvelope: any
  selectedItem: any
  setSelectedEnvelope: (e: any) => void
  setEnvelopeDetail: (e: any) => void
  deleteSelected: boolean
  setEnvelopes: (e: any) => void
  setDeleteSelected: (d: any) => void
  setItemsBannerSelected: (b: boolean) => void
  itemsBannerSelected: boolean
}

export default function Envelope({
  envelope,
  setSelectedEnvelope,
  selectedEnvelope,
  setEnvelopeDetail,
  deleteSelected,
  setEnvelopes,
  envelopes,
  selectedItem,
  setDeleteSelected,
  setItemsBannerSelected,
  itemsBannerSelected
}: EnvelopePropsType) {

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
    console.log('envelope handle drag leave')

    event.preventDefault()
    setSelectedEnvelope({
      selected: false,
      envelope: {}
    })
  }

  const handleDragStart = (event: any) => {
    const target = event.target

    setSelectedEnvelope({
      selected: true,
      envelope
    })

    setTimeout(() => {
      target.style.display = "none"
    }, 0)
  }

  const handleDragEnd = async (event: any) => {
    console.log('envelope drag ended')

    setSelectedEnvelope({
      selected: false,
      envelope: {}
    })

    if (deleteSelected) {
      setDeleteSelected(false)
      console.log('deleting all the thing')
      const newEnvelopes = [...envelopes]
      const index = newEnvelopes.indexOf(envelope)
      newEnvelopes.splice(index, 1)
      setEnvelopes(newEnvelopes)

      try {
        await axios(process.env.REACT_APP_URL + `/envelopes/${envelope.id}/?items=true`, {
          method: "DELETE",
          withCredentials: true
        })

      } catch (error) {
        console.log(error)
      }
    } else if (itemsBannerSelected){
      setItemsBannerSelected(false)
      
      try {
        await axios(process.env.REACT_APP_URL + `/envelopes/${envelope.id}`, {
          method: "DELETE",
          withCredentials: true
        })
      } catch (error) {
        console.log(error)
      }

    } else {
      event.target.style.display = "block"
    }
  }

  const classes = useStyles()
  return (
    <Grid
      item xs={12}
      onClick={() => setEnvelopeDetail({ open: true, envelope })}

      draggable
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Paper
        style={{
          pointerEvents: "none"
        }}
        className={selectedEnvelope.envelope.id === envelope.id && selectedItem.selected ? classes.hovering : classes.paper}
      >
        {envelope.name}:{envelope.limit_amount}
      </Paper>
    </Grid>)


}