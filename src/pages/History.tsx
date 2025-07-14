import useHistoryStore from '../store/useHistoryStore'
import CommonList from '../components/CommonList/CommonList'
import Loading from './Loading'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { checkFileType } from '@/utils'
import { useShallow } from 'zustand/shallow'

const History = () => {
  const [historyList, removeHistory] = useHistoryStore(
    useShallow((state) => [state.historyList, state.removeHistory])
  )
  const [shuffle, updateVideoViewIsShow, updateShuffle,] = useUiStore(
    useShallow((state) => [state.shuffle, state.updateVideoViewIsShow, state.updateShuffle])
  )

  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const updateAutoPlay = usePlayerStore(state => state.updateAutoPlay)

  const open = (index: number) => {
    const listData = historyList
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

  return (
    <div style={{ height: '100%' }}>
      {
        (!historyList) ? <Loading />
          : <CommonList
            listData={historyList}
            listType='files'
            func={{ open, remove: removeHistory }}
          />
      }
    </div>
  )
}

export default History