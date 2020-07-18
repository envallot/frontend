import React, { useRef } from 'react'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useStyles } from '../styles'
import axios from 'axios'

interface ItemPropsType {
  item: any
  setSelectedItem: (i: any) => void
  setItems: (i: any) => void
  setSelectedEnvelope: (e: any) => void
  selectedEnvelope: any
  selectedItem: any
  items: any
  deleteSelected: boolean
  setDeleteSelected: (b: boolean) => void
}

export default function Item({
  item,
  setItems,
  items,
  selectedItem,
  setSelectedItem,
  selectedEnvelope,
  setSelectedEnvelope,
  deleteSelected,
  setDeleteSelected
}: ItemPropsType) {

  /**
   * handleDragStart selects current item - this is for other componensts,
   * and removes selected item from 'items' state
   */
  const handleDragStart = (event: any) => {
    const target = event.target
    setSelectedItem({
      selected: true,
      item
    })

    setTimeout(() => {
      target.style.display = "none"
    }, 0)
  }

  const assignedEnv = useRef()

  /**
   * handleDragEnd makes the call to update item's envelope_id to currently selected envelope
   * 
   * @param event 
   */
  const handleDragEnd = async (event: any) => {
    setSelectedItem({
      selected: false, item: {}
    })
    if (deleteSelected) {
      try {
        setDeleteSelected(false)
        console.log('making delete req')
        const newItems = [...items]
        const index = newItems.indexOf(item)
        newItems.splice(index, 1)
        setItems(newItems)

        await axios(process.env.REACT_APP_URL + `/items/${item.id}`, {
          method: "DELETE",
          withCredentials: true
        })

      } catch (error) {
        console.log(error)
      }
    } else if (selectedEnvelope.selected && selectedEnvelope.selected) {
      console.log('item handle drag end')

      try {
        // Hold reference to our envelope_id here
        assignedEnv.current = selectedEnvelope.envelope.id

        // Unselect envelope to keep UI snappy
        setSelectedEnvelope({
          selected: false,
          envelope: {}
        })

        const newItems = [...items]
        const index = newItems.indexOf(item)
        // If we did not use useRef, we would have to unselect envelope after promise resolves, making
        // UI feel slow and sluggish
        newItems[index] = { ...item, envelope_id: assignedEnv.current }
        setItems(newItems)

        const { data } = await axios(process.env.REACT_APP_URL + "/items", {
          method: "PUT",
          withCredentials: true,
          data: { ...selectedItem.item, envelope_id: assignedEnv.current }
        })

      } catch (error) {
        console.log(error)
      }

    } else {
      event.target.style.display = "block"
      console.log('dropped without envelope')
    }
  }

  const classes = useStyles()
  return (
    <Grid
      key={item.id}
      item xs={12}

      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Paper
        style={{ pointerEvents: "none" }}
        className={classes.paper}>
        {item.name}:{item.amount}
      </Paper>
    </Grid>
  )
}