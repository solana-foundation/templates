import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { type AirdropProgress } from '@/features/airdrop/data-access/airdrop-types'

interface AirdropProgressProps {
  progress: AirdropProgress
  mintAddress: string
  clusterParam?: string
}

export function AirdropProgressDisplay({ progress, mintAddress, clusterParam = 'devnet' }: AirdropProgressProps) {
  const percentage = (progress.currentBatch / progress.totalBatches) * 100
  const totalProcessed = progress.successfulMints + progress.failedMints

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airdrop Progress</CardTitle>
        <CardDescription>
          Batch {progress.currentBatch} of {progress.totalBatches} • {totalProcessed} processed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={percentage} />
        {progress.signatures.map((signature) => (
          <a
            key={signature}
            href={`https://explorer.solana.com/tx/${signature}?cluster=${clusterParam}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all text-xs underline"
          >
            {signature}
          </a>
        ))}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Successful</p>
            <p className="text-2xl font-bold text-green-600">{progress.successfulMints}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-red-600">{progress.failedMints}</p>
          </div>
        </div>

        {progress.successfulMints > 0 && (
          <div className="pt-4 border-t space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">View on Solana Explorer</p>
              <a
                href={`https://explorer.solana.com/address/${mintAddress}?cluster=${clusterParam}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs font-mono text-blue-600 hover:underline break-all"
              >
                {mintAddress}
              </a>
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                <strong>About ZK Compression:</strong> Transactions are visible on Solana Explorer. Query compressed
                recipient balances through the ZK Compression indexer.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
