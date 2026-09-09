import { AirdropFeature } from '@/features/airdrop'
import { WalletInfo } from '@/components/wallet-info'
import type { AirdropConfig, AirdropData } from '@/features/airdrop/data-access/airdrop-types'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

function loadAirdropSetup(): { config: AirdropConfig; airdropData: AirdropData } | null {
  const scriptsDirectory = path.join(process.cwd(), 'scripts')
  const setupPath = path.join(scriptsDirectory, 'airdrop-setup.json')

  if (!existsSync(setupPath)) {
    return null
  }

  try {
    const setup = JSON.parse(readFileSync(setupPath, 'utf-8')) as {
      config: AirdropConfig
      airdropData: AirdropData
    }

    if (setup.config.mintAddress !== setup.airdropData.mint || setup.config.decimals !== setup.airdropData.decimals) {
      return null
    }

    return setup
  } catch (error) {
    console.error('Failed to load generated airdrop setup:', error)
    return null
  }
}

export const dynamic = 'force-dynamic'

export default function Home() {
  const setup = loadAirdropSetup()

  return (
    <main className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">ZK Compressed Token Airdrop</h1>
          <p className="text-muted-foreground">
            {setup
              ? `Distribute ${setup.config.symbol} tokens to recipients using ZK compression`
              : 'Configure a compressed mint and recipient list to begin.'}
          </p>
        </div>
        <WalletInfo />
      </div>

      {setup ? (
        <AirdropFeature config={setup.config} airdropData={setup.airdropData} />
      ) : (
        <section className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Setup required</h2>
          <p className="mt-2 text-muted-foreground">
            Run <code className="font-mono">npm run airdrop:setup</code>, then restart the app.
          </p>
        </section>
      )}
    </main>
  )
}
