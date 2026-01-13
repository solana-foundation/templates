'use client'

import { useCart } from '@/store/providers/cart-provider'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { HeadlessCheckoutDialog } from '@/components/checkout'
import { useHeadlessCheckout } from '@/hooks'
import Image from 'next/image'
import { Trash2, Minus, Plus, CheckCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { AppExplorerLink } from '@/components/app-explorer-link'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  const generateOrderMemo = () => {
    const orderId = Date.now().toString().slice(-8)
    const items = cart.items.map((item) => `${item.product.id}:${item.size}:${item.color}:${item.quantity}`).join(',')
    return `Order #${orderId}: ${items}`
  }

  const checkout = useHeadlessCheckout({
    label: 'Solana Pay Store',
    message: `Thanks for your purchase of ${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''}!`,
    onPaymentFound: (signature) => {
      toast.success('Payment confirmed!', {
        description: <AppExplorerLink path={signature} type="tx" label="View Transaction" />,
        icon: <CheckCircleIcon className="w-4 h-4" />,
      })
    },
  })

  const handleCheckout = () => {
    checkout.openCartCheckout(cart.items, generateOrderMemo())
  }

  const handleCheckoutClose = () => {
    if (checkout.isConfirmed) {
      clearCart()
    }
    checkout.closeCheckout()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart {cart.itemCount > 0 && `(${cart.itemCount})`}</SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {cart.items.map((item) => {
                const colorImage = item.product.images[item.color]
                const imageUrl = colorImage?.front || item.product.imageUrl

                return (
                  <div key={item.variationId} className="flex gap-4 border-b pb-4 px-4">
                    <div className="relative w-20 h-20 shrink-0">
                      <Image
                        src={imageUrl}
                        alt={`${item.product.name} - ${item.color}`}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="font-bold text-sm mt-1">${item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.variationId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.variationId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 ml-auto"
                          onClick={() => removeFromCart(item.variationId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t pt-4 space-y-4 p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${cart.total.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{cart.total.toFixed(2)} USDC</div>
                  </div>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={
                  cart.items.length === 0 || checkout.isGenerating || checkout.isPending || checkout.isVerifying
                }
              >
                {checkout.isGenerating ? 'Generating...' : 'Pay with USDC'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">Powered by Solana Commerce Kit</p>
            </div>

            <HeadlessCheckoutDialog
              isOpen={checkout.isOpen}
              onClose={handleCheckoutClose}
              amount={checkout.amount}
              items={cart.items}
              status={checkout.status}
              paymentRequest={checkout.paymentRequest}
              signature={checkout.signature}
              error={checkout.error}
              verificationResult={checkout.verificationResult}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
