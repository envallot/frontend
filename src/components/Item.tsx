import React, { useRef, useState, useEffect } from 'react'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useStyles } from '../styles'
import { useDebounce } from '../hooks'
import { fetch, NetworkError, validateMoney, Item, DEBOUNCE_DELAY } from '../utils'

interface ItemPropsType {
  item: Item
  setSelectedItem: (i: any) => void
  setSelectedEnvelope: (e: any) => void
  selectedEnvelope: any
  selectedItem: any
  deleteSelected: boolean
  setDeleteSelected: (b: boolean) => void
  handleErrorAndRevertState: (e: NetworkError) => void
  deleteItem: (i: Item) => void
  updateItem: (i: Item, a: Item) => void
  assignItem: (i: Item, e: number) => void
}


export default function ItemComponent({
  item,
  selectedItem,
  setSelectedItem,
  selectedEnvelope,
  setSelectedEnvelope,
  deleteSelected,
  setDeleteSelected,
  handleErrorAndRevertState,
  deleteItem,
  updateItem,
  assignItem
}: ItemPropsType) {

  const assignedEnv = useRef(0)
  const assignedItem = useRef(0)


  // ********************************** Form State  ********************************** \\

  const [formState, setFormState] = useState({
    id: item.id,
    name: item.name,
    amount: item.amount
  })

  const [ready, setReady] = useState(false)

  const [valid, setValid] = useState(true)

  const handleChange = (event: any) => {

    if (event.target.name === "amount") {
      const dollars = validateMoney(event.target.value)
      if (!dollars) {
        setValid(false)
      } else {
        if (!valid) {
          setValid(true)
        }
      }
    }

    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    })
    setReady(true)
  }

  const debouncedFormState = useDebounce(formState, DEBOUNCE_DELAY)

  // If item changes, for instance when reverting state on error, we reflect it in form state
  useEffect(() => {
    setFormState({
      id: item.id,
      name: item.name,
      amount: item.amount
    })
  }, [item])

  // When use clicks out of input, formstate reverts to previous valid state
  const handleBlur = (event: any) => {
    setFormState({
      id: item.id,
      name: item.name,
      amount: item.amount
    })
    setValid(true)
  }


  // ********************************** DND Handlers ********************************** \\

  /**
   * handleDragStart selects current item - this is for other componensts,
   * and removes selected item from 'items' state
   */
  const handleDragStart = (event: any) => {
    // firefox requires using dataTransfer to make component draggable
    event.dataTransfer.setData("text/plain", "Drag start");

    const target = event.target
    setSelectedItem({
      selected: true,
      item
    })

    setTimeout(() => {
      target.style.display = "none"
    }, 100)
   
  }


  /**
   * handleDragEnd makes the call to update item's envelope_id to currently selected envelope
   * 
   * @param event 
   */
  const handleDragEnd = async (event: any) => {
    // Firefox requires prevent default on both drop event and endDrag events
    event.preventDefault()
    setSelectedItem({
      selected: false, item: {}
    })

    if (deleteSelected) {
      try {

        setDeleteSelected(false)
        deleteItem(item)
        await fetch(`/items/${item.id}`, "DELETE")

      } catch (error) {
        handleErrorAndRevertState(new NetworkError(error.code, error.message))
      }

    } else if (selectedEnvelope.selected && selectedItem.selected) {
      try {
        if (Number(selectedItem.item.amount) + Number(selectedEnvelope.envelope.total) > Number(selectedEnvelope.envelope.limit_amount)) {
          event.target.style.display = "block"
          setSelectedEnvelope({
            selected: false,
            envelope: {}
          })

          setSelectedItem({
            selected: false,
            envelope: {}
          })

          handleErrorAndRevertState({ code: "", message: "Not enough money in this envelope" })
          return
        }
        // Hold reference to our envelope_id here
        assignedEnv.current = selectedEnvelope.envelope.id
        assignedItem.current = selectedItem.item.id


        // Unselect envelope to keep UI snappy
        setSelectedEnvelope({
          selected: false,
          envelope: {}
        })

        setSelectedItem({
          selected: false,
          envelope: {}
        })

        // Change state before API call
        assignItem(item, assignedEnv.current)

        // Make API call
        await fetch(
          "/items/assign",
          "PUT",
          { id: assignedItem.current, envelope_id: assignedEnv.current }
        )

      } catch (error) {
        handleErrorAndRevertState(new NetworkError(error.code, error.message))
      }
    } else {
      // Handle when item is not dropped on droppable
      event.target.style.display = "block"
    }
  }


  // ********************************** API Calls ********************************** \\

  const submit = async () => {
    try {

      updateItem(item, debouncedFormState)
      return await fetch('/items',
        "PUT",
        formState
      )

    } catch (error) {
      handleErrorAndRevertState(error.response.data)
    } finally {
      setReady(false)
    }
  }


  // ********************************** Schedule Tasks ********************************** \\

  useEffect(() => {
    // This hook runs every time debounce changes, as long as the user has triggerd handleChange
    // ready && debouncedFormState && submit()
    if (ready && debouncedFormState && valid) {
      submit()
    }
  }, [debouncedFormState])



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
        className={classes.paper}>
        <form
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
          <label
            htmlFor={'name'}
          >
            Name:
          </label>
          &nbsp;
          <input
            onBlur={handleBlur}
            className={classes.borderlessInputPaper}
            value={formState.name}
            name="name"
            id="name"
            onChange={handleChange}
          />
          <label
            htmlFor={'amount'}
          >
            Amount:
          </label>
          &nbsp;
          <input
            style={{
              maxWidth: "50px",
              color: valid ? "black" : "red"
            }}
            onBlur={handleBlur}
            className={classes.borderlessInputPaper}
            value={formState.amount}
            id="amount"
            name="amount"
            onChange={handleChange}
          />
        </form>
      </Paper>
    </Grid>
  )
}