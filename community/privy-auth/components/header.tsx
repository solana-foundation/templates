'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { AuthStatus } from '@/components/auth/auth-status'
import { LoginButton } from '@/components/auth/login-button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/protected', label: 'Protected' },
] as const

export function Header() {
  const pathname = usePathname()
  const { ready, authenticated } = usePrivy()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
            Privy Auth + Wallet
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  pathname === link.href ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <AuthStatus />
          {ready && !authenticated && <LoginButton size="sm" />}
        </div>
      </div>
    </header>
  )
}
