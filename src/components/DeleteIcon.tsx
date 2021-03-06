import React from 'react'
import {
  DeleteForever
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';

interface DeleteIconPropType {
  setDeleteSelected: (e: boolean) => void
  deleteSelected: boolean
}

export default function DeleteIcon({ setDeleteSelected, deleteSelected }: DeleteIconPropType) {

  const handleDragOver = (event: any) => {
    event.preventDefault()
    setDeleteSelected(true)
  }

  const handleDragLeave = (event: any) => {
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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(event:any) => event.preventDefault()}
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