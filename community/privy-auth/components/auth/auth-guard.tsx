'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { AuthState } from '@/types/privy'

/**
 * AuthGuard protects pages that require authentication.
 * Wraps page content and redirects unauthenticated users to home.
 *
 * Usage:
 * ```tsx
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy()
  const router = useRouter()

  const authState: AuthState = !ready ? 'loading' : authenticated ? 'authenticated' : 'unauthenticated'

  useEffect(() => {
    if (authState === 'unauthenticated') {
      router.push('/')
    }
  }, [authState, router])

  if (authState === 'loading') {
    return (
      <div className="auth-guard-loading">
        <div className="loading-spinner" />
        <p>Checking authentication...</p>
      </div>
    )
  }

  if (authState === 'unauthenticated') {
    return null
  }

  return <>{children}</>
}
