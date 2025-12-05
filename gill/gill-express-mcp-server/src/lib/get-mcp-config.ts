import 'dotenv/config'
import { z } from 'zod'

const McpConfigSchema = z.object({
    host: z.ipv4(),
    port: z.coerce.number().int().positive(),
    name: z.string(),
    version: z.string().regex(/^(\d+)\.(\d+)\.(\d+)$/),
    privateKey: z.string(),
    solanaRpcUrl: z.url()
})

export type McpConfig = z.infer<typeof McpConfigSchema>

let config: McpConfig | undefined

export function getMcpServerConfig(): McpConfig {
    if (config) {
        return config
    }
    config = McpConfigSchema.parse({
        host: process.env.HOST ?? '127.0.0.1',
        port: process.env.PORT ?? 3000,
        name: process.env.NAME ?? 'gill-express-mcp-server',
        version: process.env.VERSION ?? '1.0.0',
        privateKey: process.env.PRIVATE_KEY ?? '',
        solanaRpcUrl: process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
    })
    return config
}