'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, DollarSign, ExternalLink, Globe, TrendingDown, TrendingUp } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function IndividualDexPage() {
  const params = useParams()
  const router = useRouter()
  const dexId = params.dexId as string
  const [protocolData, setProtocolData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProtocolData()
  }, [dexId])

  async function loadProtocolData() {
    setLoading(true)
    try {
      const res = await fetch(`/api/dex/protocol/${dexId}`)
      const data = res.ok ? await res.json() : null
      setProtocolData(data)
    } catch (error) {
      console.error('[v0] Error loading protocol data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!protocolData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="border-primary/20 bg-card/50 backdrop-blur p-8">
          <CardHeader>
            <CardTitle className="text-foreground">Protocol Not Found</CardTitle>
            <CardDescription>The DEX protocol you're looking for doesn't exist or couldn't be loaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dex-analytics')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DEX Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Process chart data
  const volumeChartData = protocolData.totalDataChart
    ? protocolData.totalDataChart.slice(-90).map((item: any) => ({
        date: new Date(item[0] * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volume: item[1] || 0,
      }))
    : []

  // Process chain breakdown data
  const chainBreakdownData = protocolData.totalDataChartBreakdown
    ? Object.entries(protocolData.totalDataChartBreakdown.slice(-1)[0]?.[1] || {}).map(([chain, volume]) => ({
        chain,
        volume: volume as number,
      }))
    : []

  const change24h = protocolData.change_1d || 0
  const change7d = protocolData.change_7d || 0

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-[100vw]">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            onClick={() => router.push('/dex-analytics')}
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to DEX Analytics
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {protocolData.logo && (
              <img
                src={protocolData.logo || '/placeholder.svg'}
                alt={protocolData.name}
                className="h-16 w-16 rounded-full border-2 border-primary/20"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-foreground font-mono">
                {protocolData.displayName || protocolData.name}
              </h1>
              <p className="text-muted-foreground">{protocolData.description || 'DEX Protocol Analytics'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {protocolData.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={protocolData.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
            {protocolData.twitter && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://twitter.com/${protocolData.twitter}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Twitter
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-foreground">
                  ${((protocolData.total24h || 0) / 1e6).toFixed(2)}M
                </div>
                <p className={`text-xs font-semibold mt-1 ${change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change24h >= 0 ? '+' : ''}
                  {change24h.toFixed(2)}% from yesterday
                </p>
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
                <div className="text-3xl font-bold font-mono text-foreground">
                  ${((protocolData.total7d || 0) / 1e6).toFixed(2)}M
                </div>
                <p className={`text-xs font-semibold mt-1 ${change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change7d >= 0 ? '+' : ''}
                  {change7d.toFixed(2)}% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">30d Volume</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-foreground">
                  ${((protocolData.total30d || 0) / 1e9).toFixed(2)}B
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days total</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">All Time Volume</CardTitle>
                {change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-foreground">
                  ${((protocolData.totalAllTime || 0) / 1e9).toFixed(2)}B
                </div>
                <p className="text-xs text-muted-foreground mt-1">Since inception</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="volume" className="space-y-6">
          <TabsList className="bg-card/50 border border-primary/20">
            <TabsTrigger value="volume">Volume History</TabsTrigger>
            <TabsTrigger value="chains">Chain Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="volume">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Daily Volume (90 Days)
                  </CardTitle>
                  <CardDescription>Historical trading volume over the last 90 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={volumeChartData}>
                      <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.75 0.15 85)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.75 0.15 85)" stopOpacity={0} />
                        </linearGradient>
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
                        tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.12 0 0)',
                          border: '1px solid oklch(0.25 0 0)',
                          borderRadius: '0.5rem',
                          fontFamily: 'monospace',
                        }}
                        formatter={(value: number) => [`$${(value / 1e6).toFixed(2)}M`, 'Volume']}
                      />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stroke="oklch(0.75 0.15 85)"
                        fill="url(#volumeGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="chains">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-primary/20 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Volume by Chain
                  </CardTitle>
                  <CardDescription>Current 24h volume distribution across chains</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chainBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)" />
                      <XAxis
                        dataKey="chain"
                        stroke="oklch(0.55 0 0)"
                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                      />
                      <YAxis
                        stroke="oklch(0.55 0 0)"
                        style={{ fontSize: '12px', fontFamily: 'monospace' }}
                        tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.12 0 0)',
                          border: '1px solid oklch(0.25 0 0)',
                          borderRadius: '0.5rem',
                          fontFamily: 'monospace',
                        }}
                        formatter={(value: number) => [`$${(value / 1e6).toFixed(2)}M`, 'Volume']}
                      />
                      <Bar dataKey="volume" fill="oklch(0.75 0.15 85)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
