import React, { ReactNode } from 'react'
import { Grid } from '@material-ui/core'

interface ItemsBannerProps {
  children: ReactNode[]
  setItemsBannerSelected: (b: boolean) => void
  itemsBannerSelected: boolean
}

export default function ItemsBanner({ children, setItemsBannerSelected, itemsBannerSelected }: ItemsBannerProps) {

  const handleDragOver = (event: any) => {
    event.preventDefault()
    setItemsBannerSelected(true)
  }

  const handleDragLeave = (event: any) => {
    console.log('items banner drag leave')
    setItemsBannerSelected(false)
  }

  return (
    <Grid
      style={{
        color: itemsBannerSelected ? "pink" : "black"
      }}
      item
      container
      key="item_buttons"
      xs={12}

      // draggable
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {children}
    </Grid>
  )
}