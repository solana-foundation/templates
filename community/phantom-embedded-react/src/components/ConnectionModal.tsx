'use client'

import { useEffect } from 'react'
import GoogleIcon from './icons/GoogleIcon'
import AppleIcon from './icons/AppleIcon'
import ExtensionIcon from './icons/ExtensionIcon'

interface ConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (provider: 'google' | 'apple' | 'injected') => void
  isConnecting: boolean
  isPhantomAvailable: boolean
  isExtensionInstalled: boolean
  error: Error | null
}

export default function ConnectionModal({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  isPhantomAvailable,
  isExtensionInstalled,
  error,
}: ConnectionModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const connectionOptions = [
    {
      id: 'google',
      name: 'Google',
      icon: <GoogleIcon className="w-8 h-8" />,
      description: 'Sign in with Google',
      available: true,
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: <AppleIcon className="w-8 h-8 text-ink" />,
      description: 'Sign in with Apple',
      available: true,
    },
    {
      id: 'injected',
      name: 'Browser Extension',
      icon: <ExtensionIcon className="w-8 h-8 text-phantom" />,
      description: 'Connect via Phantom extension',
      available: isExtensionInstalled,
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-colors"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-ink">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-ink transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error message - only show actual connection errors, not session initialization errors */}
        {error && !error.message.includes('No valid session found') && (
          <div className="mb-4 p-4 bg-orange/10 border border-orange rounded-lg">
            <p className="text-sm font-semibold text-orange mb-2">{error.message}</p>
            <p className="text-xs text-muted mt-2">Please try again or use a different connection method.</p>
          </div>
        )}

        {/* Connection options */}
        <div className="space-y-3">
          {connectionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onConnect(option.id as any)}
              disabled={!option.available || isConnecting}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                option.available
                  ? 'border-gray-200 dark:border-gray-700 hover:border-phantom hover:bg-phantom/5 cursor-pointer'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 cursor-not-allowed opacity-50'
              } ${isConnecting ? 'opacity-50 cursor-wait' : ''}`}
            >
              <div className="flex items-center justify-center">{option.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-ink">{option.name}</div>
                <div className="text-sm text-muted">{option.description}</div>
              </div>
              {!option.available && <span className="text-xs text-orange">Unavailable</span>}
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-muted text-center">By connecting, you agree to Phantom&apos;s Terms of Service</p>
        </div>
      </div>
    </div>
  )
}
