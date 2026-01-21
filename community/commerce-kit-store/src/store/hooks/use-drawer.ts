'use client'

import { useState, useCallback } from 'react'

interface UseDrawerOptions {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

interface UseDrawerReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  setIsOpen: (open: boolean) => void
}

/**
 * Generic drawer/modal state management
 * Can be reused for any drawer/modal/sheet component
 */
export function useDrawer(options: UseDrawerOptions = {}): UseDrawerReturn {
  const { defaultOpen = false, onOpenChange } = options
  const [isOpen, setIsOpenState] = useState(defaultOpen)

  const setIsOpen = useCallback(
    (open: boolean) => {
      setIsOpenState(open)
      onOpenChange?.(open)
    },
    [onOpenChange],
  )

  const open = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const toggle = useCallback(() => {
    setIsOpenState((prev) => {
      const newValue = !prev
      onOpenChange?.(newValue)
      return newValue
    })
  }, [onOpenChange])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}
