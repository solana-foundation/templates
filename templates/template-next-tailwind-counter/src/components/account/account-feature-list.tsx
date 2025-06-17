import { redirect } from 'next/navigation'
import { useWalletUi } from '@wallet-ui/react'

import { WalletButton } from '../solana/solana-provider'

export default function AccountFeatureList() {
  const { account } = useWalletUi()

  if (account) {
    return redirect(`/account/${account.address.toString()}`)
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
