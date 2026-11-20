import { createClient } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import { walletSigner } from '@solana/kit-plugin-wallet'
import { AIRDROP_CONFIG } from './config'

export const cluster = AIRDROP_CONFIG.NETWORK === 'mainnet' ? 'mainnet-beta' : AIRDROP_CONFIG.NETWORK
export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || `https://api.${cluster}.solana.com`
export const client = createClient()
  .use(walletSigner({ chain: `solana:${AIRDROP_CONFIG.NETWORK}` }))
  .use(
    solanaRpc({
      rpcUrl,
      rpcSubscriptionsUrl: process.env.NEXT_PUBLIC_RPC_WS_URL || rpcUrl.replace(/^http/, 'ws'),
      transactionConfig: { version: 1 },
    }),
  )

export type AppClient = typeof client
