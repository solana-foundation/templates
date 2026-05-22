'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useInitStatus, useUser, useWalletAccounts, useWalletProviders } from '@dynamic-labs-sdk/react-hooks'
import {
  connectAndVerifyWithWalletProvider,
  logout,
  sendEmailOTP,
  verifyOTP,
  signInWithSocialRedirect,
} from '@dynamic-labs-sdk/client'
import type { OTPVerification } from '@dynamic-labs-sdk/client'
import { isSolanaWalletAccount } from '@dynamic-labs-sdk/solana'
import DynamicLogo from './dynamic/logo'

type AuthStep = 'menu' | 'otp'

function AuthModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<AuthStep>('menu')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [otpVerification, setOtpVerification] = useState<OTPVerification | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const providers = useWalletProviders()
  const solanaProviders = providers.filter((p) => p.chain === 'SOL')

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const verification = await sendEmailOTP({ email })
      setOtpVerification(verification)
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpVerification) return
    setLoading(true)
    setError(null)
    try {
      await verifyOTP({ otpVerification, verificationToken: code })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider: string) => {
    setError(null)
    try {
      await signInWithSocialRedirect({ provider: provider as 'google' | 'twitter', redirectUrl: window.location.href })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social login failed')
    }
  }

  const handleWallet = async (walletProviderKey: string) => {
    setError(null)
    try {
      await connectAndVerifyWithWalletProvider({ walletProviderKey })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-white rounded-lg outline-none focus:ring-1 focus:ring-[#4779FF]/30 transition-colors'
  const btnPrimary =
    'w-full py-2 bg-[#4779FF] hover:bg-[#3366ee] disabled:opacity-50 text-white text-sm rounded-lg font-medium transition-colors'
  const btnSecondary =
    'w-full py-2 text-sm rounded-lg transition-colors hover:bg-[#F9F9F9] flex items-center justify-center gap-2'

  return (
    <div
      className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-4 w-72 z-50"
      style={{ border: '1px solid #DADADA' }}
    >
      {error && (
        <p className="text-xs text-[#C5221F] px-3 py-2 mb-3 bg-[#FCE8E6] rounded-lg break-words">{error}</p>
      )}

      {step === 'menu' && (
        <div className="space-y-3">
          {/* Social */}
          <div className="space-y-2">
            <button
              onClick={() => handleSocial('google')}
              className={btnSecondary}
              style={{ border: '1px solid #DADADA' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => handleSocial('twitter')}
              className={btnSecondary}
              style={{ border: '1px solid #DADADA' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Continue with Twitter
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-[#DADADA]" />
            <span className="text-xs text-[#9ca3af]">or</span>
            <div className="flex-1 h-px bg-[#DADADA]" />
          </div>

          {/* Email */}
          <form onSubmit={handleEmailSend} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className={inputClass}
              style={{ border: '1px solid #DADADA' }}
            />
            <button type="submit" disabled={loading || !email} className={btnPrimary}>
              {loading ? 'Sending…' : 'Continue with Email'}
            </button>
          </form>

          {/* Wallets */}
          {solanaProviders.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#DADADA]" />
                <span className="text-xs text-[#9ca3af]">or connect wallet</span>
                <div className="flex-1 h-px bg-[#DADADA]" />
              </div>
              <div className="space-y-1">
                {solanaProviders.map((provider) => (
                  <button
                    key={provider.key}
                    onClick={() => handleWallet(provider.key)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#030303] hover:bg-[#F9F9F9] rounded-lg transition-colors"
                  >
                    {provider.metadata.icon && (
                      <img src={provider.metadata.icon} alt="" className="w-5 h-5 rounded" />
                    )}
                    {provider.metadata.displayName}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpVerify} className="space-y-3">
          <p className="text-sm text-[#606060]">
            Enter the code sent to <span className="font-medium text-[#030303]">{email}</span>
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            required
            autoFocus
            maxLength={6}
            className={inputClass}
            style={{ border: '1px solid #DADADA' }}
          />
          <button type="submit" disabled={loading || code.length < 4} className={btnPrimary}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('menu'); setCode(''); setError(null) }}
            className="w-full text-sm text-[#606060] hover:text-[#030303] transition-colors"
          >
            ← Back
          </button>
        </form>
      )}
    </div>
  )
}

function ConnectButton() {
  const initStatus = useInitStatus()
  const user = useUser()
  const accounts = useWalletAccounts()
  const [open, setOpen] = useState(false)

  if (initStatus !== 'finished') return null

  const solanaWallet = accounts.find(isSolanaWalletAccount)

  if (user || solanaWallet) {
    const addr = solanaWallet?.address
    const shortAddr = addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : ''
    return (
      <div className="flex items-center gap-2">
        {shortAddr && <span className="text-sm font-mono text-[#606060]">{shortAddr}</span>}
        <button
          onClick={() => logout()}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:bg-[#F9F9F9]"
          style={{ border: '1px solid #DADADA' }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 bg-[#4779FF] hover:bg-[#3366ee] text-white text-sm rounded-lg font-medium transition-colors"
      >
        Connect
      </button>
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </div>
  )
}

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white"
      style={{
        borderBottom: '1px solid #DADADA',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)',
      }}
    >
      <Link href="/" className="flex items-center">
        <DynamicLogo width={120} height={24} className="text-[#030303]" />
      </Link>
      <ConnectButton />
    </header>
  )
}
