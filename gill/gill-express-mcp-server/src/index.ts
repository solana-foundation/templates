import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { getMcpServerConfig } from './lib/get-mcp-config.js';
import { getMcpTools } from './lib/get-mcp-tools.js';

const { port, host, ...mcpConfig } = getMcpServerConfig();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: "*",
        allowedHeaders: ["Content-Type", "mcp-session-id"],
    })
);

async function createMcpServer() {
    const server = new McpServer(
        {
            name: mcpConfig.name,
            version: mcpConfig.version,
        },
        {
            capabilities: {},
        },
    );

    const tools = getMcpTools()

    for (const t of tools) {
        server.registerTool(
            t.name,
            // @ts-expect-error - Known type incompatibility with Zod schema definition
            t.config,
            async (args: unknown) => {
                const result = await t.callback(args);
                return {
                    content: result.content.map(item => ({
                        ...item,
                        type: "text" as const,
                        text: item.text ?? String(item.data ?? "")
                    }))

                };
            }
        );
    }

    return server;
}


app.post("/mcp", async (req: Request, res: Response) => {
    console.info('\n Received POST MCP request');

    try {
        const mcpServer = await createMcpServer();

        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
            enableDnsRebindingProtection: true,
            sessionIdGenerator: undefined,
        });

        res.on('close', () => {
            console.info('POST MCP request closed');
            transport.close();
            mcpServer.close();
        });

        await mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('\n Error handling POST MCP request:', String(error));
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

app.get('/mcp', async (req: Request, res: Response) => {
    console.info('\n Received GET MCP request');

    try {
        const mcpServer = await createMcpServer();

        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
            enableDnsRebindingProtection: true,
            sessionIdGenerator: undefined,
        });

        res.on('close', () => {
            console.info('GET MCP request closed');
            transport.close();
            mcpServer.close();
        });

        await mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('\n Error handling GET MCP request:', String(error));
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

app.delete('/mcp', async (req: Request, res: Response) => {
    console.info('\n Received DELETE MCP request');
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }));
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.listen(port, host, () => {
    console.info(`\n MCP Stateless Streamable HTTP listening on http://${host}:${port}`);
});