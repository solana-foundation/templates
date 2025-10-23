'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface StatItem {
  label: string
  value: string
  change?: number
  prefix?: string
  suffix?: string
}

export function StatsBar() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'TPS', value: '3,247', change: 2.3, suffix: '' },
    { label: 'SOL', value: '142.85', change: 5.2, prefix: '$' },
    { label: 'TVL', value: '4.2B', change: -1.1, prefix: '$' },
    { label: '24H VOL', value: '892M', change: 8.7, prefix: '$' },
  ])

  const prevRef = useRef<{ tps?: number; sol?: number; tvl?: number; vol?: number }>({})

  useEffect(() => {
    let isMounted = true

    const computeChangePct = (prev: number | undefined, curr: number | null): number | undefined => {
      if (typeof prev !== 'number' || prev <= 0 || curr === null) return undefined
      const pct = ((curr - prev) / prev) * 100
      return Number.parseFloat(pct.toFixed(1))
    }

    const computeChangePctWithThreshold = (
      prev: number | undefined,
      curr: number | null,
      thresholdPct: number,
    ): number | undefined => {
      const val = computeChangePct(prev, curr)
      if (typeof val !== 'number') return undefined
      return Math.abs(val) < thresholdPct ? 0 : val
    }

    const fmtNumber = (n: number): string => n.toLocaleString()
    const fmtUsd = (n: number): string => n.toFixed(2)
    const fmtUsdBillions = (n: number): string => (n / 1_000_000_000).toFixed(1) + 'B'
    const fmtUsdCompact = (n: number): string =>
      n >= 1_000_000_000 ? (n / 1_000_000_000).toFixed(1) + 'B' : (n / 1_000_000).toFixed(0) + 'M'

    const tick = async () => {
      try {
        const res = await fetch('/api/stats')
        if (!res.ok) return
        const data: {
          tps: number | null
          solPriceUsd: number | null
          tvlUsd: number | null
          volume24hUsd: number | null
          solChange24hPct?: number | null
          tvlChange24hPct?: number | null
          volume24hChangePct?: number | null
        } = await res.json()
        if (!isMounted) return

        const prev = prevRef.current
        const tpsVal = data.tps ?? null
        const solVal = data.solPriceUsd ?? null
        const tvlVal = data.tvlUsd ?? null
        const volVal = data.volume24hUsd ?? null

        const nextStats: StatItem[] = [
          {
            label: 'TPS',
            value: tpsVal !== null ? fmtNumber(tpsVal) : stats[0]?.value,
            change: computeChangePctWithThreshold(prev.tps, tpsVal ?? null, 0.2),
            suffix: '',
          },
          {
            label: 'SOL',
            prefix: '$',
            value: solVal !== null ? fmtUsd(solVal) : stats[1]?.value,
            change: typeof data.solChange24hPct === 'number' ? Number.parseFloat(data.solChange24hPct.toFixed(1)) : 0,
          },
          {
            label: 'TVL',
            prefix: '$',
            value: tvlVal !== null ? fmtUsdBillions(tvlVal) : stats[2]?.value,
            change: typeof data.tvlChange24hPct === 'number' ? Number.parseFloat(data.tvlChange24hPct.toFixed(1)) : 0,
          },
          {
            label: '24H VOL',
            prefix: '$',
            value: volVal !== null ? fmtUsdCompact(volVal) : stats[3]?.value,
            change:
              typeof data.volume24hChangePct === 'number' ? Number.parseFloat(data.volume24hChangePct.toFixed(1)) : 0,
          },
        ]

        setStats(nextStats)
        prevRef.current = {
          tps: tpsVal ?? prev.tps,
          sol: solVal ?? prev.sol,
          tvl: tvlVal ?? prev.tvl,
          vol: volVal ?? prev.vol,
        }
      } catch {
        // ignore transient errors
      }
    }

    tick()
    const id = setInterval(tick, 3000)
    return () => {
      isMounted = false
      clearInterval(id)
    }
  }, [])

  return (
    <div className="w-full border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 py-2">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stat.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-mono font-semibold text-foreground"
                  >
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </motion.span>
                </AnimatePresence>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`flex items-center gap-0.5 text-xs font-mono ${
                    (stat.change ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {(stat.change ?? 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span className="tabular-nums min-w-[5ch] text-right inline-block">
                    {Math.abs(stat.change ?? 0).toFixed(1)}%
                  </span>
                </motion.div>
              </div>
              {index < stats.length - 1 && <div className="h-4 w-px bg-border/50 ml-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
