import { ClaimButton } from '@/components/claim-button'
import { WalletButton } from '@/components/solana/solana-provider'

export default function Home() {
  return (
    <>
      <WalletButton size="sm" />
      <ClaimButton />
    </>
  )
}
