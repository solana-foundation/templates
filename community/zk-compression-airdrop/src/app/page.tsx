import { AirdropFeature } from '@/features/airdrop'
import { WalletInfo } from '@/components/wallet-info'
import config from '@scripts/compressed-mint-config.json'
import airdropData from '@scripts/airdrop-recipients.json'

export default function Home() {
  return (
    <main className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">ZK Compressed Token Airdrop</h1>
          <p className="text-muted-foreground">Distribute {config.symbol} tokens to recipients using ZK compression</p>
        </div>
        <WalletInfo />
      </div>

      <AirdropFeature config={config} airdropData={airdropData} />
    </main>
  )
}
