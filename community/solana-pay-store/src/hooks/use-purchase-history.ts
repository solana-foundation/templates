'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSolanaClient } from '@solana/react-hooks'
import { toAddress } from '@solana/client'
import { useSolana } from '@/components/solana/use-solana'
import { products } from '@/store/data'

export interface Purchase {
  signature: string
  orderId: string
  items: Array<{
    productId: string
    size: string
    color: string
    quantity: number
  }>
  amount: number
  timestamp: number
}

function parseMemo(memo: string) {
  const match = memo.match(/Order #(\d+): (.+)/)
  if (!match) return null

  const [, orderId, itemsStr] = match
  const items = itemsStr.split(',').map((itemStr) => {
    const [productId, size, color, quantity] = itemStr.split(':')
    return { productId, size, color, quantity: parseInt(quantity, 10) }
  })

  return { orderId, items }
}

function calculateAmount(items: Purchase['items']) {
  return items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId)
    return total + (product?.basePrice || 0) * item.quantity
  }, 0)
}

export function usePurchaseHistory() {
  const { publicKey: address } = useSolana()
  const client = useSolanaClient()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPurchases = useCallback(async () => {
    if (!address || !client) {
      setPurchases([])
      return
    }

    setIsLoading(true)

    try {
      const addressObj = toAddress(address)
      const signatures = await client.runtime.rpc.getSignaturesForAddress(addressObj, { limit: 10 }).send()

      const purchaseList: Purchase[] = (signatures ?? [])
        .filter((sig) => sig.memo?.includes('Order #') && !sig.err)
        .map((sig) => {
          const parsed = parseMemo(sig.memo!)
          if (!parsed) return null

          return {
            signature: String(sig.signature),
            orderId: parsed.orderId,
            items: parsed.items,
            amount: calculateAmount(parsed.items),
            timestamp: Number(sig.blockTime) || Date.now() / 1000,
          }
        })
        .filter((p): p is Purchase => p !== null)
        .sort((a, b) => b.timestamp - a.timestamp)

      setPurchases(purchaseList)
    } catch (err) {
      console.error('Error fetching purchase history:', err)
      setPurchases([])
    } finally {
      setIsLoading(false)
    }
  }, [address, client])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  return {
    purchases,
    isLoading,
    refresh: fetchPurchases,
  }
}
