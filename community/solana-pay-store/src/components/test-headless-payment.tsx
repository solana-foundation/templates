'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useHeadlessCheckout, type HeadlessPaymentStatus } from '@/hooks/use-headless-checkout'
import { useCart } from '@/store/providers/cart-provider'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { Loader2, CheckCircle2, XCircle, QrCode, ShoppingCart } from 'lucide-react'

const TEST_AMOUNTS = [0.01, 0.1, 1.0, 5.0]

function StatusBadge({ status }: { status: HeadlessPaymentStatus }) {
  const config: Record<
    HeadlessPaymentStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    idle: { label: 'Ready', variant: 'secondary' },
    generating: { label: 'Generating...', variant: 'outline' },
    pending: { label: 'Awaiting Payment', variant: 'default' },
    verifying: { label: 'Verifying...', variant: 'outline' },
    confirmed: { label: 'Confirmed', variant: 'default' },
    failed: { label: 'Failed', variant: 'destructive' },
  }

  const { label, variant } = config[status]
  const showSpinner = status === 'generating' || status === 'verifying'
  const showCheck = status === 'confirmed'
  const showX = status === 'failed'

  return (
    <Badge variant={variant} className="gap-1">
      {showSpinner && <Loader2 className="h-3 w-3 animate-spin" />}
      {showCheck && <CheckCircle2 className="h-3 w-3" />}
      {showX && <XCircle className="h-3 w-3" />}
      {label}
    </Badge>
  )
}

export function TestHeadlessPayment() {
  const [selectedAmount, setSelectedAmount] = useState<number>(TEST_AMOUNTS[0])
  const { cart, clearCart } = useCart()

  const {
    isOpen,
    amount,
    status,
    paymentRequest,
    signature,
    error,
    verificationResult,
    isGenerating,
    isPending,
    isVerifying,
    isConfirmed,
    openCheckout,
    openCartCheckout,
    closeCheckout,
  } = useHeadlessCheckout({
    label: 'Commerce Kit Test',
    message: 'Testing headless payment flow',
    memo: 'test-headless-payment',
    onPaymentFound: (sig) => console.log('Payment found:', sig),
    onPaymentVerified: (result) => console.log('Payment verified:', result),
  })

  const handleStartPayment = () => openCheckout(selectedAmount)

  const handleCartPayment = () => {
    const orderId = Date.now().toString().slice(-8)
    const itemsMemo = cart.items
      .map((item) => `${item.product.id}:${item.size}:${item.color}:${item.quantity}`)
      .join(',')
    openCartCheckout(cart.items, `Order #${orderId}: ${itemsMemo}`)
  }

  const handleCloseCheckout = () => {
    if (isConfirmed) clearCart()
    closeCheckout()
  }

  const isPaymentInProgress = isGenerating || isPending || isVerifying

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Test Configuration
            <StatusBadge status={status} />
          </CardTitle>
          <CardDescription>
            Select an amount and initiate a test payment using Commerce Kit headless flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
            <div className="flex flex-wrap gap-2">
              {TEST_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  variant={selectedAmount === amt ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedAmount(amt)}
                >
                  ${amt.toFixed(2)}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button onClick={handleStartPayment} disabled={isPaymentInProgress} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Payment...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Pay ${selectedAmount.toFixed(2)} USDC (Fixed Amount)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart Payment Test
            </span>
            {cart.itemCount > 0 && <Badge variant="secondary">{cart.itemCount} items</Badge>}
          </CardTitle>
          <CardDescription>
            Test the headless checkout with items from your cart using createCartRequest()
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Add some items from the store to test cart checkout.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.variationId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} ({item.size}, {item.color}) x{item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${cart.total.toFixed(2)} USDC</span>
                </div>
              </div>
              <Button
                onClick={handleCartPayment}
                disabled={isPaymentInProgress || cart.items.length === 0}
                className="w-full"
                variant="secondary"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Cart Payment...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Pay Cart (${cart.total.toFixed(2)} USDC)
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technical Details</CardTitle>
          <CardDescription>Implementation info for this test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2 font-mono text-muted-foreground">
            <p>
              <span className="text-foreground">Package:</span> @solana-commerce/headless
            </p>
            <p>
              <span className="text-foreground">RPC Client:</span> @solana/client
            </p>
            <p>
              <span className="text-foreground">Key Generation:</span> @solana/kit
            </p>
            <p>
              <span className="text-foreground">Token:</span> USDC (Mainnet)
            </p>
            <p>
              <span className="text-foreground">Functions:</span>
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>createBuyNowRequest()</li>
              <li>createCartRequest()</li>
              <li>createSolanaPayRequest()</li>
              <li>verifyPayment()</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={handleCloseCheckout}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2">
              <DialogTitle>{isConfirmed ? 'Payment Confirmed!' : error ? 'Payment Failed' : 'Scan to Pay'}</DialogTitle>
              <StatusBadge status={status} />
            </div>
            <DialogDescription>
              {isConfirmed && 'Your payment has been verified successfully'}
              {isPending && 'Scan the QR code with your Solana wallet'}
              {isVerifying && 'Verifying your payment on-chain...'}
              {error && error.message}
              {status === 'generating' && 'Generating payment request...'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {paymentRequest && !isConfirmed && !error && (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div
                    className="w-64 h-64 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: paymentRequest.qr }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">${amount.toFixed(2)} USDC</p>
                  {isPending && <p className="text-sm text-muted-foreground mt-1">Waiting for payment...</p>}
                  {isVerifying && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Verifying transaction...
                    </p>
                  )}
                </div>
              </div>
            )}

            {isConfirmed && signature && (
              <div className="flex flex-col items-center gap-4 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg overflow-hidden">
                <CheckCircle2 className="h-12 w-12 text-green-600 shrink-0" />
                <div className="text-center">
                  <p className="font-medium text-green-900 dark:text-green-100">Payment Verified!</p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">${amount.toFixed(2)} USDC received</p>
                </div>

                {verificationResult && (
                  <div className="w-full p-3 bg-white dark:bg-black/20 rounded border text-xs font-mono overflow-hidden">
                    <p className="text-muted-foreground">Verification Result:</p>
                    <pre className="mt-1 overflow-x-auto max-w-full whitespace-pre-wrap break-all">
                      {JSON.stringify(verificationResult, null, 2)}
                    </pre>
                  </div>
                )}

                <Button variant="outline" size="sm" asChild className="w-full">
                  <AppExplorerLink path={signature} type="tx" label="View on Explorer" />
                </Button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive font-medium">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error.message}</p>
              </div>
            )}

            {paymentRequest && !isConfirmed && (
              <div className="p-3 bg-muted rounded-lg text-xs font-mono space-y-1">
                <p>
                  <span className="text-muted-foreground">Reference:</span>{' '}
                  <span className="break-all">{paymentRequest.reference}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Recipient:</span>{' '}
                  <span className="break-all">{paymentRequest.recipient}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Token:</span> {paymentRequest.splToken}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {!isConfirmed && (
                <Button variant="outline" onClick={handleCloseCheckout} className="flex-1">
                  Cancel
                </Button>
              )}
              {isConfirmed && (
                <Button onClick={handleCloseCheckout} className="flex-1">
                  Done
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
