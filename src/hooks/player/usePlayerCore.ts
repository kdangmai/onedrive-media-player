import { useState, useMemo, useEffect } from 'react'
import useHistoryStore from '@/store/useHistoryStore'
import useLocalMetaDataStore from '@/store/useLocalMetaDataStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { checkFileType, getNetMetaData, pathConvert } from '@/utils'
import useFilesData from '../graph/useFilesData'
import { MetaData } from '@/types/MetaData'
import useUser from '../graph/useUser'
import { useShallow } from 'zustand/shallow'

const usePlayerCore = (player: HTMLVideoElement | null) => {

  const { account } = useUser()

  const { getFileData } = useFilesData()

  const [
    currentMetaData,
    metadataUpdate,
    autoPlay,
    isLoading,
    updateCurrentMetaData,
    updateMetadataUpdate,
    updateAutoPlay,
    updateIsLoading,
    updateCover,
    updateCurrentTime,
    updateDuration,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.currentMetaData,
        state.metadataUpdate,
        state.autoPlay,
        state.isLoading,
        state.updateCurrentMetaData,
        state.updateMetadataUpdate,
        state.updateAutoPlay,
        state.updateIsLoading,
        state.updateCover,
        state.updateCurrentTime,
        state.updateDuration,
      ]
    )
  )

  const { getLocalMetaData, setLocalMetaData } = useLocalMetaDataStore()

  const playQueue = usePlayQueueStore.use.playQueue()
  const currentIndex = usePlayQueueStore.use.currentIndex()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()


  const repeat = useUiStore((state) => state.repeat)
  const [historyList, insertHistory] = useHistoryStore(
    useShallow((state) => [state.historyList, state.insertHistory])
  )

  const [url, setUrl] = useState('')

  const currentFile = playQueue?.filter(item => item.index === currentIndex)[0]
  const fileType = currentFile && checkFileType(currentFile.fileName)

  // 获取当前播放文件链接
  useMemo(
    () => {
      if (player) {
        player.src = ''
      }
      if (playQueue !== null && playQueue.length !== 0 && currentFile) {
        updateIsLoading(true)
        try {
          getFileData(account, pathConvert(currentFile.filePath)).then((res) => {
            setUrl(res['@microsoft.graph.downloadUrl'])
          })
        } catch (error) {
          console.error(error)
          updateAutoPlay(false)
          updateIsLoading(false)
          player?.pause()
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFile?.filePath]
  )

  useMemo(
    () => {
      if (player !== null && playQueue) {
        updateDuration(0)
        player.load()
        player.onloadedmetadata = () => {
          if (isLoading && autoPlay) {
            player.play()
            if (historyList && currentFile) {
              insertHistory({
                fileName: currentFile.fileName,
                filePath: currentFile.filePath,
                fileSize: currentFile.fileSize,
                fileType: currentFile.fileType,
              })
            }
          }
          updateIsLoading(false)
          updateDuration(player.duration)
        }
      }
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

  // 设置当前播放进度
  useEffect(
    () => {
      if (player)
        player.ontimeupdate = () => {
          updateCurrentTime(player.currentTime)
        }
    },
    [player, updateCurrentTime]
  )

  // 播放结束时
  const onEnded = () => {
    if (playQueue) {
      const next = playQueue[playQueue.findIndex(item => item.index === currentIndex) + 1]
      const isPlayQueueEnd = currentIndex + 1 === playQueue?.length
      if (repeat === 'one') {
        player?.play()
      } else if (repeat === 'off' || repeat === 'all') {
        if (isPlayQueueEnd || !next) {
          if (repeat === 'off') {
            player?.pause()
            updateAutoPlay(false)
          }
          updateCurrentIndex(playQueue[0].index)
        } else
          updateCurrentIndex(next.index)
      }
    }
  }

  // 更新当前 metadata
  useEffect(
    () => {
      const updateMetaData = async () => {
        if (playQueue && currentFile) {
          const metaData: MetaData = await getLocalMetaData(currentFile.filePath)

          if (!metaData) {
            updateCover('./cover.svg')
            updateCurrentMetaData(
              {
                title: currentFile.fileName || 'Not playing',
                artist: '',
                path: currentFile.filePath,
              }
            )
          } else if (
            fileType === 'audio'
            &&
            metaData
            &&
            metaData.path
            &&
            pathConvert(metaData.path) === pathConvert(currentFile.filePath)
          ) {
            console.log('Update current metaData: ', metaData)
            updateCurrentMetaData(metaData)
            if (metaData.cover?.length) {
              const cover = metaData.cover[0]
              if (cover && 'data' in cover.data && Array.isArray(cover.data.data)) {
                updateCover(URL.createObjectURL(new Blob([new Uint8Array(cover.data.data as unknown as ArrayBufferLike)], { type: cover.format })))
              } else if (cover) {
                updateCover(URL.createObjectURL(new Blob([new Uint8Array(cover.data as ArrayBufferLike)], { type: cover.format })))
              }
            } else {
              updateCover('./cover.svg')
            }
          }
        }
      }

      updateMetaData()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFile?.filePath, metadataUpdate]
  )

  // 获取在线 metadata
  useEffect(
    () => {
      const run = async () => {

        if (playQueue && fileType === 'audio' && currentMetaData?.path) {
          const localMetaData = await getLocalMetaData(currentMetaData?.path)

          if (!localMetaData) {
            const netMetaData = await getNetMetaData(currentMetaData?.path, url)
            if (netMetaData) {
              setLocalMetaData(netMetaData).then(() => updateMetadataUpdate())
            }
          }
        }
      }

      run()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  )

  // 设置标题
  useEffect(
    () => {
      if (currentMetaData) {
        document.title = `${currentMetaData.title}${currentMetaData.artist ? ` - ${currentMetaData.artist}` : ''}`
      }
      return () => {
        document.title = 'OMP'
      }
    },
    [currentMetaData, player?.paused]
  )

  return {
    url,
    onEnded,
  }

}

export default usePlayerCore