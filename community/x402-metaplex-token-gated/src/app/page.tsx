import { TierCard } from '@/components/tier-card'
import { Separator } from '@radix-ui/react-dropdown-menu'

export default function Home() {
  return (
    <div className="flex flex-col items-center my-12 gap-10 max-w-7xl mx-auto">
      <div className="flex w-full items-center gap-6">
        <h1 className="text-6xl uppercase font-bold max-w-xl">Token Gated Membership App</h1>
        <div className="max-w-2xl space-y-3">
          <p className="text-muted-foreground text-lg">
            An educational Next.js template demonstrating NFT-based access control on Solana. Purchase a membership tier
            to receive a Metaplex Core NFT that grants time-limited access to exclusive content.
          </p>
          <p className="text-muted-foreground text-sm">
            Features wallet authentication via message signing, automatic expiration tracking, membership renewals, and
            seamless payment integration. Built with Next.js 15, TypeScript, and the Wallet Standard.
          </p>
        </div>
      </div>

      <Separator className="w-full h-px bg-gray-200/10" />

      <div className="flex mx-auto flex-col md:flex-row gap-4 w-full md:justify-between">
        <TierCard tier="bronze" />
        <TierCard tier="silver" />
        <TierCard tier="gold" />
      </div>
    </div>
  )
}
