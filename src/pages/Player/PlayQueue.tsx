import { Box, Button, Drawer, useTheme } from '@mui/material'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import useUiStore from '@/store/useUiStore'
import CommonList from '@/components/CommonList/CommonList'
import usePlayerStore from '@/store/usePlayerStore'
import { useShallow } from 'zustand/shallow'
import useStyles from '@/hooks/ui/useStyles'

const PlayQueue = () => {

  const theme = useTheme()
  const styles = useStyles(theme)

  const playQueue = usePlayQueueStore.use.playQueue()
  const currentIndex = usePlayQueueStore.use.currentIndex()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()
  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()

  const [
    playQueueIsShow,
    updatePlayQueueIsShow
  ] = useUiStore(
    useShallow(
      (state) => [
        state.playQueueIsShow,
        state.updatePlayQueueIsShow,
      ]
    )
  )

  const updateAutoPlay = usePlayerStore(state => state.updateAutoPlay)

  const open = (index: number) => {
    if (playQueue) {
      updateAutoPlay(true)
      updateCurrentIndex(playQueue[index].index)
    }
  }

  const remove = (indexArray: number[]) =>
    updatePlayQueue(playQueue?.filter(item => !indexArray.map(index => playQueue[index].index).filter(index => index !== currentIndex).includes(item.index)) || [])

  return (
    <Drawer
      anchor={'right'}
      open={playQueueIsShow}
      onClose={() => updatePlayQueueIsShow(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: 'calc(100vw - 0.5rem)', sm: '400px' }
        },
        ...styles.scrollbar
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', }} >
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {
            playQueue &&
            <CommonList
              listData={playQueue}
              listType='playQueue'
              activeIndex={playQueue?.findIndex((item) => item.index === currentIndex)}
              scrollIndex={playQueue?.findIndex((item) => item.index === currentIndex)}
              func={{ open, remove }}
            />
          }
        </Box>
        <Box sx={{ width: '100%', flexGrow: 0, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button fullWidth size='large' onClick={() => updatePlayQueueIsShow(false)}>
            <KeyboardArrowRightRoundedIcon />
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

export default PlayQueue