import { Button, type ButtonRootProps } from 'heroui-native/button'
import { useToast } from 'heroui-native/toast'
import type { PropsWithChildren } from 'react'

import { formatError } from '@/features/wallet/util/format-error'

const WALLET_CONNECT_TOAST_ID = 'wallet-connect-error'

function getErrorCode(error: unknown) {
  if (error !== null && typeof error === 'object' && 'code' in error) {
    return String(error.code)
  }

  return ''
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (error !== null && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return typeof error === 'string' ? error : ''
}

function isWalletConnectionCanceled(error: unknown) {
  const code = getErrorCode(error)
  const message = getErrorMessage(error)

  return (
    code === 'ERROR_ASSOCIATION_CANCELLED' ||
    code === 'Session not established: Local association cancelled by user' ||
    message.includes('CancellationException') ||
    message.includes('Local association cancelled by user')
  )
}

export function WalletUiConnectButton({
  children = 'Connect Wallet',
  connect,
  size,
}: PropsWithChildren<{ connect: () => Promise<unknown>; size?: ButtonRootProps['size'] }>) {
  const { toast } = useToast()

  async function handleConnect() {
    try {
      toast.hide(WALLET_CONNECT_TOAST_ID)
      await connect()
    } catch (error) {
      const isCanceled = isWalletConnectionCanceled(error)

      toast.show({
        actionLabel: 'Try again',
        description: isCanceled
          ? 'The wallet connection request was dismissed before authorization completed.'
          : formatError(error),
        duration: 'persistent',
        id: WALLET_CONNECT_TOAST_ID,
        label: isCanceled ? 'Wallet connection canceled' : 'Could not connect wallet',
        onActionPress: ({ hide }) => {
          hide(WALLET_CONNECT_TOAST_ID)
          void handleConnect()
        },
        placement: 'bottom',
        variant: isCanceled ? 'warning' : 'danger',
      })
    }
  }

  return (
    <Button size={size} onPress={() => void handleConnect()}>
      {children}
    </Button>
  )
}
