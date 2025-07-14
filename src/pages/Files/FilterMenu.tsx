import useUiStore from '@/store/useUiStore'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import { Checkbox, Divider, FormControlLabel, FormGroup, IconButton, Menu, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import { t } from '@lingui/macro'
import { useShallow } from 'zustand/shallow'

const FilterMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [
    display,
    sortBy,
    orderBy,
    foldersFirst,
    mediaOnly,
    hdThumbnails,
    updateDisplay,
    updateSortBy,
    updateOrderBy,
    updateFoldersFirst,
    updateMediaOnly,
    updateHDThumbnails
  ] = useUiStore(
    useShallow(
      (state) => [
        state.display,
        state.sortBy,
        state.orderBy,
        state.foldersFirst,
        state.mediaOnly,
        state.hdThumbnails,
        state.updateDisplay,
        state.updateSortBy,
        state.updateOrderBy,
        state.updateFoldersFirst,
        state.updateMediaOnly,
        state.updateHDThumbnails,
      ]
    )
  )

  return (
    <div>
      <IconButton
        id="filter-button"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FilterListRoundedIcon />
      </IconButton>

      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
        sx={{ userSelect: 'none' }}
      >

        <RadioGroup
          aria-labelledby="display-radio-buttons-group-label"
          defaultValue={display}
          name='display-radio-buttons-group'
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel value={'list'} control={<Radio />} label={t`List`} onChange={() => updateDisplay('list')} />
          <FormControlLabel value={'multicolumnList'} control={<Radio />} label={t`Multicolumn list`} onChange={() => updateDisplay('multicolumnList')} />
          <FormControlLabel value={'grid'} control={<Radio />} label={t`Grid`} onChange={() => updateDisplay('grid')} />
        </RadioGroup>

        <Divider />

        <RadioGroup
          aria-labelledby="sort-radio-buttons-group-label"
          defaultValue={sortBy}
          name="sort-radio-buttons-group"
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel value="name" control={<Radio />} label={t`Name`} onChange={() => updateSortBy('name')} />
          <FormControlLabel value="size" control={<Radio />} label={t`Size`} onChange={() => updateSortBy('size')} />
          <FormControlLabel value="datetime" control={<Radio />} label={t`Last modified`} onChange={() => updateSortBy('datetime')} />
        </RadioGroup>

        <Divider />

        <RadioGroup
          aria-labelledby="order-radio-buttons-group-label"
          defaultValue={orderBy}
          name="order-radio-buttons-group"
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel value="asc" control={<Radio />} label={t`Ascending`} onChange={() => updateOrderBy('asc')} />
          <FormControlLabel value="desc" control={<Radio />} label={t`Descending`} onChange={() => updateOrderBy('desc')} />
        </RadioGroup>

        <Divider />

        <FormGroup
          sx={{ paddingLeft: 2 }}
        >
          <FormControlLabel control={<Checkbox checked={foldersFirst} />} label={t`Folders first`} onChange={() => updateFoldersFirst(!foldersFirst)} />
          <FormControlLabel control={<Checkbox checked={mediaOnly} />} label={t`Media only`} onChange={() => updateMediaOnly(!mediaOnly)} />
          {
            display === 'grid' &&
            <FormControlLabel control={<Checkbox checked={hdThumbnails} />} label={t`HD thumbnails`} onChange={() => updateHDThumbnails(!hdThumbnails)} />
          }

        </FormGroup>

      </Menu>
    </div>

  )
}

export default FilterMenu