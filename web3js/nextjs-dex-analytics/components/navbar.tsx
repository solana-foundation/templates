'use client'

import { Clock, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from './ui/button'

const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then((m) => m.WalletMultiButton), {
  ssr: false,
})

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border/20 bg-black/40 backdrop-blur-xl z-40">
      <div className="container mx-auto flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                <Clock className="h-4 w-4 text-primary" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-foreground font-mono">SOLANA DEX</span>
                <span className="text-[12px] text-muted-foreground/100 font-mono tracking-wider">
                  ANALYTICS TEMPLATE
                </span>
              </div>
            </Link>
          </div>
          <div className="h-4 w-px bg-border/40" />
        </div>

        <div className="flex items-right">
          <Link
            href="/dex-analytics"
            className="flex items-center gap-1.5 px-3 h-8 rounded-md bg-muted/50 border border-border/50 hover:bg-muted/70 transition-all text-xs font-mono font-semibold text-muted-foreground hover:text-foreground tracking-wide"
          >
            ANALYTICS
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full hidden sm:flex border-primary/50 bg-primary/10 text-primary mx-4 "
          >
            <Sparkles className="mr-1 h-4 w-4" />
            Alpha
          </Button>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  )
}
