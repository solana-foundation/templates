import 'dotenv/config'
import { z } from 'zod'

const McpConfigSchema = z.object({
  host: z.string().ip(),
  port: z.coerce.number().int().positive(),
  name: z.string(),
  version: z.string().regex(/^(\d+)\.(\d+)\.(\d+)$/),
  privateKey: z.string().min(1, 'PRIVATE_KEY environment variable is required'),
  solanaRpcUrl: z.string().url(),
})

export type McpConfig = z.infer<typeof McpConfigSchema>

let config: McpConfig | undefined

export function getMcpConfig(): McpConfig {
  if (config) {
    return config
  }

  const privateKey = process.env.PRIVATE_KEY

  if (!privateKey || privateKey.trim() === '') {
    console.error('❌ ERROR: PRIVATE_KEY environment variable is not configured.\n')
    console.error('Please set PRIVATE_KEY in your .env file with a valid Base58 encoded private key.\n')
    console.error('Example: PRIVATE_KEY=your_base58_private_key_here\n')
    process.exit(1)
  }

  config = McpConfigSchema.parse({
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ?? 3000,
    name: process.env.NAME ?? 'gill-express-mcp-server',
    version: process.env.VERSION ?? '1.0.0',
    privateKey,
    solanaRpcUrl: process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
  })
  return config
}
