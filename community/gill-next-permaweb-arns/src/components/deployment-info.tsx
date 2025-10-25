'use client'

import { ARNS_CONFIG, ARWEAVE_CONFIG } from '@/lib/constants'
import { ExternalLink } from 'lucide-react'

export function DeploymentInfo() {
  const arnsUrl = `${ARWEAVE_CONFIG.arnsGateway.replace('https://', 'https://' + ARNS_CONFIG.name + '.')}`
  const txUrl = ARNS_CONFIG.txId ? `${ARWEAVE_CONFIG.gateway}/${ARNS_CONFIG.txId}` : null
  const explorerUrl = ARNS_CONFIG.txId ? `${ARWEAVE_CONFIG.explorer}/${ARNS_CONFIG.txId}` : null

  return (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Permaweb Deployment</h3>
        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
          Decentralized
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-1">ArNS Name</p>
          <a
            href={arnsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:underline"
          >
            {ARNS_CONFIG.name}.ar.io
            <ExternalLink className="h-3 w-3" />
          </a>
          <br />
          <a
            href={arnsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:underline"
          >
            {ARNS_CONFIG.name}.arweave.net
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {ARNS_CONFIG.undername && ARNS_CONFIG.undername !== '@' && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Subdomain</p>
            <p className="text-sm font-mono">{ARNS_CONFIG.undername}</p>
          </div>
        )}

        {txUrl && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
            <a
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:underline break-all"
            >
              {ARNS_CONFIG.txId.substring(0, 20)}...
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {explorerUrl && (
          <div>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View on ViewBlock
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          This dapp is permanently hosted on Arweave via the AR.IO Network. There are ~650 gateways where you can access
          your ArNS site as a subdomain.
        </p>
        <br />
        <p className="text-xs text-muted-foreground">
          You can find more information about AR.IO Network and ArNS at{' '}
          <a href="https://ar.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            ar.io
          </a>{' '}
          and{' '}
          <a href="https://arns.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            arns.app
          </a>
          .
        </p>
      </div>
    </div>
  )
}
