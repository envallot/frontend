import React from 'react'
import axios from 'axios'
import {
  DeleteForever
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';

interface DeleteIconPropType {
  // items: any[]
  // envelopes: any[]
  // setItems: (i: any) => void
  // setEnvelopes: (e: any) => void
  setDeleteSelected: (e: boolean) => void
  deleteSelected: boolean

}

export default function DeleteIcon({ setDeleteSelected, deleteSelected }: DeleteIconPropType) {


  const handleDragEnter = (event:any) => {
    event.preventDefault()
    setDeleteSelected(true)
  }

  const handleDragLeave = (event:any) => {
    console.log('leaving delete icon')
    setDeleteSelected(false)
  }

  return (
    <Grid 
      style={{
        width: "200px",
        height: "120px",
      }}
      container
      item
      justify="center"
      alignItems="center"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >

      <DeleteForever
        fontSize="large"
        style={{ 
          color: deleteSelected ? "pink" : "black", 
          pointerEvents: "none"
         }}

      />
    </Grid>
  )

}