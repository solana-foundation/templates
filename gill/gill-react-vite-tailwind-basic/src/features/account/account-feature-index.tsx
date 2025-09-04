import { useSolana } from '@/components/solana/use-solana'
import { WalletButton } from '@/components/solana/solana-provider'
import { Navigate } from 'react-router'

export default function AccountFeatureIndex() {
  const { account } = useSolana()

  if (account) {
    return <Navigate to={`/account/${account.address.toString()}`} replace />
  }

  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <WalletButton />
      </div>
    </div>
  )
}
