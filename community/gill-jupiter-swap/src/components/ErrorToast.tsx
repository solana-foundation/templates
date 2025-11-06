'use client'

import React, { useEffect, useState } from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ErrorToastProps {
  message: string
  onClose: () => void
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <div className="bg-red-900/90 backdrop-blur-sm border border-red-500 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-100 font-medium">Wallet Error</p>
            <p className="text-sm text-red-200 mt-1">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-red-300 hover:text-red-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast manager to handle multiple toasts
interface Toast {
  id: string
  message: string
}

export const useErrorToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showError = (message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${1 + index * 6}rem` }} className="fixed right-4 z-50">
          <ErrorToast message={toast.message} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </>
  )

  return { showError, ToastContainer }
}
