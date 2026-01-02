'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePurchaseHistory } from '@/hooks/use-purchase-history'
import { products } from '@/store/data'
import { useSolana } from '@/components/solana/use-solana'
import { ExternalLink, RefreshCw, Package, Loader2 } from 'lucide-react'

interface PurchasesDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function PurchasesDrawer({ isOpen, onClose }: PurchasesDrawerProps) {
  const { connected } = useSolana()
  const { purchases, isLoading, refresh } = usePurchaseHistory()

  const getProductDetails = (productId: string) => {
    return products.find((p) => p.id === productId)
  }

  if (!connected) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Purchase History</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">Connect your wallet to view your purchase history</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col px-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Purchase History</SheetTitle>
            <Button variant="ghost" size="icon" onClick={refresh} disabled={isLoading} className="h-8 w-8">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </SheetHeader>

        {isLoading && purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading purchases...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">No purchases yet</p>
            <p className="text-xs text-muted-foreground text-center">
              Your purchase history will appear here after you make a purchase
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {purchases.map((purchase) => {
              const date = new Date(purchase.timestamp * 1000)
              const totalItems = purchase.items.reduce((sum, item) => sum + item.quantity, 0)

              // Format date using native JS
              const formattedDate =
                date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) +
                ' at ' +
                date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })

              return (
                <Card key={purchase.signature} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">Order #{purchase.orderId}</h3>
                      <p className="text-xs text-muted-foreground">{formattedDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${purchase.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {totalItems} item{totalItems !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {purchase.items.map((item, idx) => {
                      const product = getProductDetails(item.productId)
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm py-1 border-t">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product?.name || `Product ${item.productId}`}</p>
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size} • Color: {item.color}
                            </p>
                          </div>
                          <p className="text-sm ml-2">×{item.quantity}</p>
                        </div>
                      )
                    })}
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a
                      href={`https://itx-indexer.com/indexer/${purchase.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Receipt on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </Card>
              )
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
