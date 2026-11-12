import React, { useState } from 'react'
import { Linking } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { ellipsify } from '@/utils/ellipsify'
import { useCluster } from '@/components/cluster/cluster-provider'
import { AppErrorSnackbar, useErrorSnackbar } from '@/components/app-error-snackbar'
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
  const { dismiss, message, showError } = useErrorSnackbar()
  const [isConnecting, setIsConnecting] = useState(false)

  // The wallet can decline or fail the authorization request. Catch it here so it
  // never surfaces as an unhandled rejection, and let the user know what happened.
  async function handleConnect() {
    if (isConnecting) {
      return
    }
    setIsConnecting(true)
    try {
      await connect()
      then?.()
    } catch (error) {
      showError('Could not connect wallet', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <>
      <BaseButton
        disabled={isConnecting}
        icon="wallet"
        label={isConnecting ? 'Connecting...' : label}
        onPress={() => void handleConnect()}
      />
      <AppErrorSnackbar message={message} onDismiss={dismiss} />
    </>
  )
}

export function WalletUiDisconnectButton({ label = 'Disconnect', then }: { label?: string; then?: () => void }) {
  const { disconnect } = useMobileWallet()
  const { dismiss, message, showError } = useErrorSnackbar()
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  async function handleDisconnect() {
    if (isDisconnecting) {
      return
    }
    setIsDisconnecting(true)
    try {
      await disconnect()
      then?.()
    } catch (error) {
      showError('Could not disconnect wallet', error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <>
      <BaseButton
        disabled={isDisconnecting}
        icon="wallet"
        label={isDisconnecting ? 'Disconnecting...' : label}
        onPress={() => void handleDisconnect()}
      />
      <AppErrorSnackbar message={message} onDismiss={dismiss} />
    </>
  )
}

export function WalletUiDropdown() {
  const { getExplorerUrl } = useCluster()
  const { account, disconnect } = useMobileWallet()
  const { dismiss, message, showError } = useErrorSnackbar()
  const [isOpen, setIsOpen] = useState(false)

  if (!account) {
    return <WalletUiConnectButton then={() => setIsOpen(false)} />
  }

  return (
    <>
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
        {/* Menu.Item takes a sync handler, so async work is caught rather than left to float. */}
        <Menu.Item
          onPress={() => {
            Linking.openURL(getExplorerUrl(`account/${account.address.toString()}`))
              .catch((error: unknown) => showError('Could not open explorer', error))
              .finally(() => setIsOpen(false))
          }}
          title="View in Explorer"
        />
        <Menu.Item
          onPress={() => {
            disconnect()
              .catch((error: unknown) => showError('Could not disconnect wallet', error))
              .finally(() => setIsOpen(false))
          }}
          title="Disconnect"
        />
      </Menu>
      <AppErrorSnackbar message={message} onDismiss={dismiss} />
    </>
  )
}
