import { Card } from 'heroui-native/card'
import { Text, View } from 'react-native'

function ellipsify(value: string) {
  if (value.length <= 18) {
    return value
  }

  return `${value.slice(0, 8)}...${value.slice(-8)}`
}

export function WalletUiAccountCard({
  address,
  label,
  privyUserId,
}: {
  address: string
  label?: string
  privyUserId: string | null
}) {
  return (
    <Card className="border border-zinc-800 bg-zinc-900">
      <Card.Body className="gap-4">
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1 gap-1">
            <Card.Description>Connected wallet</Card.Description>
            <Card.Title className="text-white">{label ?? 'Mobile wallet'}</Card.Title>
          </View>
          <View className="rounded-full bg-emerald-400/10 px-3 py-1">
            <Text className="text-xs font-bold text-emerald-300">Connected</Text>
          </View>
        </View>

        <View className="gap-3">
          <View className="gap-1">
            <Text className="text-xs uppercase text-zinc-500">Address</Text>
            <Text className="font-mono text-sm text-zinc-200">{ellipsify(address)}</Text>
          </View>
          <View className="gap-1">
            <Text className="text-xs uppercase text-zinc-500">Privy user</Text>
            <Text className="font-mono text-sm text-zinc-200">
              {privyUserId ? ellipsify(privyUserId) : 'Not signed in'}
            </Text>
          </View>
        </View>
      </Card.Body>
    </Card>
  )
}
