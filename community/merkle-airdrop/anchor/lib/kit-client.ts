import { createClient, extendClient, type Instruction, type TransactionSigner } from '@solana/kit'
import { solanaRpc, solanaRpcConnection } from '@solana/kit-plugin-rpc'

export type KitNetwork = 'devnet' | 'testnet' | 'mainnet'

export function getKitRpcUrl(network: string = 'devnet', rpcUrl?: string): string {
  const url =
    rpcUrl ||
    {
      devnet: process.env.DEVNET_RPC_URL || 'https://api.devnet.solana.com',
      testnet: process.env.TESTNET_RPC_URL || 'https://api.testnet.solana.com',
      mainnet: process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'mainnet-beta': process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com',
    }[network]
  if (!url) throw new Error(`Unsupported network: ${network}`)
  return url
}

export function createKitReadClient(network: string = 'devnet', rpcUrl?: string) {
  return createClient().use(solanaRpcConnection({ rpcUrl: getKitRpcUrl(network, rpcUrl) }))
}

export function createKitClient(payer: TransactionSigner, network: KitNetwork = 'devnet', rpcUrl?: string) {
  return createClient()
    .use((client) => extendClient(client, { payer }))
    .use(
      solanaRpc({
        rpcUrl: getKitRpcUrl(network, rpcUrl),
        rpcSubscriptionsUrl:
          network === 'devnet'
            ? process.env.DEVNET_RPC_WS_URL
            : network === 'testnet'
              ? process.env.TESTNET_RPC_WS_URL
              : process.env.MAINNET_RPC_WS_URL,
        transactionConfig: { version: 1 },
      }),
    )
}

export async function sendKitTransaction(
  client: ReturnType<typeof createKitClient>,
  instructions: readonly Instruction[],
) {
  const message = await client.planTransaction(instructions)
  const result = await client.sendTransaction(message)
  return result.context.signature
}
