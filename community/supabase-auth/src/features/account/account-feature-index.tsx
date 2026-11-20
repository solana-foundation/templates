'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react'
import { useSolana } from '@/components/provider'
import { WalletDropdown } from '@/components/wallet-dropdown'

export default function AccountFeatureIndex() {
  const { client } = useSolana()
  const account = useConnectedWallet(client)
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
