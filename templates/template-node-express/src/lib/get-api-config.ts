import 'dotenv/config'
import { z } from 'zod'

const ApiConfigSchema = z.object({
  corsOrigins: z.array(z.string()),
  port: z.coerce.number().int().positive(),
  solanaRpcEndpoint: z.string(),
  solanaSignerPath: z.string(),
})

export type ApiConfig = z.infer<typeof ApiConfigSchema>

let config: ApiConfig | undefined

export function getApiConfig(): ApiConfig {
  if (config) {
    return config
  }
  config = ApiConfigSchema.parse({
    corsOrigins: process.env.CORS_ORIGINS?.split(',') ?? [],
    solanaRpcEndpoint: process.env.SOLANA_RPC_ENDPOINT ?? 'devnet',
    solanaSignerPath: process.env.SOLANA_SIGNER_PATH ?? '~/.config/solana/id.json',
    port: process.env.PORT ?? 3000,
  })
  return config
}
