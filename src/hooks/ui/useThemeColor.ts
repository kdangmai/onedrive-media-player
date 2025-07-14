import { useEffect } from 'react'
import useUiStore from '../../store/useUiStore'
import { blendHex } from '@/utils'
import { Theme, useMediaQuery } from '@mui/material'
import { useShallow } from 'zustand/shallow'
const useThemeColor = (theme: Theme) => {

  const [
    audioViewIsShow,
    audioViewTheme,
    videoViewIsShow,
    coverColor,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.audioViewIsShow,
        state.audioViewTheme,
        state.videoViewIsShow,
        state.coverColor,
      ]
    )
  )

  const windowControlsOverlayOpen = useMediaQuery('(display-mode: window-controls-overlay)')

  useEffect(
    () => {
      const themeColorLight = document.getElementById('themeColorLight') as HTMLMetaElement
      const themeColorDark = document.getElementById('themeColorDark') as HTMLMetaElement

      if (themeColorLight && themeColorDark) {
        if (!audioViewIsShow && !videoViewIsShow) {
          themeColorLight.content = theme.palette.background.default
          themeColorDark.content = theme.palette.background.default
        }
        else if (audioViewIsShow && audioViewTheme === 'classic') {
          themeColorLight.content = '#1e1e1e'
          themeColorDark.content = '#1e1e1e'
        }
        else if (audioViewIsShow && audioViewTheme === 'modern') {
          const color = blendHex(`${theme.palette.background.default}`, windowControlsOverlayOpen ? `${coverColor}31` : `${coverColor}33`)
          themeColorLight.content = color
          themeColorDark.content = color
        }
      }
    },
    [audioViewIsShow, audioViewTheme, coverColor, theme.palette.background.default, videoViewIsShow, windowControlsOverlayOpen]
  )

}

export default useThemeColor