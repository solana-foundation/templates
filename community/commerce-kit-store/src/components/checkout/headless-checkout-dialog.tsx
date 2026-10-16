'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { Loader2, CheckCircle2, XCircle, Send } from 'lucide-react'
import { useWalletPayment } from '@/hooks/use-wallet-payment'
import { WalletUI } from '@/components/wallet-ui'
import type { HeadlessPaymentStatus, HeadlessPaymentRequest } from '@/hooks/use-headless-checkout'
import type { CartItem } from '@/store/types/cart'

interface HeadlessCheckoutDialogProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  items?: CartItem[]
  status: HeadlessPaymentStatus
  paymentRequest: HeadlessPaymentRequest | null
  signature: string | null
  error: Error | null
  verificationResult: { verified: boolean; signature?: string; error?: string } | null
}

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
  const isLoading = status === 'generating' || status === 'verifying'

  return (
    <Badge variant={variant} className="gap-1 shrink-0">
      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'failed' && <XCircle className="h-3 w-3" />}
      {label}
    </Badge>
  )
}

/**
 * Checkout dialog for Solana payments.
 * Displays QR code, payment status, and verification results.
 */
export function HeadlessCheckoutDialog({
  isOpen,
  onClose,
  amount,
  items,
  status,
  paymentRequest,
  signature,
  error,
}: HeadlessCheckoutDialogProps) {
  const isConfirmed = status === 'confirmed'
  const isPending = status === 'pending'
  const isVerifying = status === 'verifying'
  const isGenerating = status === 'generating'
  const isFailed = status === 'failed'
  const walletPayment = useWalletPayment(paymentRequest, isConfirmed)
  const cannotClose = walletPayment.busy || (walletPayment.submitted && !isConfirmed)
  const close = () => {
    if (!cannotClose) onClose()
  }

  const getTitle = () => {
    if (isConfirmed) return 'Payment Confirmed!'
    if (isFailed) return 'Payment Failed'
    return 'Pay with Solana'
  }

  const getDescription = () => {
    if (isConfirmed) return 'Your payment has been confirmed successfully'
    if (isPending) return 'Pay with your connected wallet or scan the QR code'
    if (isVerifying) return 'Verifying your payment on-chain...'
    if (isGenerating) return 'Generating payment request...'
    if (isFailed) return error?.message ?? 'Unable to complete checkout'
    return ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (cannotClose) e.preventDefault()
        }}
        onPointerDownOutside={(e) => {
          if (cannotClose) e.preventDefault()
        }}
        className="w-[95vw] max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto overflow-x-hidden"
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base sm:text-lg truncate">{getTitle()}</DialogTitle>
            <StatusBadge status={status} />
          </div>
          <DialogDescription className="text-sm">{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-x-hidden">
          {isConfirmed && signature ? (
            <div className="space-y-4">
              {items && items.length > 0 && (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.variationId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} ({item.size}, {item.color}) x{item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${amount.toFixed(2)} USDC</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-3 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle2 className="h-12 w-12 text-green-600 shrink-0" />
                <div className="text-center">
                  <p className="font-medium text-green-900 dark:text-green-100">Payment Verified!</p>
                  <p className="text-sm text-green-700 dark:text-green-300">${amount.toFixed(2)} USDC received</p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <AppExplorerLink path={signature} type="tx" label="View Transaction" />
                </Button>
                <Button onClick={onClose} className="w-full">
                  Done
                </Button>
              </div>
            </div>
          ) : isFailed ? (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">{error?.message ?? 'Unable to complete checkout'}</p>
              </div>
              <Button variant="outline" disabled={cannotClose} onClick={close} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <>
              {paymentRequest && (
                <div className="flex flex-col items-center gap-4">
                  <WalletUI />
                  {error && (
                    <p role="alert" className="text-sm text-muted-foreground">
                      Payment verification is temporarily unavailable. Retrying automatically. If you already paid, do
                      not pay again.
                    </p>
                  )}
                  <Button
                    className="w-full"
                    disabled={!isPending || walletPayment.busy || walletPayment.submitted}
                    onClick={() => void walletPayment.pay()}
                  >
                    {walletPayment.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {walletPayment.busy
                      ? 'Confirming payment...'
                      : walletPayment.submitted
                        ? 'Waiting for payment verification...'
                        : 'Pay with connected wallet'}
                  </Button>
                  {walletPayment.error && (
                    <p role="alert" className="text-sm text-destructive">
                      {walletPayment.error}
                    </p>
                  )}
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
                  <div className="w-full min-w-0 text-xs text-muted-foreground">
                    <p>Payment reference</p>
                    <p className="break-all font-mono">{paymentRequest.reference}</p>
                  </div>
                </div>
              )}

              {items && items.length > 0 && (
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  {items.map((item) => (
                    <div key={item.variationId} className="flex justify-between">
                      <span className="text-muted-foreground truncate mr-2">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-medium shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" disabled={cannotClose} onClick={close}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
