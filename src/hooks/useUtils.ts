import useUiStore from '@/store/useUiStore'
import { FileItem } from '@/types/file'

const useUtils = () => {
  const hdThumbnails = useUiStore(state => state.hdThumbnails)
  const getThumbnailUrl = (item: FileItem): string | null => {
    if (item.thumbnails && item.thumbnails[0])
      return hdThumbnails ? item.thumbnails[0].large.url : item.thumbnails[0].medium.url
    return null
  }

  return { getThumbnailUrl }
}
export default useUtils