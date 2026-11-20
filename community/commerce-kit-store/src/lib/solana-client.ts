import { createClient } from '@solana/kit'
import { solanaRpc } from '@solana/kit-plugin-rpc'
import { walletSigner } from '@solana/kit-plugin-wallet'
import { resolveWalletChain } from './solana-network'

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com'
const chain = resolveWalletChain(rpcUrl, process.env.NEXT_PUBLIC_SOLANA_CLUSTER)
const wsUrl = process.env.NEXT_PUBLIC_RPC_WS_URL || rpcUrl.replace(/^http/, 'ws')

export const client = createClient()
  .use(walletSigner({ chain }))
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl: wsUrl, transactionConfig: { version: 1 } }))

export type AppClient = typeof client
