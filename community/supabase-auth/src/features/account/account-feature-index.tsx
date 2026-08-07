'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useAppClient } from '@/components/provider'
import { WalletDropdown } from '@/components/wallet-dropdown'

export default function AccountFeatureIndex() {
  const connected = useConnectedWallet(useAppClient())
  const router = useRouter()

  useEffect(() => {
    if (connected) {
      router.push(`/account/${connected.account.address}`)
    }
  }, [connected, router])

  if (connected) {
    return null
  }

  return (
    <div className="hero py-16">
      <div className="hero-content text-center">
        <WalletDropdown />
      </div>
    </div>
  )
}
