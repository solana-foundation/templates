import { createSolanaClient, KeyPairSigner, SolanaClient } from 'gill'
import { loadKeypairSignerFromFile } from 'gill/node'
import { ApiConfig, getApiConfig } from './get-api-config.js'

export interface ApiContext {
  client: SolanaClient
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

  context = { client, signer }

  return context
}
