'use client'
import { WalletButton } from '@/components/solana/solana-provider'
import Image from 'next/image'

export function AppHeader() {
  return (
    <header className="w-full py-2">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Image
          src="https://solana.org/_next/static/media/logo-wordmark-light.a56a29ac.svg"
          alt="Solana Quickstart"
          width={200}
          height={200}
        />
        <div className="flex items-center gap-2">
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
