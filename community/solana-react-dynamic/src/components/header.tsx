import { useState } from 'react'
import { useInitStatus, useUser, useWalletAccounts, useWalletProviders } from '@dynamic-labs-sdk/react-hooks'
import {
  sendEmailOTP,
  verifyOTP,
  signInWithSocialRedirect,
  connectAndVerifyWithWalletProvider,
  logout,
} from '@dynamic-labs-sdk/client'
import type { OTPVerification } from '@dynamic-labs-sdk/client'
import { isSolanaWalletAccount } from '@dynamic-labs-sdk/solana'
import DynamicLogo from './dynamic/logo'

function ConnectButton() {
  const initStatus = useInitStatus()
  const user = useUser()
  const accounts = useWalletAccounts()
  const providers = useWalletProviders()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Email OTP state
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpVerification, setOtpVerification] = useState<OTPVerification | null>(null)
  const [emailStep, setEmailStep] = useState<'input' | 'otp'>('input')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isConnectingWallet, setIsConnectingWallet] = useState<string | null>(null)

  if (initStatus !== 'finished') return null

  const solanaWallet = accounts.find(isSolanaWalletAccount)
  const solanaProviders = providers.filter((p) => p.chain === 'SOL')

  if (user && solanaWallet) {
    const shortAddr = `${solanaWallet.address.slice(0, 4)}...${solanaWallet.address.slice(-4)}`
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-[#606060]">{shortAddr}</span>
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

  function openModal() {
    setOpen(true)
    setError(null)
    setEmailStep('input')
    setEmail('')
    setOtpCode('')
    setOtpVerification(null)
  }

  function closeModal() {
    setOpen(false)
    setError(null)
    setEmailStep('input')
    setEmail('')
    setOtpCode('')
    setOtpVerification(null)
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setIsSendingOtp(true)
    setError(null)
    try {
      const verification = await sendEmailOTP({ email })
      setOtpVerification(verification)
      setEmailStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
    } finally {
      setIsSendingOtp(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!otpVerification || !otpCode) return
    setIsVerifyingOtp(true)
    setError(null)
    try {
      await verifyOTP({ otpVerification, verificationToken: otpCode })
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  async function handleSocialLogin(provider: 'google' | 'twitter') {
    setError(null)
    try {
      await signInWithSocialRedirect({ provider, redirectUrl: window.location.href })
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to sign in with ${provider}`)
    }
  }

  async function handleWalletConnect(providerKey: string) {
    setError(null)
    setIsConnectingWallet(providerKey)
    try {
      await connectAndVerifyWithWalletProvider({ walletProviderKey: providerKey })
      closeModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsConnectingWallet(null)
    }
  }

  const inputClass =
    'w-full px-3 py-2 bg-white rounded-lg text-sm text-[#030303] placeholder-[#9ca3af] outline-none focus:border-[#4779FF] focus:ring-1 focus:ring-[#4779FF]/30 transition-colors'

  return (
    <div className="relative">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-[#4779FF] hover:bg-[#3366ee] text-white text-sm rounded-lg font-medium transition-colors"
      >
        Connect
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeModal}
          />

          {/* Modal */}
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm z-50"
            style={{ border: '1px solid #DADADA' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#030303]">Sign in</h2>
              <button
                onClick={closeModal}
                className="text-[#606060] hover:text-[#030303] text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-lg text-sm text-[#C5221F] bg-[#FCE8E6]"
                style={{ border: '1px solid #F5C6C2' }}
              >
                {error}
              </div>
            )}

            {/* Email OTP */}
            <div className="mb-4">
              {emailStep === 'input' ? (
                <form onSubmit={handleSendOtp} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={inputClass}
                    style={{ border: '1px solid #DADADA' }}
                  />
                  <button
                    type="submit"
                    disabled={isSendingOtp || !email}
                    className="px-3 py-2 bg-[#4779FF] hover:bg-[#3366ee] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    {isSendingOtp ? '...' : 'Send code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-2">
                  <p className="text-xs text-[#606060]">Enter the code sent to {email}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="6-digit code"
                      required
                      autoFocus
                      className={inputClass}
                      style={{ border: '1px solid #DADADA' }}
                    />
                    <button
                      type="submit"
                      disabled={isVerifyingOtp || !otpCode}
                      className="px-3 py-2 bg-[#4779FF] hover:bg-[#3366ee] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      {isVerifyingOtp ? '...' : 'Verify'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEmailStep('input'); setOtpCode('') }}
                    className="text-xs text-[#4779FF] hover:underline"
                  >
                    Use a different email
                  </button>
                </form>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#DADADA]" />
              <span className="text-xs text-[#9ca3af]">or</span>
              <div className="flex-1 h-px bg-[#DADADA]" />
            </div>

            {/* Social buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-[#030303] rounded-lg hover:bg-[#F9F9F9] transition-colors"
                style={{ border: '1px solid #DADADA' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('twitter')}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-[#030303] rounded-lg hover:bg-[#F9F9F9] transition-colors"
                style={{ border: '1px solid #DADADA' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </button>
            </div>

            {/* Wallet providers */}
            {solanaProviders.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-[#DADADA]" />
                  <span className="text-xs text-[#9ca3af]">Solana wallets</span>
                  <div className="flex-1 h-px bg-[#DADADA]" />
                </div>
                <div className="space-y-1">
                  {solanaProviders.map((provider) => (
                    <button
                      key={provider.key}
                      onClick={() => handleWalletConnect(provider.key)}
                      disabled={isConnectingWallet === provider.key}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-[#030303] hover:bg-[#F9F9F9] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      {provider.metadata.icon && (
                        <img src={provider.metadata.icon} alt="" className="w-5 h-5 rounded" />
                      )}
                      <span className="flex-1 text-left">{provider.metadata.displayName}</span>
                      {isConnectingWallet === provider.key && (
                        <span className="text-xs text-[#606060]">Connecting...</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
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
      <a href="/" className="flex items-center">
        <DynamicLogo width={120} height={24} className="text-[#030303]" />
      </a>
      <ConnectButton />
    </header>
  )
}
