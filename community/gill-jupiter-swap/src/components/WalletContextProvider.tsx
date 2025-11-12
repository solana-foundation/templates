'use client'

import React, { useMemo, useCallback, createContext, useContext } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'
import { useErrorToast } from './ErrorToast'

interface WalletContextProviderProps {
  children: React.ReactNode
}

// Create a context for the error toast
const ErrorToastContext = createContext<((message: string) => void) | null>(null)

export const useWalletError = () => {
  const context = useContext(ErrorToastContext)
  if (!context) {
    throw new Error('useWalletError must be used within WalletContextProvider')
  }
  return context
}

const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet
  const { showError, ToastContainer } = useErrorToast()

  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    return rpcUrl || clusterApiUrl(network)
  }, [network])

  // Specify only the main Solana wallets to avoid auto-detection duplicates
  // The modal will still show other installed wallets (Backpack, MetaMask, etc.) automatically
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  // Error handler for wallet connection/validation errors
  const onError = useCallback(
    (error: WalletError) => {
      console.error('Wallet error:', error)

      // Categorize and display appropriate error messages
      let errorMessage = 'Wallet error occurred'

      if (error.name === 'WalletNotFoundError') {
        errorMessage = 'Wallet not found. Please install a Solana wallet extension.'
      } else if (error.name === 'WalletConnectionError') {
        errorMessage = 'Failed to connect to wallet. Please try again.'
      } else if (error.name === 'WalletDisconnectedError') {
        errorMessage = 'Wallet disconnected unexpectedly.'
      } else if (error.name === 'WalletNotReadyError') {
        errorMessage = 'Wallet is not ready. Please refresh and try again.'
      } else if (error.name === 'WalletPublicKeyError') {
        errorMessage = 'Unable to retrieve wallet public key. Invalid wallet state.'
      } else if (error.name === 'WalletSignTransactionError') {
        errorMessage = 'Transaction signing failed or was rejected.'
      } else if (error.message) {
        errorMessage = error.message
      }

      // Display error using toast notification
      showError(errorMessage)
    },
    [showError],
  )

  return (
    <ErrorToastContext.Provider value={showError}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false} onError={onError}>
          <WalletModalProvider>
            {children}
            <ToastContainer />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorToastContext.Provider>
  )
}

export default WalletContextProvider
