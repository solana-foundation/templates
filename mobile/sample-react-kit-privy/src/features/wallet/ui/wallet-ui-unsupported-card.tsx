import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Stands in for a card whose wallet feature is missing.
 *
 * Named rather than hidden, for the same reason unsupported networks are disabled rather than
 * dropped: on a page whose job is to exercise every wallet feature, "this wallet cannot do it" is a
 * result, and a card that quietly disappears looks like the app forgot to render it.
 */
export function WalletUiUnsupportedCard({
  feature,
  title,
  walletName,
}: {
  feature: string
  title: string
  walletName: string
}) {
  return (
    <Card className="opacity-70">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {walletName} does not advertise <code className="font-mono text-xs">{feature}</code>.
        </CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  )
}
