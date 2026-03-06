'use client'

import { useState } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID

function isValidAppId(id: string | undefined): id is string {
  return !!id && id !== 'your-privy-app-id' && id !== 'PLACEHOLDER' && id.length > 10
}

const ENV_SNIPPET = `NEXT_PUBLIC_PRIVY_APP_ID=your-app-id-here`

function MissingEnvScreen() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ENV_SNIPPET)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const textarea = document.createElement('textarea')
      textarea.value = ENV_SNIPPET
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-lg">
        <CardHeader>
          <div className="mb-2 inline-flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Setup Required</span>
          </div>
          <CardTitle className="text-2xl">Privy App ID Required</CardTitle>
          <CardDescription>
            To use this template, you need a Privy App ID. Follow the steps below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </span>
              <span>
                Go to{' '}
                <a
                  href="https://dashboard.privy.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                >
                  dashboard.privy.io
                </a>{' '}
                and create or select an app
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              <span>
                Go to <strong>Settings &gt; Basics</strong> and copy your App ID
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              <span>
                Create a <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">.env.local</code> file in
                the project root
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                4
              </span>
              <span>Add your App ID to the file:</span>
            </li>
          </ol>

          <div className="relative">
            <pre className="rounded-lg bg-muted p-4 font-mono text-sm">
              <code>{ENV_SNIPPET}</code>
            </pre>
            <Button variant="ghost" size="xs" className="absolute right-2 top-2" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              After adding your App ID, restart the dev server with{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                pnpm dev
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  if (!isValidAppId(PRIVY_APP_ID)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[privy-auth] NEXT_PUBLIC_PRIVY_APP_ID is missing or set to a placeholder value.')
    }
    return <MissingEnvScreen />
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          walletChainType: 'solana-only',
        },
        loginMethods: ['google', 'github', 'discord', 'twitter', 'email'],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        solana: {
          rpcs: {
            'solana:devnet': {
              rpc: createSolanaRpc('https://api.devnet.solana.com'),
              rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.devnet.solana.com'),
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
