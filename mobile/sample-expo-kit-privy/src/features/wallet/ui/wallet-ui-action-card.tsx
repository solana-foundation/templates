import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

export function WalletUiActionCard({
  actionLabel,
  description,
  error,
  isDisabled,
  onAction,
  result,
  title,
  variant = 'primary',
}: {
  actionLabel: string
  description: string
  error?: string | null
  isDisabled?: boolean
  onAction: () => void | Promise<void>
  result?: string | null
  title: string
  variant?: 'danger' | 'primary' | 'secondary'
}) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900">
      <Card.Body className="gap-4">
        <View className="gap-1">
          <Card.Title className="text-white">{title}</Card.Title>
          <Card.Description>{description}</Card.Description>
        </View>

        {result ? (
          <Text className="rounded-lg bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200">{result}</Text>
        ) : null}

        {error ? <Text className="rounded-lg bg-red-900/70 px-3 py-2 text-sm text-red-200">{error}</Text> : null}
      </Card.Body>
      <Card.Footer className="pt-2">
        <Button className="w-full" isDisabled={isDisabled} onPress={onAction} variant={variant}>
          {actionLabel}
        </Button>
      </Card.Footer>
    </Card>
  )
}
