import { AnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider } from '@anchor-lang/core'

export function useAnchorProvider() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
