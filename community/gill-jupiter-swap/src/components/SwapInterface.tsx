'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { ArrowLeftRight, ArrowUpDown, Loader2, AlertCircle, CheckCircle, ExternalLink, Wallet } from 'lucide-react'
import TokenSelector from './TokenSelector'
import SlippageControl from './SlippageControl'
import RouteVisualization from './RouteVisualization'
import { Token, QuoteResponse } from '../types'
import { gillJupiterService } from '../services/gill-jupiter'

const SOL_MINT = 'So11111111111111111111111111111111111111112'
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

const SwapInterface: React.FC = () => {
  const { publicKey, signTransaction, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null)
  const [swapping, setSwapping] = useState(false)
  const [tokensLoading, setTokensLoading] = useState(true)
  const [slippage, setSlippage] = useState(0.5)
  const [showRouteDetails, setShowRouteDetails] = useState(false)
  const [completedSwapQuote, setCompletedSwapQuote] = useState<QuoteResponse | null>(null)

  useEffect(() => {
    const initializeTokens = async () => {
      try {
        setTokensLoading(true)
        const tokenList = await gillJupiterService.loadTokens()
        setTokens(tokenList)

        const solToken = tokenList.find((token) => token.address === SOL_MINT)
        const usdcToken = tokenList.find((token) => token.address === USDC_MINT)

        if (solToken) setFromToken(solToken)
        if (usdcToken) setToToken(usdcToken)
      } catch (err) {
        console.error('Failed to load tokens:', err)
        setError('Failed to load token list')
      } finally {
        setTokensLoading(false)
      }
    }
    initializeTokens()
  }, [])

  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setQuote(null)
      setToAmount('')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const amount = (parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)).toString()
      const quoteData = await gillJupiterService.getQuote(fromToken.address, toToken.address, amount, slippage * 100)

      setQuote(quoteData)
      const outAmount = parseFloat(quoteData.outAmount) / Math.pow(10, toToken.decimals)
      setToAmount(outAmount.toFixed(6))
    } catch (err) {
      console.error('Quote error:', err)
      setError('Failed to get quote. Please try again.')
      setQuote(null)
      setToAmount('')
    } finally {
      setLoading(false)
    }
  }, [fromToken, toToken, fromAmount, slippage])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuote()
    }, 500) // Debounce

    return () => clearTimeout(timeoutId)
  }, [fetchQuote])

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount

    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const handleSwap = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Please connect a wallet first.')
      return
    }

    if (!quote) {
      setError('Please get a quote first.')
      return
    }

    setSwapping(true)
    setError(null)
    setSwapSuccess(null)
    setCompletedSwapQuote(null)

    try {
      console.log('🔄 Executing Jupiter swap...')
      const txSignature = await gillJupiterService.executeSwap(publicKey, signTransaction, quote)
      console.log('✅ Jupiter swap completed successfully!')

      setSwapSuccess(txSignature)
      setCompletedSwapQuote(quote)
      setFromAmount('')
      setToAmount('')
      setQuote(null)

      console.log('🔗 View on Solscan:', `https://solscan.io/tx/${txSignature}`)
    } catch (err: any) {
      console.error('❌ Jupiter swap failed:', err)

      // Check for 403 RPC error (public RPC blocking transactions)
      if (err.message && (err.message.includes('403') || err.message.includes('Access forbidden'))) {
        setError(
          'RPC Error: The public Solana RPC blocks transactions. Please add a private RPC URL to your .env.local file. See README for setup instructions (Helius, QuickNode, Alchemy, or Triton).',
        )
      } else {
        setError(`Failed to execute swap: ${err.message}`)
      }
    } finally {
      setSwapping(false)
    }
  }

  return (
    <div className="glass p-6 fade-in max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Swap</h2>
        <SlippageControl slippage={slippage} onSlippageChange={setSlippage} />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-200 text-sm">{error}</span>
        </div>
      )}

      {swapSuccess && (
        <div className="mb-4 p-3 bg-green-500/20 rounded-lg" style={{ border: 'none' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4" style={{ color: 'white' }} />
            <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>Swap Successful!</span>
          </div>
          <p style={{ color: 'white', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            Transaction completed successfully
          </p>
          <a
            href={`https://solscan.io/tx/${swapSuccess}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'white' }}
          >
            View on Solscan
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {swapSuccess && completedSwapQuote && (
        <div className="mb-4">
          <RouteVisualization
            routePlan={completedSwapQuote.routePlan}
            fromToken={fromToken}
            toToken={toToken}
            priceImpact={parseFloat(completedSwapQuote.priceImpactPct)}
            isVisible={showRouteDetails}
            onToggle={() => setShowRouteDetails(!showRouteDetails)}
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase' }}>
              From
            </span>
            <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>Balance: --</span>
          </div>
          <div className="flex items-center gap-3">
            <TokenSelector
              selectedToken={fromToken}
              onTokenSelect={setFromToken}
              tokens={tokens}
              loading={tokensLoading}
            />
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="input flex-1 text-right text-lg font-medium"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwapTokens}
            className="btn btn-secondary w-10 h-10 rounded-full flex items-center justify-center"
            disabled={!fromToken || !toToken}
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase' }}>
              To
            </span>
            <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>Balance: --</span>
          </div>
          <div className="flex items-center gap-3">
            <TokenSelector selectedToken={toToken} onTokenSelect={setToToken} tokens={tokens} loading={tokensLoading} />
            <input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="input flex-1 text-right text-lg font-medium bg-gray-800"
            />
          </div>
        </div>

        {quote && (
          <div className="card">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'white' }}>Price Impact</span>
                <span style={{ color: 'white' }}>{parseFloat(quote.priceImpactPct).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'white' }}>Route</span>
                <span style={{ color: 'white' }}>
                  {quote.routePlan.length} hop{quote.routePlan.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'white' }}>Slippage</span>
                <span style={{ color: 'white' }}>{slippage}%</span>
              </div>
            </div>
          </div>
        )}

        {quote && (
          <RouteVisualization
            routePlan={quote.routePlan}
            fromToken={fromToken}
            toToken={toToken}
            priceImpact={parseFloat(quote.priceImpactPct)}
            isVisible={showRouteDetails}
            onToggle={() => setShowRouteDetails(!showRouteDetails)}
          />
        )}

        <div>
          {!connected ? (
            <button
              onClick={(e) => {
                e.preventDefault()
                setVisible(true)
              }}
              className="btn btn-primary w-full"
              type="button"
            >
              <div className="flex items-center justify-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </div>
            </button>
          ) : (
            <button
              onClick={handleSwap}
              disabled={!quote || loading || swapping || !fromAmount || parseFloat(fromAmount) <= 0}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 loading" />
                    Getting Quote...
                  </div>
                </>
              ) : swapping ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 loading" />
                    Executing Swap...
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  Execute Swap
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SwapInterface
