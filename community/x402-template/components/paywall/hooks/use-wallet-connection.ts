import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletReadyState, WalletName } from '@solana/wallet-adapter-base'

type StatusType = 'success' | 'error' | 'info' | null

interface UseWalletConnectionReturn {
  isLoading: boolean
  buttonText: string
  handleConnect: () => Promise<void>
  showStatus: (message: string, type: StatusType) => void
  statusMessage: string
  statusType: StatusType
}

export function useWalletConnection(formattedAmount: string): UseWalletConnectionReturn {
  const { wallet, connect, select, publicKey } = useWallet()
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [statusType, setStatusType] = useState<StatusType>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Connect Phantom Wallet')

  const showStatus = (message: string, type: StatusType) => {
    setStatusMessage(message)
    setStatusType(type)
    if (type === 'error') {
      console.error(message)
    }
  }

  useEffect(() => {
    if (!wallet && select) {
      const selectPhantom = () => {
        try {
          select('Phantom' as WalletName)
        } catch {}
      }
      const timer = setTimeout(selectPhantom, 300)
      return () => clearTimeout(timer)
    }
  }, [wallet, select])

  useEffect(() => {
    const tryAutoConnect = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (!wallet || publicKey) {
        return
      }

      const readyState = wallet.adapter.readyState

      if (readyState === WalletReadyState.Installed || readyState === WalletReadyState.Loadable) {
        try {
          await connect()
        } catch {}
      }
    }
    tryAutoConnect()
  }, [wallet, publicKey, connect])

  // Update button text based on connection status
  useEffect(() => {
    if (publicKey) {
      setButtonText(`Pay $${formattedAmount} USDC`)
    } else {
      setButtonText('Connect Phantom Wallet')
    }
  }, [publicKey, formattedAmount])

  const handleConnect = async () => {
    if (!wallet && select) {
      try {
        select('Phantom' as WalletName)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch {}
    }

    if (!wallet) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      if (!wallet) {
        showStatus('Wallet adapter not initialized. Please refresh the page.', 'error')
        return
      }
    }

    const readyState = wallet.adapter.readyState

    if (readyState === WalletReadyState.NotDetected) {
      showStatus('Phantom wallet not detected. Please install Phantom browser extension.', 'error')
      return
    }

    if (readyState !== WalletReadyState.Installed && readyState !== WalletReadyState.Loadable) {
      showStatus(`Phantom wallet not ready (state: ${readyState}). Please check your wallet.`, 'error')
      return
    }

    try {
      showStatus('Connecting to Phantom...', 'info')
      setIsLoading(true)
      await connect()
      setButtonText(`Pay $${formattedAmount} USDC`)
      showStatus('Wallet connected successfully!', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      if (message.includes('User rejected') || message.includes('cancelled')) {
        showStatus('Connection cancelled by user.', 'error')
      } else {
        showStatus(`Failed to connect wallet: ${message}`, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    buttonText,
    handleConnect,
    showStatus,
    statusMessage,
    statusType,
  }
}
