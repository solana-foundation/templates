'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession()

      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes (including automatic token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(
        'Auth state change:',
        event,
        newSession?.expires_at ? new Date(newSession.expires_at * 1000) : 'No expiry',
      )

      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)

      // Log token expiry info for debugging
      if (newSession?.expires_at) {
        const expiryTime = new Date(newSession.expires_at * 1000)
        const timeUntilExpiry = expiryTime.getTime() - Date.now()
        console.log(`Token expires at: ${expiryTime.toISOString()}`)
        console.log(`Time until expiry: ${Math.round(timeUntilExpiry / 1000 / 60)} minutes`)
      }

      // No automatic redirect - let users navigate manually
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Monitor wallet connection status - sign out if wallet is disconnected
  useEffect(() => {
    // Only check wallet connection if user is authenticated
    if (!user) return

    const checkWalletConnection = () => {
      // Check if window.solana is available and connected
      if (typeof window !== 'undefined' && window.solana) {
        // Some wallets expose a connected property
        if ('connected' in window.solana && !window.solana.connected) {
          console.log('Wallet disconnected, signing out user')
          signOut()
        }
      }
    }

    // Check immediately
    checkWalletConnection()

    // Set up periodic check every 5 seconds
    const interval = setInterval(checkWalletConnection, 5000)

    return () => clearInterval(interval)
  }, [user])

  const signOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clear localStorage manually as a backup
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage)
        keys.forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
      }

      // Reset state immediately
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error during sign out:', error)

      // Force cleanup even if signOut fails
      if (typeof window !== 'undefined') {
        localStorage.clear() // Clear everything as last resort
      }

      // Reset state
      setUser(null)
      setSession(null)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
