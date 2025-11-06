import { createSolanaClient } from 'gill'
import { PublicKey, Connection, VersionedTransaction } from '@solana/web3.js'
import { Token, QuoteResponse } from '../types'
import { FALLBACK_TOKENS } from '../data/tokens'

// Gill-based Jupiter service with simplified API
export class GillJupiterService {
  private client: ReturnType<typeof createSolanaClient>
  private connection: Connection
  private tokens: Token[] = []

  constructor() {
    // Initialize Gill client with environment RPC URL
    this.client = createSolanaClient({
      urlOrMoniker: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    })

    // Initialize connection for transaction sending
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed',
    )
  }

  // Load tokens using Gill's approach with working endpoints
  async loadTokens(): Promise<Token[]> {
    try {
      console.log('🔄 Loading tokens with Gill Jupiter service...')

      // Try multiple token sources
      const tokenSources = [
        'https://lite-api.jup.ag/tokens/v2/tag?query=verified', // Jupiter V2 verified tokens
        'https://lite-api.jup.ag/tokens/v2/toporganicscore/24h?limit=100', // Top organic score tokens
        'https://token.jup.ag/all', // Jupiter's comprehensive list (fallback)
        'https://cache.jup.ag/tokens', // Jupiter's cached list (fallback)
      ]

      let fetchedTokens: Token[] = []
      for (const source of tokenSources) {
        try {
          const response = await fetch(source)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} from ${source}`)
          }
          const data = await response.json()
          // Handle Jupiter V2 API response format
          if (Array.isArray(data) && data.length > 0) {
            fetchedTokens = data.map((token) => ({
              address: token.id || token.address, // V2 uses 'id' field
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              logoURI: token.icon || token.logoURI, // V2 uses 'icon' field
            }))
            console.log(`✅ Successfully loaded tokens from ${source}`)
            break // Stop after first successful fetch
          }
        } catch (sourceError) {
          console.warn(`⚠️ Failed to load tokens from ${source}:`, sourceError)
        }
      }

      // If all external sources fail, use fallback tokens
      if (fetchedTokens.length === 0) {
        console.log('⚠️ Using fallback token list due to external API failures')
        fetchedTokens = FALLBACK_TOKENS
      }

      this.tokens = fetchedTokens
      return this.tokens
    } catch (err) {
      console.error('❌ Failed to load tokens with Gill Jupiter service, using fallback:', err)
      // Return fallback tokens even if there's an error
      this.tokens = FALLBACK_TOKENS
      return this.tokens
    }
  }

  // Get quote from Jupiter API
  async getQuote(inputMint: string, outputMint: string, amount: string, slippageBps: number): Promise<QuoteResponse> {
    try {
      console.log('🔄 Getting quote with Gill Jupiter service...')
      const queryParams = new URLSearchParams({
        inputMint,
        outputMint,
        amount,
        slippageBps: slippageBps.toString(),
        maxAccounts: '33', // Ensures multi-hop swaps fit within limits
      })

      const response = await fetch(`https://lite-api.jup.ag/swap/v1/quote?${queryParams}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Jupiter quote API error:', response.status, errorText)
        throw new Error(`Jupiter quote API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const quoteData: QuoteResponse = await response.json()
      console.log('✅ Quote received successfully with Gill Jupiter:', quoteData)
      return quoteData
    } catch (err) {
      console.error('❌ Quote error with Gill Jupiter:', err)
      throw err
    }
  }

  // Execute swap using Gill's transaction handling
  async executeSwap(
    publicKey: PublicKey,
    signTransaction: (transaction: VersionedTransaction) => Promise<VersionedTransaction>,
    quoteResponse: QuoteResponse,
  ): Promise<string> {
    try {
      console.log('🔄 Executing Gill Jupiter swap...')

      // Build the swap transaction using Jupiter API directly
      const swapResponse = await fetch('https://lite-api.jup.ag/swap/v1/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPublicKey: publicKey.toString(),
          quoteResponse: quoteResponse,
        }),
      })

      if (!swapResponse.ok) {
        const errorData = await swapResponse.json()
        throw new Error(`Jupiter swap API error: ${errorData.message || swapResponse.statusText}`)
      }

      const swapResponseData = await swapResponse.json()

      // Deserialize the transaction
      const versionedTransaction = VersionedTransaction.deserialize(
        Buffer.from(swapResponseData.swapTransaction, 'base64'),
      )

      // Sign the transaction
      const signedTransaction = await signTransaction(versionedTransaction)

      // Send the transaction
      const txSignature = await this.connection.sendRawTransaction(signedTransaction.serialize())

      console.log('✅ Gill Jupiter swap executed successfully!')
      console.log('📝 Transaction signature:', txSignature)
      console.log('🔗 View on Solscan:', `https://solscan.io/tx/${txSignature}`)

      return txSignature
    } catch (err) {
      console.error('❌ Gill Jupiter swap failed:', err)
      throw err
    }
  }

  // Get token by address
  getTokenByAddress(address: string): Token | undefined {
    return this.tokens.find((token) => token.address === address)
  }
}

export const gillJupiterService = new GillJupiterService()
