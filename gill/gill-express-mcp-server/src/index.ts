import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

import { getMcpConfig } from './lib/get-mcp-config.js'
import { getMcpContext } from './lib/get-mcp-context.js'
import { createMcpServer } from './lib/get-mcp-server.js'

const { port, host, solanaRpcUrl, ...mcpConfig } = getMcpConfig()
const context = await getMcpContext()

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'mcp-session-id'],
  }),
)

app.post('/mcp', async (req: Request, res: Response) => {
  context.log.info('Received POST MCP request\n')

  try {
    const mcpServer = await createMcpServer()

    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      enableDnsRebindingProtection: true,
      sessionIdGenerator: undefined,
    })

    res.on('close', () => {
      context.log.info('POST MCP request closed')
      transport.close()
      mcpServer.close()
    })

    await mcpServer.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    context.log.error('Error handling POST MCP request:', String(error))
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      })
    }
  }
})

app.get('/mcp', async (req: Request, res: Response) => {
  context.log.info('Received GET MCP request\n')

  try {
    const mcpServer = await createMcpServer()

    const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
      enableDnsRebindingProtection: true,
      sessionIdGenerator: undefined,
    })

    res.on('close', () => {
      context.log.info('GET MCP request closed')
      transport.close()
      mcpServer.close()
    })

    await mcpServer.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    context.log.error('Error handling GET MCP request:', String(error))
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      })
    }
  }
})

app.delete('/mcp', async (req: Request, res: Response) => {
  context.log.info('Received DELETE MCP request\n')
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    }),
  )
})

app.get('/health', (_req, res) => res.status(200).send('ok'))

app.listen(port, host, () => {
  context.log.info(`🤖 MCP Stateless Streamable HTTP listening on http://${host}:${port}`)
  context.log.info(`🤖 MCP Server Name: ${mcpConfig.name}`)
  context.log.info(`🤖 MCP Server Version: ${mcpConfig.version}`)
  context.log.info(`🤖 Endpoint: ${solanaRpcUrl}`)
  context.log.info(`🤖 Signer: ${context.signer.address}\n`)
})
