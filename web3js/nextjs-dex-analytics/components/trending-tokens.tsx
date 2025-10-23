'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import type { NormalizedTrendingToken } from '@/lib/defillama'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

interface TrendingToken {
  symbol: string
  name: string
  price: number
  change24h: number
  sparklineData: { value: number; timestamp: number }[]
  icon: string
}

const TOKEN_METADATA: Record<string, { name: string; icon: string }> = {
  SOL: { name: 'Solana', icon: '◎' },
  JUP: { name: 'Jupiter', icon: '🪐' },
  ORCA: { name: 'Orca', icon: '🐋' },
  RAY: { name: 'Raydium', icon: '⚡' },
  PUMP: { name: 'Pump', icon: '🚀' },
}

export function TrendingTokens() {
  const [tokens, setTokens] = useState<TrendingToken[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredPrices, setHoveredPrices] = useState<Record<string, number | null>>({})
  const [timePeriod, setTimePeriod] = useState<'24h' | '7d'>('24h')
  const [data24h, setData24h] = useState<TrendingToken[]>([])
  const [data7d, setData7d] = useState<TrendingToken[]>([])
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = useState(false)
  const [cols, setCols] = useState(1)

  useEffect(() => {
    async function loadPriceData() {
      try {
        const [res24, res7] = await Promise.all([fetch('/api/trending?hours=24'), fetch('/api/trending?hours=168')])
        if (!res24.ok || !res7.ok) throw new Error('Failed to fetch trending tokens API')

        const [priceData24h, priceData7d]: [NormalizedTrendingToken[], NormalizedTrendingToken[]] = await Promise.all([
          res24.json(),
          res7.json(),
        ])

        const processData = (priceData: NormalizedTrendingToken[]): TrendingToken[] =>
          priceData.map((data) => {
            const metadata = TOKEN_METADATA[data.symbol] || { name: data.symbol, icon: '💎' }
            const sparklineData = data.prices.map((p) => ({ value: p.price, timestamp: p.timestamp }))
            return {
              symbol: data.symbol,
              name: metadata.name,
              price: data.currentPrice,
              change24h: data.change24h,
              sparklineData,
              icon: metadata.icon,
            }
          })

        const tokens24h = processData(priceData24h)
        const tokens7d = processData(priceData7d)
        setData24h(tokens24h)
        setData7d(tokens7d)
        setTokens(timePeriod === '24h' ? tokens24h : tokens7d)
      } catch (e) {
        setTokens([])
      } finally {
        setLoading(false)
      }
    }

    loadPriceData()
    const interval = setInterval(loadPriceData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timePeriod === '24h' && data24h.length > 0) setTokens(data24h)
    if (timePeriod === '7d' && data7d.length > 0) setTokens(data7d)
  }, [timePeriod, data24h, data7d])

  useEffect(() => {
    const computeCols = () => {
      const w = window.innerWidth
      if (w >= 1024) return 5
      if (w >= 768) return 4
      if (w >= 640) return 2
      return 1
    }
    const onResize = () => setCols(computeCols())
    setCols(computeCols())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (loading) {
    return (
      <div className="w-full border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Solana DEX Bluechips</h3>
            </div>
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Solana DEX Bluechips</h3>
          </div>
          <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as '24h' | '7d')}>
            <TabsList className="h-7 bg-secondary/50 border border-border/50">
              <TabsTrigger value="24h" className="text-xs h-6 px-3 data-[state=active]:bg-primary/20">
                24Hr
              </TabsTrigger>
              <TabsTrigger value="7d" className="text-xs h-6 px-3 data-[state=active]:bg-primary/20">
                7d
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tokens.slice(0, isMobile ? (expanded ? tokens.length : 2) : Math.min(cols, tokens.length)).map((token) => {
            const prices = token.sparklineData.map((d) => d.value)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            const padding = (maxPrice - minPrice) * 0.1 || maxPrice * 0.01

            const displayPrice = hoveredPrices[token.symbol] ?? token.price

            return (
              <motion.div
                key={token.symbol}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                onMouseLeave={() => {
                  setHoveredPrices((prev) => ({ ...prev, [token.symbol]: null }))
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{token.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </div>
                  </div>
                </div>

                <div className="h-12 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={token.sparklineData}
                      onMouseMove={(e: any) => {
                        if (e && e.activePayload && e.activePayload[0]) {
                          setHoveredPrices((prev) => ({
                            ...prev,
                            [token.symbol]: e.activePayload[0].value,
                          }))
                        }
                      }}
                    >
                      <YAxis domain={[minPrice - padding, maxPrice + padding]} hide />
                      <Tooltip
                        content={() => null}
                        cursor={{ stroke: token.change24h >= 0 ? '#22c55e' : '#ef4444', strokeWidth: 1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={token.change24h >= 0 ? '#22c55e' : '#ef4444'}
                        strokeWidth={1.5}
                        dot={false}
                        animationDuration={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Price and Change */}
                <div className="flex items-center justify-between">
                  <motion.span
                    key={displayPrice}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-mono font-bold text-foreground"
                  >
                    ${displayPrice < 0.01 ? displayPrice.toFixed(6) : displayPrice.toFixed(2)}
                  </motion.span>
                  <div
                    className={`flex items-center gap-1 text-xs font-mono ${
                      token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {token.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(token.change24h).toFixed(1)}%</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        {isMobile && tokens.length > 1 && (
          <div className="mt-3 flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
