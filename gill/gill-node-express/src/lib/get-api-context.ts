import { createSolanaClient, KeyPairSigner, SolanaClient } from 'gill'
import { loadKeypairSignerFromFile } from 'gill/node'
import { ApiConfig, getApiConfig } from './get-api-config.js'
import { ApiLogger, log } from './api-logger.js'

export interface ApiContext {
  client: SolanaClient
  log: ApiLogger
  signer: KeyPairSigner
}

let context: ApiContext | undefined

export async function getApiContext(): Promise<ApiContext> {
  if (context) {
    return context
  }

  const config: ApiConfig = getApiConfig()
  const client = createSolanaClient({ urlOrMoniker: config.solanaRpcEndpoint })
  const signer = await loadKeypairSignerFromFile(config.solanaSignerPath)

  context = { client, log, signer }

  return context
}
