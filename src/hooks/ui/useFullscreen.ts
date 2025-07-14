import useUiStore from '@/store/useUiStore'
import { useEffect } from 'react'

const useFullscreen = () => {

  const updateFullscreen = useUiStore(state => state.updateFullscreen)

  // 检测全屏
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  })

  function handleClickFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        // Xử lý lỗi quyền hoặc không hỗ trợ
        console.error("Fullscreen error:", err);
      });
    } else {
      console.error("Fullscreen API not supported");
    }
  }

  useEffect(() => {
    const handleClickF11 = (e: KeyboardEvent) => {
      if (e.code === 'F11') {
        e.preventDefault()
        handleClickFullscreen()
      }
    }
    document.addEventListener('keydown', handleClickF11)
    return () => {
      document.removeEventListener('keydown', handleClickF11)
    }
  })

  return { handleClickFullscreen }
}

export default useFullscreen