import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTokenAmount } from '@/features/airdrop/data-access/airdrop-utils'
import type { AirdropConfig, AirdropData } from '@/features/airdrop/data-access/airdrop-types'

interface AirdropStatsProps {
  config: AirdropConfig
  airdropData: AirdropData
}

export function AirdropStats({ config, airdropData }: AirdropStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Token</CardDescription>
          <CardTitle>{config.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{config.name}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Recipients</CardDescription>
          <CardTitle>{airdropData.totalRecipients.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Addresses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Total Amount</CardDescription>
          <CardTitle>{formatTokenAmount(airdropData.totalAmount, config.decimals)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{config.symbol}</p>
        </CardContent>
      </Card>
    </div>
  )
}
