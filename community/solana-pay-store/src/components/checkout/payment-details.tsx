import { Card } from '@/components/ui/card'
import type { CartItem } from '@/store/types/cart'

interface PaymentDetailsProps {
  amount: number
  items?: CartItem[]
  recipient?: string
}

/**
 * Displays payment details including amount, items, and recipient information.
 */
export function PaymentDetails({ amount, items, recipient }: PaymentDetailsProps) {
  return (
    <Card className="p-3 sm:p-4 space-y-3 bg-muted/50 w-full overflow-hidden">
      <div className="space-y-2 overflow-hidden">
        <h3 className="font-semibold text-xs sm:text-sm text-muted-foreground">Order Summary</h3>

        {items && items.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {items.map((item) => (
              <div key={item.variationId} className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-muted-foreground truncate">
                  {item.product.name} ({item.size}, {item.color}) × {item.quantity}
                </span>
                <span className="font-medium whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-2 border-t">
          <span className="font-semibold text-sm sm:text-base">Total</span>
          <span className="font-bold text-base sm:text-lg">{amount.toFixed(2)} USDC</span>
        </div>
      </div>

      {recipient && (
        <div className="pt-2 border-t overflow-hidden">
          <p className="text-xs text-muted-foreground">Recipient</p>
          <p className="text-[10px] sm:text-xs font-mono break-all overflow-wrap-anywhere">{recipient}</p>
        </div>
      )}
    </Card>
  )
}
