import React, { useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { useStyles } from '../styles'

interface ItemsBannerProps {
  setItemsBannerSelected: (b: boolean) => void
  itemsBannerSelected: boolean
  setOpenItemForm: (b: boolean) => void
  selectedEnvelope: any
}

export default function ItemsBanner({ selectedEnvelope, setOpenItemForm, setItemsBannerSelected, itemsBannerSelected }: ItemsBannerProps) {

  const handleDragOver = (event: any) => {
    event.preventDefault()
    selectedEnvelope.selected && setItemsBannerSelected(true)
  }

  useEffect(()=>console.log('itemsBannerSelected, selectedEnvelope.selected',itemsBannerSelected, selectedEnvelope.selected ), [itemsBannerSelected, selectedEnvelope])
  
  const handleDragLeave = (event: any) => {
    console.log('items banner drag leave')
    setItemsBannerSelected(false)
  }

  const getStyles = () => {
    return selectedEnvelope ? { pointerEvents: "none" } : {}
  }
  const classes = useStyles()

  return (
    <Grid
      item
      container
      key="item_buttons"
      xs={12}
      style={{
        color: itemsBannerSelected ? "pink" : "black"
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <AddIcon
        fontSize={"large"}
        onClick={() => { setOpenItemForm(true) }}
      />
      <Typography
        display="block"
        variant="h4"
        component="h2"

      >
        Items
      </Typography>

    </Grid>
  )
}