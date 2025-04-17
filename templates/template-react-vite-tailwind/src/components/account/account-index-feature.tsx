import { WalletButton } from '../solana/solana-provider'

import { useWalletUi } from '@wallet-ui/react'
import { useNavigate } from 'react-router'

export default function AccountIndexFeature() {
  const navigate = useNavigate()
  const { account } = useWalletUi()

  if (account) {
    navigate(`/account/${account.address.toString()}`)
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
