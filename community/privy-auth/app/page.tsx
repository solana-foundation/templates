'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginButton } from '@/components/auth/login-button'

const features = [
  {
    title: 'Social Login',
    description: 'Sign in with Google, GitHub, Discord, Twitter, or email',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
  },
  {
    title: 'Embedded Wallet',
    description: 'Solana wallet created automatically on login',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
        />
      </svg>
    ),
  },
  {
    title: 'Sign Messages',
    description: 'Cryptographically sign messages with your wallet',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    title: 'Solana Devnet',
    description: 'Built for Solana devnet development and testing',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    ),
  },
]

function LoadingScreen() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function Home() {
  const { ready, authenticated } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/dashboard')
    }
  }, [ready, authenticated, router])

  if (!ready || authenticated) {
    return <LoadingScreen />
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Background gradient accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/8 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-teal-500/8 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-green-500/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <section className="flex flex-col items-center pb-16 pt-20 text-center sm:pb-20 sm:pt-28">
          <div className="mb-4 inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Solana Devnet Template
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-teal-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-violet-300 dark:to-teal-300">
              Privy Auth
            </span>
            <br />
            <span className="text-foreground">+ Wallet</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Social login + embedded Solana wallet powered by Privy. Get started with authentication, wallet creation,
            and message signing in minutes.
          </p>

          <div className="mt-10">
            {authenticated ? (
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <LoginButton size="lg" className="h-12 px-8 text-base">
                Get Started
              </LoginButton>
            )}
          </div>
        </section>

        {/* Feature cards */}
        <section className="pb-20">
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80"
              >
                <CardHeader>
                  <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
