'use client'

import { usePrivy } from '@privy-io/react-auth'
import { LoginButton } from '@/components/auth/login-button'
import { UserProfile } from '@/components/auth/user-profile'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import Link from 'next/link'
import { Shield } from 'lucide-react'

/**
 * Minimalist navigation bar.
 * Shows brand, dashboard link (if authed), theme toggle, and auth button.
 */
export function Navbar() {
  const { ready, authenticated } = usePrivy()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <Shield size={20} />
          <span>Privy Auth</span>
        </Link>

        <div className="navbar-auth">
          <ThemeToggle />
          {!ready ? <div className="nav-skeleton" /> : authenticated ? <UserProfile /> : <LoginButton />}
        </div>
      </div>
    </header>
  )
}
