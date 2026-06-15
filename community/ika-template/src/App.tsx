import { useEffect, useState } from 'react'
import { Moon, Sun, Cpu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { WalletConnect } from '@/components/WalletConnect'
import { OperatorPanel } from '@/components/OperatorPanel'
import { SessionPanel } from '@/components/SessionPanel'
import { CreateStep } from '@/components/CreateStep'
import { SendStep } from '@/components/SendStep'
import { GridBackground } from '@/components/GridBackground'
import { useTheme } from '@/components/theme-provider'
import { listDWallets, type StoredDWallet } from '@/lib/dwallets'

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <a href="/" className="flex items-center gap-2 text-xl font-bold">
        <span className="grid size-7 place-items-center rounded-md bg-primary text-sm text-primary-foreground">◈</span>
        Ika dWallet
      </a>
      <div className="flex items-center gap-2">
        <WalletConnect />
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h1 className="font-black tracking-tight text-foreground">
          <span className="block text-7xl md:text-8xl">Ika</span>
          <span className="block text-5xl md:text-6xl">dWallet</span>
        </h1>
        <div className="flex max-w-lg flex-col gap-3">
          <p className="text-base leading-relaxed text-foreground/50">
            A Solana account controlled by threshold MPC, with no single key, ever. Create an Ika ED25519 dWallet (its
            public key <em>is</em> a Solana address), then sign and broadcast a real devnet transaction. You and the Ika
            network co-sign, and neither can sign alone.
          </p>
          <a
            href="https://docs.ika.xyz/docs/core-concepts/dwallets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
          >
            How dWallets work
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function WhatIsADWallet() {
  return (
    <section className="mb-8 rounded-2xl border border-border-low bg-card/60 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Cpu className="size-5 text-muted-foreground" />
        What's a dWallet?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        A dWallet is an account whose private key is never held by one party. Instead the key is split in two by
        threshold MPC: <span className="font-medium text-foreground">your user share</span> and the{' '}
        <span className="font-medium text-foreground">Ika network share</span> (held across Ika's validators). Both are
        needed to sign, and the full key is never assembled anywhere. On the ED25519 curve a dWallet's public key{' '}
        <em>is</em> a Solana address, so this dWallet is a Solana account that no single party can sign for alone.
      </p>
      <p className="mt-3 text-sm text-muted">
        Below you'll first create your half (a keypair), then run the key generation that produces the dWallet from both
        halves, then use both halves again to sign a real Solana transaction.{' '}
        <a
          className="font-medium text-foreground/80 underline underline-offset-2 hover:text-foreground"
          href="https://docs.ika.xyz/docs/core-concepts/dwallets"
          target="_blank"
          rel="noreferrer"
        >
          Learn more →
        </a>
      </p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border-low">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted sm:flex-row">
        <p>Solana devnet + Ika/Sui testnet. Teaching tool, no mainnet, no real funds.</p>
        <div className="flex items-center gap-3">
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="https://docs.ika.xyz/docs/sdk"
            target="_blank"
            rel="noreferrer"
          >
            Ika SDK docs
          </a>
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="./docs/architecture.md"
            target="_blank"
            rel="noreferrer"
          >
            Architecture
          </a>
          <a
            className="underline underline-offset-2 hover:text-foreground"
            href="./docs/ika-concepts.md"
            target="_blank"
            rel="noreferrer"
          >
            Concepts
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  // The dWallet currently in focus: the most recent one, created or restored.
  const [active, setActive] = useState<StoredDWallet | null>(null)
  // Whether the user has generated their user-share keypair (gates Step 1).
  const [userShareReady, setUserShareReady] = useState(false)
  // Whether the Sui operator keypair exists and is funded (gates both steps).
  const [operatorReady, setOperatorReady] = useState(false)

  useEffect(() => {
    const existing = listDWallets()
    if (existing.length) setActive(existing[0])
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <GridBackground />
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-6xl px-6">
          <Hero />

          <WhatIsADWallet />

          <div className="space-y-6">
            {/* Setup: the backstage operator + your user share, side by side */}
            <div className="grid gap-6 md:grid-cols-2">
              <OperatorPanel onChange={setOperatorReady} />
              <SessionPanel onChange={setUserShareReady} />
            </div>

            {/* Step 1 */}
            <CreateStep onCreated={setActive} userShareReady={userShareReady} operatorReady={operatorReady} />

            {/* Step 2, gated until a dWallet exists */}
            {active ? (
              <SendStep dWallet={active} operatorReady={operatorReady} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border-low bg-card/40 p-8 text-center text-sm text-muted">
                <span className="grid mx-auto mb-2 size-6 place-items-center rounded-full bg-cream text-xs font-semibold text-foreground/70">
                  2
                </span>
                Create a dWallet above, then fund it and send a transaction here.
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
