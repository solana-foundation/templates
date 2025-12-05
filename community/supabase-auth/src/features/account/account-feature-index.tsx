'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useWalletSession } from '@solana/react-hooks'
import { WalletDropdown } from '@/components/wallet-dropdown'

export default function AccountFeatureIndex() {
  const account = useWalletSession()
  const router = useRouter()

  useEffect(() => {
    if (account) {
      router.push(`/account/${account.account.address.toString()}`)
    }
  }, [account, router])

  if (account) {
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
