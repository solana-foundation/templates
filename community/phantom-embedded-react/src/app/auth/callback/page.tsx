'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * AuthCallbackPage - Handles OAuth callback redirect from Phantom
 * After authentication, redirects the user back to the home page
 */
export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Phantom will redirect here after OAuth flow
    // Then we redirect to home page after a brief delay
    const timer = setTimeout(() => {
      router.push('/')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page">
      <div className="flex flex-col items-center gap-4">
        {/* Loading spinner */}
        <svg
          className="h-8 w-8 animate-spin text-brand"
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
        <p className="text-muted">Completing authentication...</p>
      </div>
    </div>
  )
}
