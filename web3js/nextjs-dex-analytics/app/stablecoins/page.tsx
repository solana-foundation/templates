'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDown, ArrowUp, Coins, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  getAllStablecoins,
  getSolanaStablecoins,
  getSolanaStablecoinHistory,
  type Stablecoin,
} from '@/lib/defillama-stablecoins'

export default function StablecoinsPage() {
  const [stablecoins, setStablecoins] = useState<Stablecoin[]>([])
  const [solanaStablecoins, setSolanaStablecoins] = useState<Stablecoin[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '180d'>('30d')

  useEffect(() => {
    loadStablecoinData()
  }, [])

  const loadStablecoinData = async () => {
    setLoading(true)
    try {
      const [allCoins, solCoins, history] = await Promise.all([
        getAllStablecoins(),
        getSolanaStablecoins(),
        getSolanaStablecoinHistory(),
      ])

      setStablecoins(allCoins)
      setSolanaStablecoins(solCoins)

      if (history && history.length > 0) {
        console.log('[v0] Processing chart data, first item:', history[0])

        const transformedData = history.map((item: any) => {
          // The API returns [timestamp, value] pairs or objects with date and totalCirculating
          if (Array.isArray(item)) {
            return {
              date: item[0] * 1000,
              totalCirculating: item[1] || 0,
            }
          } else {
            return {
              date: (item.date || item.timestamp) * 1000,
              totalCirculating: item.totalCirculating?.peggedUSD || item.totalCirculating || 0,
            }
          }
        })

        console.log('[v0] Transformed chart data points:', transformedData.length)
        console.log('[v0] Sample transformed point:', transformedData[0])
        setChartData(transformedData)
      }
    } catch (error) {
      console.error('[v0] Error loading stablecoin data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalSolanaMarketCap = solanaStablecoins.reduce(
    (sum, coin) => sum + (coin.chainCirculating?.Solana?.current?.peggedUSD || 0),
    0,
  )

  const topStablecoins = [...solanaStablecoins]
    .sort((a, b) => {
      const aVal = a.chainCirculating?.Solana?.current?.peggedUSD || 0
      const bVal = b.chainCirculating?.Solana?.current?.peggedUSD || 0
      return bVal - aVal
    })
    .slice(0, 5)

  // Filter chart data based on selected period
  const filteredChartData = chartData.slice(selectedPeriod === '30d' ? -30 : selectedPeriod === '90d' ? -90 : -180)

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toFixed(2)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-6 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Solana Stablecoins</h1>
              <p className="text-muted-foreground">Market cap, circulation, and analytics for stablecoins on Solana</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-mono tracking-wide">TOTAL MARKET CAP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{formatCurrency(totalSolanaMarketCap)}</div>
                <p className="text-xs text-muted-foreground mt-1">Across {solanaStablecoins.length} stablecoins</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-mono tracking-wide">LARGEST STABLECOIN</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topStablecoins[0]?.symbol || 'N/A'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(topStablecoins[0]?.chainCirculating?.Solana?.current?.peggedUSD || 0)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-mono tracking-wide">ACTIVE STABLECOINS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{solanaStablecoins.length}</div>
                <p className="text-xs text-muted-foreground mt-1">On Solana network</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Historical Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Total Stablecoin Market Cap on Solana
                  </CardTitle>
                  <CardDescription>Historical circulation over time</CardDescription>
                </div>
                <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="30d" className="text-xs font-mono">
                      30D
                    </TabsTrigger>
                    <TabsTrigger value="90d" className="text-xs font-mono">
                      90D
                    </TabsTrigger>
                    <TabsTrigger value="180d" className="text-xs font-mono">
                      180D
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-muted-foreground">Loading chart data...</div>
                </div>
              ) : filteredChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={filteredChartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      formatter={(value: number) => [formatCurrency(value), 'Market Cap']}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalCirculating"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-muted-foreground">No chart data available</div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stablecoins Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>All Stablecoins on Solana</CardTitle>
              <CardDescription>Complete list with market cap and circulation data</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="font-mono text-xs">RANK</TableHead>
                    <TableHead className="font-mono text-xs">NAME</TableHead>
                    <TableHead className="font-mono text-xs">SYMBOL</TableHead>
                    <TableHead className="font-mono text-xs">PEG TYPE</TableHead>
                    <TableHead className="font-mono text-xs text-right">MARKET CAP</TableHead>
                    <TableHead className="font-mono text-xs text-right">PRICE</TableHead>
                    <TableHead className="font-mono text-xs text-right">24H CHANGE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Loading stablecoins...
                      </TableCell>
                    </TableRow>
                  ) : solanaStablecoins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No stablecoins found
                      </TableCell>
                    </TableRow>
                  ) : (
                    solanaStablecoins
                      .sort((a, b) => {
                        const aVal = a.chainCirculating?.Solana?.current?.peggedUSD || 0
                        const bVal = b.chainCirculating?.Solana?.current?.peggedUSD || 0
                        return bVal - aVal
                      })
                      .map((coin, index) => {
                        const marketCap = coin.chainCirculating?.Solana?.current?.peggedUSD || 0
                        const change = coin.change_1d ?? 0
                        const isPositive = change >= 0

                        return (
                          <TableRow key={coin.id} className="border-border/50">
                            <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                            <TableCell className="font-medium">{coin.name}</TableCell>
                            <TableCell className="font-mono font-semibold">{coin.symbol}</TableCell>
                            <TableCell className="text-sm text-muted-foreground capitalize">{coin.pegType}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(marketCap)}</TableCell>
                            <TableCell className="text-right font-mono">
                              ${coin.price?.toFixed(4) || '1.0000'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div
                                className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                              >
                                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                <span className="font-mono text-sm">{Math.abs(change).toFixed(2)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
