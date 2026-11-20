'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useSolana } from '@/components/provider'
import { useConnectedWallet, useIsWalletReady } from '@solana/kit-plugin-wallet/react'
import { matchesWallet, signOutWalletSession } from '@/lib/wallet-auth'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { client } = useSolana()
  const wallet = useConnectedWallet(client)
  const ready = useIsWalletReady(client)
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    let receivedEvent = false
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession()

      if (!active || receivedEvent) return
      setSession(initialSession)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    }

    getInitialSession().catch(() => {
      if (active) setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      receivedEvent = true
      if (!active) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    await signOutWalletSession(supabase.auth)
    setUser(null)
    setSession(null)
  }, [])

  const matches = matchesWallet(user, wallet?.account.address)
  useEffect(() => {
    if (ready && !loading && session && !matches) {
      void signOutWalletSession(supabase.auth, session.access_token).catch((error) => {
        console.error('Could not clear the previous wallet session:', error)
      })
    }
  }, [ready, loading, session, matches])

  const value = {
    user: matches ? user : null,
    session: matches ? session : null,
    loading: loading || !ready,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
