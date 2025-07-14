import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ListItemText, Typography, Dialog, DialogTitle, DialogActions, Menu, MenuItem, DialogContent, TextField, Box, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import usePlaylistsStore from '../../store/usePlaylistsStore'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'
import useLocalMetaDataStore from '@/store/useLocalMetaDataStore'
import { MetaData } from '@/types/MetaData'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { checkFileType } from '@/utils'
import { useShallow } from 'zustand/shallow'

const Playlist = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()

  const [shuffle, updateVideoViewIsShow, updateShuffle,] = useUiStore(
    useShallow((state) => [state.shuffle, state.updateVideoViewIsShow, state.updateShuffle])
  )

  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const updateAutoPlay = usePlayerStore(state => state.updateAutoPlay)

  const [playlists, renamePlaylist, removePlaylist, removeFilesFromPlaylist] = usePlaylistsStore(
    useShallow((state) => [state.playlists, state.renamePlaylist, state.removePlaylist, state.removeFilesFromPlaylist])
  )

  const playlist = playlists?.find(playlistItem => playlistItem.id === id) //当前播放列表

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDiaLogOpen, setDeleteDiaLogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(playlist?.title)
  const { getManyLocalMetaData } = useLocalMetaDataStore()
  const [metaDataList, setMetaDataList] = useState<MetaData[]>([])

  useEffect(
    () => {
      getManyLocalMetaData(playlist?.fileList.slice(0, 5).map(file => file.filePath) || [])
        .then(metaDataList => metaDataList && setMetaDataList(metaDataList.filter(metaData => metaData)))
      return () => {
        setMetaDataList([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlist]
  )

  const open = (index: number) => {
    const listData = playlist?.fileList
    if (listData) {
      const currentFile = listData[index]
      if (currentFile) {
        const list = listData
          .map((item, _index) => ({ ...item, index: _index }))
        if (shuffle) {
          updateShuffle(false)
        }
        updatePlayQueue(list)
        updateCurrentIndex(list[index].index)
        updateAutoPlay(true)
        if (checkFileType(currentFile.fileName) === 'video') {
          updateVideoViewIsShow(true)
        }
      }
    }
  }

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpen(true)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setAnchorEl(null)
  }

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false)
    setNewTitle(playlist?.title)
  }

  //从播放列表移除文件
  const removeFiles = (indexArray: number[]) => {
    if (id) {
      removeFilesFromPlaylist(id, indexArray)
    }
  }

  // 删除播放列表
  const deletePlaylist = () => {
    if (id && playlists) {
      removePlaylist(id)
      setDeleteDiaLogOpen(false)
      setNewTitle('')
      const prev = playlists[playlists?.findIndex((playlist) => playlist.id === id) - 1]
      const next = playlists[playlists?.findIndex((playlist) => playlist.id === id) + 1]
      const navigateToId = (prev) ? prev.id : (next) ? next.id : null
      return navigate((navigateToId) ? `/playlist/${navigateToId}` : '/')
    }
  }

  return (
    <Box sx={{ height: '100%' }}>
      {
        (!playlist)
          ? <Loading />
          : <Grid container sx={{ flexDirection: 'column', height: '100%' }}>
            <Grid
              container
              sx={{ position: 'relative' }}
              alignItems={'baseline'}
              gap={1}
            >

              {/* 背景 */}
              <Box sx={{ position: 'absolute', height: '100%', width: '100%' }}>
                {
                  metaDataList[0] && metaDataList[0].cover && 'data' in metaDataList[0].cover[0].data &&
                  <img
                    src={URL.createObjectURL(new Blob([new Uint8Array(metaDataList[0].cover[0].data.data as unknown as ArrayBufferLike)], { type: 'image/png' }))}
                    alt='Cover'
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                }
              </Box>

              <Grid size={12} container
                sx={{
                  padding: '3rem 1rem 1rem 1rem',
                  background: `linear-gradient(0deg, ${theme.palette.background.default}ff, ${theme.palette.background.default}99,${theme.palette.background.default}00)`,
                  gap: '0.25rem',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Grid size={12}>
                  <Typography variant='h4' noWrap>
                    {playlist.title}
                  </Typography>
                </Grid>
                <Grid size='auto'>
                  <Button
                    variant='contained'
                    size='small'
                    // startIcon={<MoreVertOutlined />}
                    onClick={handleClickMenu}
                  >
                    {t`More`}
                  </Button>
                </Grid>
              </Grid>

            </Grid>

            <Grid sx={{ flexGrow: 1 }}>
              <CommonList
                listData={playlist.fileList}
                listType='playlist'
                func={{ open, remove: removeFiles }}
              />
            </Grid>

          </Grid>
      }

      {/* 菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          setRenameDialogOpen(true)
          handleCloseMenu()
        }}>
          <ListItemText primary={t`Rename`} />
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteDiaLogOpen(true)
          handleCloseMenu()
        }}>
          <ListItemText primary={t`Delete`} />
        </MenuItem>
      </Menu>

      {/* 重命名播放列表 */}
      <Dialog
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        fullWidth
        disableRestoreFocus
        maxWidth='xs'
      >
        <DialogTitle>{t`Rename`}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            autoComplete='off'
            margin="dense"
            fullWidth
            variant="standard"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder={t`Enter new title`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameDialog}>{t`Cancel`}</Button>
          <Button onClick={() => {
            if (id && newTitle) {
              renamePlaylist(id, newTitle)
              setRenameDialogOpen(false)
            }
          }} >
            {t`OK`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除播放列表 */}
      <Dialog
        open={deleteDiaLogOpen}
        onClose={() => setDeleteDiaLogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogContent>
          {t`The playlist will be deleted`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDiaLogOpen(false)}>{t`Cancel`}</Button>
          <Button onClick={deletePlaylist} >{t`OK`}</Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default Playlist