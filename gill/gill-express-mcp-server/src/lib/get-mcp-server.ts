import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { getMcpConfig } from './get-mcp-config.js'
import { getMcpTools } from './get-mcp-tools.js'
import { getMcpContext } from './get-mcp-context.js'

const mcpConfig = getMcpConfig()
const context = await getMcpContext()

export async function createMcpServer() {
  const server = new McpServer(
    {
      name: mcpConfig.name,
      version: mcpConfig.version,
    },
    {
      capabilities: {},
    },
  )

  const tools = getMcpTools()

  for (const t of tools) {
    server.registerTool(
      t.name,
      // @ts-expect-error ts(2345)
      t.config,
      // @ts-expect-error ts(7006)
      async (args) => {
        try {
          const result = await t.callback(args)
          return {
            content: result.content.map((item) => ({
              ...item,
              type: 'text' as const,
              text: item.text ?? String(item.data ?? ''),
            })),
          }
        } catch (err) {
          context.log.error(`Error executing tool ${t.name}:`, err)
          throw err
        }
      },
    )
  }

  return server
}
