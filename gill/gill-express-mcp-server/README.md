# gill-express-mcp-server

Express-based MCP (Model Context Protocol) server template for Solana development using the [Gill SDK](https://github.com/solana-foundation/gill), based on [@solana/kit](https://github.com/anza-xyz/kit).

This template provides a streamable HTTP server that exposes Solana operations as MCP tools, enabling AI assistants and applications to interact with the Solana blockchain.

## Features

- 🚀 Express.js HTTP server with MCP protocol support
- 🔗 Streamable HTTP transport for MCP communication
- 🔑 Keypair management and signing capabilities
- 💰 Balance queries and blockchain interactions
- 🛠️ TypeScript with strict type checking
- 🐳 Docker support for containerized deployment
- 🎨 Prettier and ESLint for code quality

## Available MCP Tools

- `create_keypair` - Generate a new Solana keypair
- `get_sol_balance` - Retrieve SOL balance for any public key
- `get_signer_address` - Get the server's signer address
- `get_signer_sol_balance` - Get the server's signer SOL balance
- `get_slot` - Get the current slot number
- `get_latest_blockhash` - Get the latest blockhash
- `sign_message` - Sign a message using the server's private key

## Getting Started

### Prerequisites

- Node.js 22 or higher
- pnpm 10.14.0 or higher

### Installation

Clone the repository:

```shell
git clone https://github.com/solana-foundation/templates
cd templates/gill/gill-express-mcp-server
```

Install dependencies:

```shell
pnpm install
```

### Configuration

Set up your environment file:

```shell
pnpm run setup-env
```

Edit the `.env` file and add your configuration:

```env
PORT=3000
HOST=0.0.0.0

NAME=gill-express-mcp-server
VERSION=1.0.0

PRIVATE_KEY=your_base58_private_key_here
SOLANA_RPC_URL=https://api.devnet.solana.com
```

> ⚠️ **Important**: Never commit your `.env` file or expose your private key!

### Development

Start the development server with hot reload:

```shell
pnpm run dev
```

The server will be available at `http://localhost:3000` (or your configured port).

### Production

Build the project:

```shell
pnpm run build
```

Start the production server:

```shell
pnpm start
```

## Docker

### Build the Docker image

```shell
pnpm run docker:build
```

### Run the Docker container

```shell
pnpm run docker:run
```

The containerized server will be accessible at `http://localhost:3000`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `0.0.0.0` |
| `NAME` | MCP server name | `gill-express-mcp-server` |
| `VERSION` | MCP server version | `1.0.0` |
| `PRIVATE_KEY` | Base58 encoded private key (required) | - |
| `SOLANA_RPC_URL` | Solana RPC endpoint URL | `https://api.devnet.solana.com` |

## API Endpoints

### MCP Endpoints

- `POST /mcp` - Main MCP protocol endpoint
- `GET /mcp` - MCP protocol GET endpoint

### Health Check

- `GET /health` - Server health check endpoint

## Project Structure

```
.
├── src/
│   ├── index.ts              # Express server setup
│   └── lib/
│       ├── get-mcp-config.ts # Configuration management
│       ├── get-mcp-context.ts # Solana client context
│       ├── get-mcp-server.ts # MCP server initialization
│       ├── get-mcp-tools.ts  # MCP tool definitions
│       └── mcp-logger.ts     # Logging utilities
├── .env.example              # Environment template
├── Dockerfile                # Docker configuration
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

## Using with MCP Clients

Configure your MCP client (like Claude Desktop) to connect to this server:

```json
{
  "mcpServers": {
    "gill-solana": {
      "url": "http://localhost:3000/mcp",
      "type": "streamable-http"
    }
  }
}
```

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with watch mode |
| `pnpm build` | Build the project |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm fmt` | Format code with Prettier |
| `pnpm fmt:check` | Check code formatting |
| `pnpm setup-env` | Copy `.env.example` to `.env` |

## Security Considerations

- Store your private key securely and never commit it to version control
- Use environment variables for sensitive configuration
- Consider using a key management service in production
- Implement proper authentication and authorization for production deployments
- Use HTTPS in production environments

## License

MIT License - see [LICENSE.md](LICENSE.md) for details

## Resources

- [Gill SDK Documentation](https://github.com/solana-foundation/gill)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Solana Documentation](https://docs.solana.com/)
- [Express.js Documentation](https://expressjs.com/)
