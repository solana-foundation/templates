import { useCallback, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light' | 'system'

const STORAGE_KEY = 'sample-react-kit-privy:theme'

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system'
}

/** Reads the stored preference. Exported so it can run before the first paint. */
export function loadTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

/**
 * Puts the preference on `<html>`.
 *
 * `system` deliberately removes both classes rather than resolving the media query itself. The
 * stylesheet already answers it — the dark tokens apply under `prefers-color-scheme` unless
 * `.light` opts out — so leaving the element bare keeps one source of truth and lets the page
 * follow the OS live, without a listener re-resolving anything.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (theme !== 'system') {
    root.classList.add(theme)
  }
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(loadTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* Storage is unavailable — the choice lives for this session only. */
    }
    setThemeState(next)
  }, [])

  return [theme, setTheme]
}
