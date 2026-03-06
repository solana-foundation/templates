'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { Shield, Wallet, Users, Lock, ArrowRight } from 'lucide-react'

/**
 * Landing page — public, accessible to everyone.
 * Shows a hero section with login CTA and feature cards
 * explaining what Privy Auth provides.
 */
export default function Home() {
  const { login, ready, authenticated } = usePrivy()
  const router = useRouter()

  const handleGetStarted = () => {
    if (authenticated) {
      router.push('/dashboard')
    } else {
      login()
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">Solana Community Template</div>

          <h1>
            Auth for <span className="gradient-text">Solana dApps</span>
            <br />
            made simple
          </h1>

          <p className="hero-description">
            Integrate social logins, embedded wallets, and protected routes into your Solana dApp with Privy. No seed
            phrases, no friction.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={handleGetStarted} disabled={!ready}>
              {authenticated ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight size={18} />
            </button>
            <a href="https://docs.privy.io" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Read the Docs
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <Users size={22} />
          </div>
          <h3>Social Logins</h3>
          <p>
            Let users sign in with Google, Twitter, Discord, GitHub, or email. No wallet required — Privy handles
            onboarding seamlessly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Wallet size={22} />
          </div>
          <h3>Embedded Wallets</h3>
          <p>
            Automatically create Solana wallets for every user on login. Sign messages and send transactions without
            browser extensions.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Lock size={22} />
          </div>
          <h3>Protected Routes</h3>
          <p>
            Guard pages with authentication. Unauthenticated users are redirected while authenticated users access their
            dashboard.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Shield size={22} />
          </div>
          <h3>Session Management</h3>
          <p>Privy handles session tokens, refresh flows, and secure authentication state — no backend setup needed.</p>
        </div>
      </section>
    </>
  )
}
