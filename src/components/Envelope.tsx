import React from 'react'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useStyles } from '../styles'
import { fetch, NetworkError, Envelope,  } from '../utils'

interface EnvelopePropsType {
  envelope: Envelope
  envelopes: Envelope[]
  selectedEnvelope: any
  selectedItem: any
  setSelectedEnvelope: (e: any) => void
  setEnvelopeDetail: (e: any) => void
  deleteSelected: boolean
  setDeleteSelected: (d: any) => void
  setItemsBannerSelected: (b: boolean) => void
  itemsBannerSelected: boolean
  unassignItems: (e: number) => void
  handleErrorAndRevertState: (e: NetworkError) => void
  deleteEnvelope: (e: Envelope) => void
}

export default function EnvelopeComponent({
  envelope,
  setSelectedEnvelope,
  selectedEnvelope,
  setEnvelopeDetail,
  deleteSelected,
  selectedItem,
  setDeleteSelected,
  setItemsBannerSelected,
  itemsBannerSelected,
  unassignItems,
  handleErrorAndRevertState,
  deleteEnvelope
}: EnvelopePropsType) {

  const classes = useStyles()

  // ********************************** DND Handlers When Item Is Dragged ********************************** \\

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

    if (selectedItem.selected) {

      setSelectedEnvelope({
        selected: false,
        envelope: {}
      })
    }
  }


  // ********************************** DND Handlers When Envelope Is Dragged ********************************** \\

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

    setSelectedEnvelope({
      selected: false,
      envelope: {}
    })
    // If we are dragging env over delete image
    if (deleteSelected) {
      // Delete and unselect delete
      setDeleteSelected(false)
      deleteEnvelope(envelope)
      // Make API call
      try {
        await fetch(`/envelopes/${envelope.id}/?items=true`, "DELETE")
      } catch (error) {
        // Show error and rehydrate old state
        handleErrorAndRevertState(new NetworkError(error.code, error.message))
      }
    } else if (itemsBannerSelected) {
      // If we are deleting env and saving its items, unassign items
      deleteEnvelope(envelope)
      setItemsBannerSelected(false)
      unassignItems(envelope.id)

      try {
        await fetch(`/envelopes/${envelope.id}`, "DELETE")
      } catch (error) {
        handleErrorAndRevertState(new NetworkError(error.code, error.message))
      }

    } else {
      // When dropped randomly, envelope reappears in env list
      event.target.style.display = "block"
    }
  }

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
          display: "flex",
          flexDirection:"row",
          justifyContent: "space-between",
          pointerEvents: "none"
        }}
        className={selectedEnvelope.envelope.id === envelope.id && selectedItem.selected ? classes.hovering : classes.paper}
      >
        <span>Name: {envelope.name}</span>
        <span>Total / Limit: {envelope.total} / {envelope.limit_amount} </span>

      </Paper>
    </Grid>)


}