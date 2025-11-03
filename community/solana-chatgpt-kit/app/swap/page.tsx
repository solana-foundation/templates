'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowDownUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDisplayMode, useMaxHeight, useWidgetProps } from '../hooks'
import { externalWallet } from '@/lib/solana-config'
import { ensureWalletConnected, getWalletPublicKey, signAndSendTransaction } from '@/lib/wallet-utils'

interface SwapWidgetProps extends Record<string, unknown> {
  inputToken?: string
  outputToken?: string
  initialAmount?: string
}

export default function SwapPage() {
  const toolOutput = useWidgetProps<SwapWidgetProps>()
  const maxHeight = useMaxHeight() ?? undefined
  const displayMode = useDisplayMode()

  const [inputToken, setInputToken] = useState(toolOutput?.inputToken || 'SOL')
  const [outputToken, setOutputToken] = useState(toolOutput?.outputToken || 'USDC')
  const [inputAmount, setInputAmount] = useState(toolOutput?.initialAmount || '0.001')
  const [outputAmount, setOutputAmount] = useState('0')
  const [isLoading, setIsLoading] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState('')
  const [swapResult, setSwapResult] = useState<{
    outputAmount: number
    outputToken: string
    explorerUrl: string
  } | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Sync state with tool-provided props when they arrive/change
  useEffect(() => {
    if (toolOutput?.inputToken && toolOutput.inputToken !== inputToken) {
      setInputToken(String(toolOutput.inputToken))
    }
    if (toolOutput?.outputToken && toolOutput.outputToken !== outputToken) {
      setOutputToken(String(toolOutput.outputToken))
    }
    if (toolOutput?.initialAmount && toolOutput.initialAmount !== inputAmount) {
      setInputAmount(String(toolOutput.initialAmount))
    }
  }, [toolOutput?.inputToken, toolOutput?.outputToken, toolOutput?.initialAmount])

  // Fetch quote when input changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        setOutputAmount('0')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/swap/quote?inputToken=${inputToken}&outputToken=${outputToken}&amount=${inputAmount}`,
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch quote')
        }

        const data = await response.json()
        setOutputAmount(data.outputAmount.toFixed(6))
      } catch (err) {
        console.error('Error fetching quote:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch quote')
        setOutputAmount('0')
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchQuote, 500)
    return () => clearTimeout(debounceTimer)
  }, [inputAmount, inputToken, outputToken])

  const handleSwap = async () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setIsSwapping(true)
    setError('')
    setSwapResult(null)

    try {
      let userPublicKey: string | undefined

      // If using external wallet, connect and get public key
      if (externalWallet) {
        const provider = await ensureWalletConnected()
        const publicKey = getWalletPublicKey(provider)
        if (!publicKey) {
          throw new Error('Failed to get wallet public key')
        }
        userPublicKey = publicKey
        setWalletAddress(publicKey)
      }

      const response = await fetch('/api/swap/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputToken,
          outputToken,
          amount: inputAmount,
          userPublicKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Swap failed')
      }

      const data = await response.json()

      // If external wallet mode, sign and send the transaction
      if (externalWallet && data.swapTransaction) {
        const provider = await ensureWalletConnected()
        const signature = await signAndSendTransaction(provider, data.swapTransaction)

        const explorerUrl = `https://solscan.io/tx/${signature}`
        setSwapResult({
          outputAmount: data.expectedOutputAmount ?? 0,
          outputToken,
          explorerUrl,
        })
      } else {
        // Server wallet mode - transaction already executed
        setSwapResult({
          outputAmount: data.outputAmount,
          outputToken: data.outputToken,
          explorerUrl: data.explorerUrl,
        })
      }
    } catch (err) {
      console.error('Error executing swap:', err)
      setError(err instanceof Error ? err.message : 'Failed to execute swap')
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center p-4"
      style={{
        maxHeight,
        height: displayMode === 'fullscreen' ? maxHeight : undefined,
      }}
    >
      <Card className="w-full max-w-md border-border/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl font-semibold">Swap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Token */}
          <div className="space-y-2">
            <Label htmlFor="from" className="text-xs text-muted-foreground">
              From
            </Label>
            <div className="relative">
              <Input
                id="from"
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                className="pr-20 text-lg h-12"
              />
              <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2">
                {inputToken}
              </Badge>
            </div>
            <Input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Token symbol or mint address"
              className="text-xs h-8"
            />
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const temp = inputToken
                setInputToken(outputToken)
                setOutputToken(temp)
              }}
              className="rounded-full h-8 w-8"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          {/* Output Token */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-xs text-muted-foreground">
              To
            </Label>
            <div className="relative">
              <Input
                id="to"
                type="text"
                value={isLoading ? 'Loading...' : outputAmount}
                readOnly
                placeholder="0.0"
                className="pr-20 text-lg h-12 cursor-default"
              />
              <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2">
                {outputToken}
              </Badge>
            </div>
            <Input
              type="text"
              value={outputToken}
              onChange={(e) => setOutputToken(e.target.value)}
              placeholder="Token symbol or mint address"
              className="text-xs h-8"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {swapResult && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-700 dark:text-green-400">
                Swap successful! Received{' '}
                <span className="font-semibold">
                  {swapResult.outputAmount.toFixed(6)} {swapResult.outputToken}
                </span>
              </p>
              <a
                href={swapResult.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 dark:text-green-400 hover:underline mt-1 inline-block break-all"
              >
                View on Solscan →
              </a>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={isSwapping || isLoading || parseFloat(outputAmount) <= 0}
            className="w-full h-11 font-semibold"
            size="lg"
          >
            {isSwapping ? 'Swapping...' : 'Swap'}
          </Button>

          {externalWallet && walletAddress && (
            <p className="text-xs text-center text-muted-foreground break-all">Connected: {walletAddress}</p>
          )}

          <p className="text-xs text-center text-muted-foreground pt-1">Powered by Jupiter • Slippage: 0.5%</p>
        </CardContent>
      </Card>
    </div>
  )
}
