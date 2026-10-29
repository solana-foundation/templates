import Ionicons from '@expo/vector-icons/Ionicons'
import { Account } from '@wallet-ui/react-native-kit'
import { Card } from 'heroui-native/card'
import { Chip } from 'heroui-native/chip'
import { useToast } from 'heroui-native/toast'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { useGetPrimarySkrDomain } from '@/features/wallet/data-access/use-get-primary-skr-domain'
import { useHasSeekerGenesisToken } from '@/features/wallet/data-access/use-has-seeker-genesis-token'
import { ellipsify } from '@/features/wallet/util/ellipsify'
import { formatError } from '@/features/wallet/util/format-error'

const WALLET_DISCONNECT_TOAST_ID = 'wallet-disconnect-error'

export function WalletFeatureAccount({ account, disconnect }: { account: Account; disconnect: () => Promise<void> }) {
  const label = account.label ?? 'Mobile wallet'
  const { tintColor } = useTheme()
  const { toast } = useToast()
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const { data: skrDomain } = useGetPrimarySkrDomain(account.address)
  const { data: isSeekerVerified } = useHasSeekerGenesisToken(account.address)

  async function handleDisconnect() {
    if (isDisconnecting) {
      return
    }

    setIsDisconnecting(true)
    try {
      toast.hide(WALLET_DISCONNECT_TOAST_ID)
      await disconnect()
    } catch (error) {
      toast.show({
        description: formatError(error),
        id: WALLET_DISCONNECT_TOAST_ID,
        label: 'Could not disconnect wallet',
        placement: 'bottom',
        variant: 'danger',
      })
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <Card className="gap-2 p-5">
      <View className="flex-row items-center gap-2">
        <Ionicons color={tintColor} name="wallet-outline" size={22} />
        <Card.Title className="flex-1 text-xl font-bold">{label}</Card.Title>
        <Pressable
          accessibilityLabel="Disconnect wallet"
          accessibilityRole="button"
          className="items-center justify-center rounded-full"
          disabled={isDisconnecting}
          onPress={() => void handleDisconnect()}
        >
          <Ionicons color={tintColor} name="power" size={18} />
        </Pressable>
      </View>
      <Card.Description className="leading-relaxed">
        {skrDomain ? `${skrDomain} · ${ellipsify(account.address)}` : ellipsify(account.address)}
      </Card.Description>
      {isSeekerVerified ? (
        <Chip className="self-start" color="success" size="sm" variant="soft">
          Seeker verified
        </Chip>
      ) : null}
    </Card>
  )
}
