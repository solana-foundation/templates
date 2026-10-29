import { Card } from 'heroui-native/card'

export function WalletUiStatusCard({
  description,
  title,
  tone = 'default',
}: {
  description: string
  title: string
  tone?: 'danger' | 'default'
}) {
  const isDanger = tone === 'danger'

  return (
    <Card className={isDanger ? 'border border-red-900 bg-red-950/60' : 'border border-zinc-800 bg-zinc-900'}>
      <Card.Body className="gap-1">
        <Card.Title className={isDanger ? 'text-red-100' : 'text-white'}>{title}</Card.Title>
        <Card.Description className={isDanger ? 'text-red-200' : undefined}>{description}</Card.Description>
      </Card.Body>
    </Card>
  )
}
