import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TIER_INFO } from '@/lib/config'
import type { TierType } from '@/lib/types'

export function TierCard({ tier }: { tier: TierType }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{TIER_INFO[tier].name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 justify-between h-full">
        <div>
          {TIER_INFO[tier].features.map((feature, index) => (
            <p key={index} className="flex flex-col gap-2">
              <span>{feature}</span>
            </p>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{TIER_INFO[tier].price}</p>
        <Link
          href={`/buy/${tier}`}
          className="bg-primary text-center text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 duration-300"
        >
          Buy Now
        </Link>
      </CardContent>
    </Card>
  )
}
