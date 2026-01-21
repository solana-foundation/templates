import React, { useState } from 'react'
import { Linking } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { ellipsify } from '@/utils/ellipsify'
import { useCluster } from '@/components/cluster/cluster-provider'
import { Button, ButtonProps, Menu } from 'react-native-paper'

function BaseButton({
  icon,
  label,
  onPress,
  ...props
}: Omit<ButtonProps, 'children'> & {
  label: string
  onPress: () => void
}) {
  return (
    <Button mode="contained-tonal" icon={icon} onPress={onPress} {...props}>
      {label}
    </Button>
  )
}

export function WalletUiConnectButton({ label = 'Connect', then }: { label?: string; then?: () => void }) {
  const { connect } = useMobileWallet()

  return <BaseButton icon="wallet" label={label} onPress={() => connect().then(() => then?.())} />
}

export function WalletUiDisconnectButton({ label = 'Disconnect', then }: { label?: string; then?: () => void }) {
  const { disconnect } = useMobileWallet()

  return <BaseButton icon="wallet" label={label} onPress={() => disconnect().then(() => then?.())} />
}

export function WalletUiDropdown() {
  const { getExplorerUrl } = useCluster()
  const { account, disconnect } = useMobileWallet()
  const [isOpen, setIsOpen] = useState(false)

  if (!account) {
    return <WalletUiConnectButton then={() => setIsOpen(false)} />
  }

  return (
    <Menu
      mode="elevated"
      visible={isOpen}
      onDismiss={() => setIsOpen(false)}
      anchor={
        <BaseButton
          label={account ? ellipsify(account.address.toString()) : 'Connect'}
          icon="wallet"
          onPress={() => setIsOpen(true)}
        />
      }
      style={{
        paddingTop: 48,
      }}
    >
      <Menu.Item
        onPress={() => {
          Clipboard.setString(account.address.toString())
          setIsOpen(false)
        }}
        title="Copy Address"
      />
      <Menu.Item
        onPress={async () => {
          await Linking.openURL(getExplorerUrl(`account/${account.address.toString()}`))
          setIsOpen(false)
        }}
        title="View in Explorer"
      />
      <Menu.Item
        onPress={async () => {
          await disconnect()
          setIsOpen(false)
        }}
        title="Disconnect"
      />
    </Menu>
  )
}
