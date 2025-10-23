'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { JupiterOrderResponse } from '@/lib/jupiter-ultra'
import { SOLANA_TOKENS } from '@/lib/solana-tokens'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface SwapRoutingProps {
  quote: JupiterOrderResponse
}

type RouteLeg = {
  poolId?: string
  label?: string
  inputMint?: string
  outputMint?: string
  program?: string
  inAmount?: string
  outAmount?: string
}

const mintToSymbol = new Map<string, string>(SOLANA_TOKENS.map((t) => [t.mint, t.symbol]))

function formatToken(mint?: string): string {
  if (!mint) return '?'
  const sym = mintToSymbol.get(mint)
  if (sym) return sym
  return mint.length > 8 ? `${mint.slice(0, 4)}…${mint.slice(-4)}` : mint
}

function formatProgram(program?: string): string {
  if (!program) return 'router'
  return program
}

function getLegs(routePlan: unknown[]): RouteLeg[] {
  if (!Array.isArray(routePlan)) return []

  const normalizeToSwapObjects = (item: any): any[] => {
    if (Array.isArray(item)) return item.flatMap(normalizeToSwapObjects)
    if (item?.swapInfo) return [item.swapInfo]
    if (item?.swap) return [item.swap]
    return [item]
  }

  const flat = routePlan.flatMap(normalizeToSwapObjects)

  const extractMint = (obj: any, kind: 'in' | 'out'): string | undefined => {
    const candidates = [
      kind === 'in' ? obj?.inputMint : obj?.outputMint,
      kind === 'in' ? obj?.inMint : obj?.outMint,
      kind === 'in' ? obj?.fromMint : obj?.toMint,
      kind === 'in' ? obj?.fromTokenMint : obj?.toTokenMint,
      kind === 'in' ? obj?.mintIn : obj?.mintOut,
    ]
    return candidates.find((v) => typeof v === 'string' && v.length > 0)
  }

  const extractProgram = (obj: any): string | undefined => {
    return (
      obj?.program || obj?.type || obj?.label || obj?.market || obj?.amm || obj?.exchange || obj?.platform || undefined
    )
  }

  return flat.map((leg: any) => ({
    poolId: leg?.poolId ?? leg?.id ?? undefined,
    label: leg?.label ?? undefined,
    inputMint: extractMint(leg, 'in'),
    outputMint: extractMint(leg, 'out'),
    program: extractProgram(leg),
    inAmount: typeof leg?.inAmount === 'string' ? leg.inAmount : undefined,
    outAmount: typeof leg?.outAmount === 'string' ? leg.outAmount : undefined,
  }))
}

export function SwapRouting({ quote }: SwapRoutingProps) {
  const routerName = quote.router
  const legs = getLegs(quote.routePlan || [])

  if (!legs.length) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Routing</CardTitle>
          <CardDescription>No route data available.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">Routing</CardTitle>
          <CardDescription className="mt-1">Powered by Jupiter Ultra</CardDescription>
        </div>
        {routerName && <Badge variant="secondary">{routerName}</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto">
          {legs.map((leg, idx) => (
            <div key={`${leg.poolId ?? idx}-${idx}`} className={cn('flex items-center gap-2')}>
              <div className="flex flex-col items-start">
                <Badge variant="outline" className="text-xs">
                  {formatProgram(leg.program)}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatToken(leg.inputMint)} → {formatToken(leg.outputMint)}
                </div>
              </div>
              {idx < legs.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SwapRouting
