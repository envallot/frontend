import React, { ReactNode } from 'react'
import { Grid } from '@material-ui/core'

interface ItemsBannerProps {
  children: ReactNode[]
  setItemsBannerSelected: (b: boolean) => void
  itemsBannerSelected: boolean
}

export default function ItemsBanner({ children, setItemsBannerSelected, itemsBannerSelected }: ItemsBannerProps) {

  const handleDragEnter = (event: any) => {
    setItemsBannerSelected(true)
  }

  const handleDragLeave = (event: any) => {
    console.log('items banner drag leave')
    setTimeout(()=>setItemsBannerSelected(false), 0)
  }

  return (
    <Grid
      style={{
        color:itemsBannerSelected ? "pink" : "black"
      }}
      item
      container
      key="item_buttons"
      xs={12}

      // draggable
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {children}
    </Grid>
  )
}