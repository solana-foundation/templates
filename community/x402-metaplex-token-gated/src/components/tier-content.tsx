import type { TierType, TierConfig } from '@/lib/types'

function TierPageContent({ tier, tierConfig }: { tier: TierType; tierConfig: TierConfig }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Mint {tierConfig.name}</h1>
        <p className="text-muted-foreground mb-8">
          Get {tierConfig.duration} days of exclusive access for {tierConfig.price}
        </p>

        <a
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 duration-300"
          href={`/mint/${tier}`}
        >
          Mint your membership NFT
        </a>
      </div>
    </div>
  )
}

export { TierPageContent }
