'use client'

import { ReactNode, useMemo } from 'react'
import { useRequest } from '@solana/react'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'
import { useSolana } from '@/components/provider'

export function ClusterUiChecker({ children }: { children: ReactNode }) {
  const { client, cluster } = useSolana()
  const source = useMemo(() => client.rpc.getHealth(), [client])
  const health = useRequest(source)
  if (health.status === 'error')
    return (
      <AppAlert
        className="mb-4"
        action={
          <Button variant="outline" onClick={() => health.refresh()}>
            Refresh
          </Button>
        }
      >
        Error connecting to cluster <strong>{cluster.label}</strong>.
      </AppAlert>
    )
  return children
}
