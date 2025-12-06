import {
  createSolanaClient,
  createKeypairFromBase58,
  createSignerFromKeyPair,
  type SolanaClient,
  type KeyPairSigner,
} from 'gill'
import { type McpConfig, getMcpConfig } from './get-mcp-config.js'
import { log } from './mcp-logger.js'
import type { McpLogger } from './mcp-logger.js'

export interface ApiContext {
  client: SolanaClient
  log: McpLogger
  signer: KeyPairSigner
}

let context: ApiContext | undefined

export async function getMcpContext(): Promise<ApiContext> {
  if (context) {
    return context
  }

  const config: McpConfig = getMcpConfig()
  const client = createSolanaClient({ urlOrMoniker: config.solanaRpcUrl })

  const keyPair = await createKeypairFromBase58(config.privateKey)
  const signer = await createSignerFromKeyPair(keyPair)

  context = { client, log, signer }

  return context
}
