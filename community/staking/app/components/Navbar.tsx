'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { WalletConnectButton } from './WalletConnectButton'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link className="text-lg font-semibold tracking-tight transition-colors hover:text-muted-foreground" href="/">
          Staking
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground font-medium">Devnet</span>
          </div>
          <WalletConnectButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
