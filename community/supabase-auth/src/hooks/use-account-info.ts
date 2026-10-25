'use client'

import { useMemo } from 'react'
import { address as toAddress } from '@solana/kit'
import { useRequest, useSubscription } from '@solana/react'
import { useSolana } from '@/components/provider'

export function useAccountInfo(address: string) {
  const { client } = useSolana()
  const source = useMemo(
    () => client.rpc.getAccountInfo(toAddress(address), { encoding: 'base64', commitment: 'confirmed' }),
    [client, address],
  )
  const stream = useMemo(
    () =>
      client.rpcSubscriptions.accountNotifications(toAddress(address), { encoding: 'base64', commitment: 'confirmed' }),
    [client, address],
  )
  const query = useRequest(source)
  const subscription = useSubscription(stream)
  // Do not let a late initial response overwrite a newer subscription value.
  const data =
    !query.data || (subscription.data && subscription.data.context.slot >= query.data.context.slot)
      ? (subscription.data ?? query.data)
      : query.data
  return {
    ...query,
    data,
    status: data ? ('success' as const) : query.status,
    refresh: () => {
      query.refresh()
      if (subscription.status === 'error') subscription.reconnect()
    },
  }
}
