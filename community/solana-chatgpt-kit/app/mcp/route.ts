import { baseURL } from '@/baseUrl'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`)
  return await result.text()
}

type ContentWidget = {
  id: string
  title: string
  templateUri: string
  invoking: string
  invoked: string
  html: string
  description: string
  widgetDomain: string
}

function widgetMeta(widget: ContentWidget) {
  return {
    'openai/outputTemplate': widget.templateUri,
    'openai/toolInvocation/invoking': widget.invoking,
    'openai/toolInvocation/invoked': widget.invoked,
    'openai/widgetAccessible': false,
    'openai/resultCanProduceWidget': true,
  } as const
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, '/')
  const swapHtml = await getAppsSdkCompatibleHtml(baseURL, '/swap')
  const transferHtml = await getAppsSdkCompatibleHtml(baseURL, '/transfer')
  const stakeHtml = await getAppsSdkCompatibleHtml(baseURL, '/stake')

  const contentWidget: ContentWidget = {
    id: 'show_content',
    title: 'Show Content',
    templateUri: 'ui://widget/content-template.html',
    invoking: 'Loading content...',
    invoked: 'Content loaded',
    html: html,
    description: 'Displays the homepage content',
    widgetDomain: 'https://nextjs.org/docs',
  }

  const swapWidget: ContentWidget = {
    id: 'jupiter_swap',
    title: 'Jupiter Swap',
    templateUri: 'ui://widget/swap-template.html',
    invoking: 'Loading swap interface...',
    invoked: 'Swap interface ready',
    html: swapHtml,
    description: 'Swap tokens on Solana using Jupiter',
    widgetDomain: 'https://jup.ag',
  }

  const transferWidget: ContentWidget = {
    id: 'send_sol',
    title: 'Send SOL',
    templateUri: 'ui://widget/transfer-template.html',
    invoking: 'Preparing transfer interface...',
    invoked: 'Transfer interface ready',
    html: transferHtml,
    description: 'Send SOL to a wallet address with explicit confirmation',
    widgetDomain: 'https://solana.com',
  }

  const stakeWidget: ContentWidget = {
    id: 'stake_sol',
    title: 'Stake SOL (Jupiter)',
    templateUri: 'ui://widget/stake-template.html',
    invoking: 'Loading staking interface...',
    invoked: 'Staking interface ready',
    html: stakeHtml,
    description: 'Stake SOL into an LST (e.g., JupSOL) via Jupiter swap.',
    widgetDomain: 'https://jup.ag',
  }

  // Register content widget
  server.registerResource(
    'content-widget',
    contentWidget.templateUri,
    {
      title: contentWidget.title,
      description: contentWidget.description,
      mimeType: 'text/html+skybridge',
      _meta: {
        'openai/widgetDescription': contentWidget.description,
        'openai/widgetPrefersBorder': true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/html+skybridge',
          text: `<html>${contentWidget.html}</html>`,
          _meta: {
            'openai/widgetDescription': contentWidget.description,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDomain': contentWidget.widgetDomain,
          },
        },
      ],
    }),
  )

  // Register swap widget
  server.registerResource(
    'swap-widget',
    swapWidget.templateUri,
    {
      title: swapWidget.title,
      description: swapWidget.description,
      mimeType: 'text/html+skybridge',
      _meta: {
        'openai/widgetDescription': swapWidget.description,
        'openai/widgetPrefersBorder': true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/html+skybridge',
          text: `<html>${swapWidget.html}</html>`,
          _meta: {
            'openai/widgetDescription': swapWidget.description,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDomain': swapWidget.widgetDomain,
          },
        },
      ],
    }),
  )

  // Reuse swap UI for staking (pre-configured SOL -> JupSOL)
  server.registerResource(
    'stake-widget',
    stakeWidget.templateUri,
    {
      title: stakeWidget.title,
      description: stakeWidget.description,
      mimeType: 'text/html+skybridge',
      _meta: {
        'openai/widgetDescription': stakeWidget.description,
        'openai/widgetPrefersBorder': true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/html+skybridge',
          text: `<html>${stakeWidget.html}</html>`,
          _meta: {
            'openai/widgetDescription': stakeWidget.description,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDomain': stakeWidget.widgetDomain,
          },
        },
      ],
    }),
  )

  // Register transfer widget
  server.registerResource(
    'transfer-widget',
    transferWidget.templateUri,
    {
      title: transferWidget.title,
      description: transferWidget.description,
      mimeType: 'text/html+skybridge',
      _meta: {
        'openai/widgetDescription': transferWidget.description,
        'openai/widgetPrefersBorder': true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/html+skybridge',
          text: `<html>${transferWidget.html}</html>`,
          _meta: {
            'openai/widgetDescription': transferWidget.description,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDomain': transferWidget.widgetDomain,
          },
        },
      ],
    }),
  )

  server.registerTool(
    contentWidget.id,
    {
      title: contentWidget.title,
      description: 'Fetch and display the homepage content with the name of the user',
      inputSchema: {
        name: z.string().describe('The name of the user to display on the homepage'),
      },
      _meta: widgetMeta(contentWidget),
    },
    async ({ name }) => {
      return {
        content: [
          {
            type: 'text',
            text: name,
          },
        ],
        structuredContent: {
          name: name,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(contentWidget),
      }
    },
  )

  server.registerTool(
    swapWidget.id,
    {
      title: swapWidget.title,
      description:
        "Swap tokens on Solana with Jupiter. Accepts tickers or mints (e.g., '0.001 SOL to $SEND') or free-form text.",
      inputSchema: {
        amount: z.string().describe("The amount to swap (e.g., '0.001')").optional(),
        inputToken: z.string().describe('Input token ticker (e.g., SOL) or mint address').optional(),
        outputToken: z.string().describe('Output token ticker (e.g., $SEND) or mint address').optional(),
        text: z.string().describe("Free-form request, e.g., 'swap 0.001 SOL to $SEND'").optional(),
      },
      _meta: widgetMeta(swapWidget),
    },
    async ({ amount, inputToken, outputToken, text }) => {
      // Parse free-form if provided
      if (text && (!amount || !inputToken || !outputToken)) {
        const s = String(text)
        const amountMatch = s.match(/\b(\d+\.\d+|\d+)\b/)
        const toMatch = s.match(/to\s+([$]?[a-z0-9]+|[1-9A-HJ-NP-Za-km-z]{32,44})/i)
        const fromMatch = s.match(/swap\s+(\d+\.\d+|\d+)\s+([$]?[a-z0-9]+|[1-9A-HJ-NP-Za-km-z]{32,44}|SOL)/i)
        amount = amount || (amountMatch ? amountMatch[1] : undefined)
        inputToken = inputToken || (fromMatch ? String(fromMatch[2]) : undefined)
        outputToken = outputToken || (toMatch ? String(toMatch[1]) : undefined)
      }

      const finalAmount: string = (amount as string) || '0.001'
      const finalInput: string = (inputToken as string) || 'SOL'
      const finalOutput: string = (outputToken as string) || 'USDC'
      return {
        content: [
          {
            type: 'text',
            text: `Preparing to swap ${finalAmount} ${finalInput} to ${finalOutput}`,
          },
        ],
        structuredContent: {
          initialAmount: finalAmount,
          inputToken: finalInput,
          outputToken: finalOutput,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(swapWidget),
      }
    },
  )

  // Free-form swap parser tool
  server.registerTool(
    'swap_freeform',
    {
      title: 'Swap (free-form)',
      description: "Parse a message like 'swap 0.0001 SOL to $SEND' and prefill the swap widget.",
      inputSchema: {
        text: z.string().describe("Free-form user request, e.g., 'swap 0.001 SOL to $SEND'"),
      },
      _meta: widgetMeta(swapWidget),
    },
    async ({ text }) => {
      const s = String(text || '')
      const amountMatch = s.match(/\b(\d+\.\d+|\d+)\b/)
      const toMatch = s.match(/to\s+([$]?[a-z0-9]+|[1-9A-HJ-NP-Za-km-z]{32,44})/i)
      const fromMatch = s.match(/swap\s+(\d+\.\d+|\d+)\s+([$]?[a-z0-9]+|SOL)/i)

      const amount = amountMatch ? amountMatch[1] : '0.001'
      const inputToken = fromMatch ? String(fromMatch[2] || 'SOL') : 'SOL'
      const outputToken = toMatch ? String(toMatch[1]) : 'USDC'

      return {
        content: [{ type: 'text', text: `Preparing to swap ${amount} ${inputToken} to ${outputToken}` }],
        structuredContent: {
          initialAmount: amount,
          inputToken,
          outputToken,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(swapWidget),
      }
    },
  )

  // Send SOL tool (renders a confirmation widget)
  server.registerTool(
    transferWidget.id,
    {
      title: transferWidget.title,
      description: 'Send SOL to a wallet address or SNS domain (.sol, .solana, .superteam) with explicit confirmation.',
      inputSchema: {
        toAddress: z.string().describe('Destination (address or SNS domain like arpit.sol)'),
        amount: z.string().describe("Amount of SOL to send (e.g., '0.001')"),
      },
      _meta: widgetMeta(transferWidget),
    },
    async ({ toAddress, amount }) => {
      return {
        content: [
          {
            type: 'text',
            text: `Prepare to send ${amount} SOL to ${toAddress}`,
          },
        ],
        structuredContent: {
          toAddress,
          amount,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(transferWidget),
      }
    },
  )

  // Check balance tool
  server.registerTool(
    'check_balance',
    {
      title: 'Check Balance',
      description: 'Fetch SOL balance for a wallet address or domain (.sol, AllDomains TLDs).',
      inputSchema: {
        account: z.string().describe('Address or domain (e.g., arpit.superteam or 26k...QjC)'),
      },
      _meta: {
        'openai/resultCanProduceWidget': false,
      },
    },
    async ({ account }) => {
      const res = await fetch(`${baseURL}/api/wallet/balance?account=${encodeURIComponent(account)}`)
      const data = await res.json()
      if (!res.ok) {
        return {
          content: [{ type: 'text', text: `Error: ${data?.error || 'Failed to fetch balance'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: `Balance: ${data.sol} SOL (address: ${data.resolvedAddress})` }],
        structuredContent: {
          account,
          resolvedAddress: data.resolvedAddress,
          sol: data.sol,
          lamports: data.lamports,
          timestamp: data.timestamp,
        },
      }
    },
  )

  // Token price tool
  server.registerTool(
    'token_price',
    {
      title: 'Token Price',
      description: 'Fetch token price via Jupiter by mint address only (contract).',
      inputSchema: {
        id: z.string().describe('Mint address (contract) of the token'),
      },
      _meta: {
        'openai/resultCanProduceWidget': false,
      },
    },
    async ({ id }) => {
      const params = new URLSearchParams({ id: String(id) })
      const res = await fetch(`${baseURL}/api/price?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) {
        return { content: [{ type: 'text', text: `Error: ${data?.error || 'Failed to fetch price'}` }] }
      }
      return {
        content: [
          {
            type: 'text',
            text: `Price: ${data.priceFormatted} USD (mint: ${data.tokenId})`,
          },
        ],
        structuredContent: data,
      }
    },
  )

  // Stake SOL tool (renders widget; backend executes via /api/stake)
  server.registerTool(
    stakeWidget.id,
    {
      title: stakeWidget.title,
      description: 'Stake SOL into a liquid staking token (default JupSOL). Confirm in widget.',
      inputSchema: {
        amount: z.string().describe("Amount of SOL to stake (e.g., '0.5')"),
        lst: z.string().optional().describe('LST symbol or mint (default: JupSOL)'),
      },
      _meta: {
        ...widgetMeta(stakeWidget),
        'openai/widgetAccessible': false,
      },
    },
    async ({ amount, lst }) => {
      // Provide state for UI to prefill and call /api/stake when user confirms
      return {
        content: [{ type: 'text', text: `Prepare to stake ${amount} SOL into ${lst || 'JupSOL'}` }],
        structuredContent: {
          initialAmount: amount,
          lst: lst || 'JupSOL',
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(stakeWidget),
      }
    },
  )
})

export const GET = handler
export const POST = handler
