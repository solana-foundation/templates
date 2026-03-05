'use client'

import React from 'react'
import Link from 'next/link'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Navbar() {
  return (
    <header className="relative z-50 px-4 py-2 bg-card/50">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-baseline gap-4">
          <Link className="text-xl hover:text-muted-foreground transition-colors" href="/">
            <span className="font-semibold tracking-tight">Staking</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Devnet</span>
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  )
}
