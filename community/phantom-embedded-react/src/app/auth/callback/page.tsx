'use client'

import { usePhantom } from '@phantom/react-sdk'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * OAuth Callback Page
 *
 * This page handles the OAuth callback flow for Google/Apple authentication.
 * The PhantomProvider automatically processes the OAuth callback parameters
 * when this page loads. We just need to wait for connection and redirect.
 *
 * @see https://docs.phantom.com/sdks/react-sdk/connect
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const { isConnected, isLoading, connectError } = usePhantom()

  // Redirect to home once connected
  useEffect(() => {
    if (isConnected) {
      // Small delay to ensure session is fully established
      const timer = setTimeout(() => {
        router.push('/')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isConnected, router])

  // Show error if connection failed
  if (connectError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-page">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink">Authentication Failed</h2>
          <p className="text-sm text-text-muted max-w-sm">
            {connectError.message || 'An error occurred during authentication.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-brand text-white rounded-lg hover:brightness-95 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Show loading state while processing callback
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="flex flex-col items-center gap-4 p-8">
        <svg
          className="w-8 h-8 animate-spin text-brand"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-text-muted text-sm">
          {isLoading ? 'Processing authentication...' : 'Completing sign in...'}
        </p>
      </div>
    </div>
  )
}
