'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface AirdropControlsProps {
  isExecuting: boolean
  isAuthorized: boolean
  hasWallet: boolean
  maxBatchSize: number
  onExecute: (batchSize: number) => Promise<void>
}

export function AirdropControls({
  isExecuting,
  isAuthorized,
  hasWallet,
  maxBatchSize,
  onExecute,
}: AirdropControlsProps) {
  const [batchSize, setBatchSize] = useState(Math.min(10, maxBatchSize))

  const handleExecute = async () => {
    await onExecute(batchSize)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execute Airdrop</CardTitle>
        <CardDescription>Mint compressed tokens to all recipients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Batch Size: {batchSize}</label>
            <div className="group relative">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="invisible group-hover:visible absolute left-0 top-6 z-10 w-64 rounded-md bg-popover p-3 text-xs text-popover-foreground shadow-md border">
                Batch size controls how many recipients receive tokens per transaction. All recipients will receive
                tokens, batching just splits them across multiple transactions to optimize for transaction size limits.
                Smaller batches = more transactions but safer.
              </div>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max={maxBatchSize}
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full"
            disabled={isExecuting}
          />
          <p className="text-xs text-muted-foreground">Recipients per transaction (max: {maxBatchSize})</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExecute} disabled={!hasWallet || !isAuthorized || isExecuting} className="w-full">
          {isExecuting ? 'Executing...' : 'Execute Airdrop'}
        </Button>
      </CardFooter>
    </Card>
  )
}
