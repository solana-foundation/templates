'use client'

import { usePrivy, useLogin } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

/**
 * LoginButton triggers Privy's pre-built authentication modal.
 * Supports social logins (Google, Twitter, Discord, GitHub),
 * email, and existing wallet connections.
 */
export function LoginButton() {
  const { ready } = usePrivy()
  const router = useRouter()

  const { login } = useLogin({
    onComplete: () => {
      router.push('/dashboard')
    },
  })

  return (
    <button id="login-button" className="btn-primary" disabled={!ready} onClick={() => login()}>
      <span>Connect Wallet</span>
    </button>
  )
}
