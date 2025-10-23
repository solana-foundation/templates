'use client'

import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type DexProtocolSummary, type DexVolumeData } from '@/lib/defillama-volumes'
import { motion } from 'framer-motion'
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function DexAnalyticsPage() {
  const router = useRouter()
  const [volumeData, setVolumeData] = useState<DexVolumeData[]>([])
  const [protocols, setProtocols] = useState<DexProtocolSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch('/api/dex/overview')
      if (res.ok) {
        const json = (await res.json()) as { protocols: DexProtocolSummary[]; volumes: DexVolumeData[] }
        setProtocols(json.protocols.sort((a, b) => (b.total24h || 0) - (a.total24h || 0)))
        console.log('[v0] Volume data points:', json.volumes.length)
        console.log('[v0] Sample volume data:', json.volumes.slice(-5))
        setVolumeData(json.volumes)
      }
    } catch (error) {
      console.error('[v0] Error loading DEX analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const topDexNames = protocols.slice(0, 7).map((p) => p.name)

  const chartData = volumeData.slice(-30).map((d) => {
    const dataPoint: any = {
      date: new Date(d.date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }

    // Add each top DEX as a separate property
    topDexNames.forEach((dexName) => {
      dataPoint[dexName] = d.breakdown[dexName] || 0
    })

    return dataPoint
  })

  const dexColors = [
    'oklch(0.75 0.15 85)', // Golden (primary)
    'oklch(0.65 0.20 150)', // Teal
    'oklch(0.70 0.18 250)', // Blue
    'oklch(0.68 0.19 330)', // Pink
    'oklch(0.72 0.17 120)', // Green
    'oklch(0.66 0.21 30)', // Orange
    'oklch(0.64 0.22 280)', // Purple
  ]

  const total24hVolume = protocols.reduce((sum, p) => sum + (p.total24h || 0), 0)
  const total7dVolume = protocols.reduce((sum, p) => sum + (p.total7d || 0), 0)
  const avgChange24h =
    protocols.length > 0 ? protocols.reduce((sum, p) => sum + (p.change_1d || 0), 0) / protocols.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 mt-8 font-mono">Solana DEX Analytics</h1>
          <p className="text-muted-foreground">Real-time volume and trading metrics powered by DeFi Llama</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-foreground">
                  ${(total24hVolume / 1e9).toFixed(2)}B
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across {protocols.length} DEXs</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">7d Volume</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-foreground">${(total7dVolume / 1e9).toFixed(2)}B</div>
                <p className="text-xs text-muted-foreground mt-1">Last 7 days total</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg 24h Change</CardTitle>
                {avgChange24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold font-mono ${avgChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {avgChange24h >= 0 ? '+' : ''}
                  {avgChange24h.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Average across all DEXs</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Volume Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-primary/20 bg-card/50 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" />
                Solana DEX Volume Comparison (30 Days)
              </CardTitle>
              <CardDescription>Daily trading volume by protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    {topDexNames.map((dexName, index) => (
                      <linearGradient key={dexName} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={dexColors[index]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={dexColors[index]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                  <XAxis
                    dataKey="date"
                    stroke="oklch(0.55 0 0)"
                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <YAxis
                    stroke="oklch(0.55 0 0)"
                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                    tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.12 0 0)',
                      border: '1px solid oklch(0.25 0 0)',
                      borderRadius: '0.5rem',
                      fontFamily: 'monospace',
                    }}
                    formatter={(value: number, name: string) => [
                      `$${(value / 1e6).toFixed(2)}M`,
                      protocols.find((p) => p.name === name)?.displayName || name,
                    ]}
                  />
                  {topDexNames.map((dexName, index) => (
                    <Area
                      key={dexName}
                      type="monotone"
                      dataKey={dexName}
                      stroke={dexColors[index]}
                      fill={`url(#gradient-${index})`}
                      strokeWidth={2}
                      name={dexName}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* DEX Protocols Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">DEX Protocols on Solana</CardTitle>
              <CardDescription>Volume breakdown by protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-mono">#</TableHead>
                    <TableHead className="text-muted-foreground font-mono">Protocol</TableHead>
                    <TableHead className="text-right text-muted-foreground font-mono">24h Volume</TableHead>
                    <TableHead className="text-right text-muted-foreground font-mono">7d Volume</TableHead>
                    <TableHead className="text-right text-muted-foreground font-mono">30d Volume</TableHead>
                    <TableHead className="text-right text-muted-foreground font-mono">24h Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protocols.map((protocol, index) => (
                    <TableRow
                      key={protocol.slug}
                      onClick={() => router.push(`/dex-analytics/${protocol.slug}`)}
                      className="border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {protocol.logo && (
                            <img
                              src={protocol.logo || '/placeholder.svg'}
                              alt={protocol.name}
                              className="h-6 w-6 rounded-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <div className="font-semibold text-foreground">{protocol.displayName || protocol.name}</div>
                            <div className="text-xs text-muted-foreground">{protocol.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        ${((protocol.total24h || 0) / 1e6).toFixed(2)}M
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        ${((protocol.total7d || 0) / 1e6).toFixed(2)}M
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        ${((protocol.total30d || 0) / 1e6).toFixed(2)}M
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-mono font-semibold ${(protocol.change_1d || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {(protocol.change_1d || 0) >= 0 ? '+' : ''}
                          {(protocol.change_1d || 0).toFixed(2)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
