'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PaymentQRDisplay } from './payment-qr-display'
import { PaymentStatusBadge } from './payment-status-badge'
import { PaymentDetails } from './payment-details'
// TODO: Migrate to Address from @solana/client when @solana/pay adds support for it.
// Currently using PublicKey type to match PaymentRequest interface from @solana/pay.
import type { PublicKey } from '@solana/web3.js'
import type { PaymentStatus } from '@/lib/solana-pay/types'
import type { CartItem } from '@/store/types/cart'
import { AppExplorerLink } from '../app-explorer-link'

interface CheckoutDialogProps {
  isOpen: boolean
  onClose?: () => void
  amount: number
  items?: CartItem[]
  paymentRequest: { url: URL; reference: PublicKey; recipient: PublicKey } | null
  qrCode: { append: (element: HTMLElement) => void } | null
  signature: string | null
  memo: string | null
  isSearching: boolean
  paymentFound: boolean
  isGenerating: boolean
  error: Error | null
}

export function CheckoutDialog({
  isOpen,
  onClose,
  amount,
  items,
  paymentRequest,
  qrCode,
  signature,
  memo,
  isSearching,
  paymentFound,
  isGenerating,
  error,
}: CheckoutDialogProps) {
  const paymentStatus: PaymentStatus = paymentFound
    ? 'confirmed'
    : isSearching
      ? 'pending'
      : isGenerating
        ? 'pending'
        : 'idle'

  const getDialogTitle = () => {
    if (paymentFound) return 'Payment Confirmed!'
    if (error) return 'Payment Failed'
    return 'Pay with Solana'
  }

  const getDialogDescription = () => {
    if (paymentFound) return 'Your payment has been confirmed successfully'
    if (isSearching) return 'Waiting for your payment...'
    if (isGenerating) return 'Generating payment request...'
    if (error) return error.message || 'There was an error processing your payment'
    return 'Scan the QR code with your Solana wallet to complete the payment'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base sm:text-lg truncate">{getDialogTitle()}</DialogTitle>
            <PaymentStatusBadge status={paymentStatus} className="shrink-0" />
          </div>
          <DialogDescription className="text-sm wrap-break-word">{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-x-hidden">
          {paymentFound && signature ? (
            <div className="space-y-4">
              <PaymentDetails amount={amount} items={items} recipient={paymentRequest?.recipient.toBase58()} />
              {memo && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Order Details</p>
                  <p className="text-sm font-medium">{memo}</p>
                </div>
              )}
              <div className="flex flex-col items-center gap-3 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Transaction confirmed!</p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <AppExplorerLink path={signature} type="tx" label="View Transaction" />
                </Button>
                <Button onClick={onClose} className="w-full">
                  Done
                </Button>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">{error.message || 'An unknown error occurred'}</p>
              </div>
            </div>
          ) : (
            <>
              <PaymentQRDisplay qrCode={qrCode} url={paymentRequest?.url} />
              <PaymentDetails amount={amount} items={items} recipient={paymentRequest?.recipient.toBase58()} />
            </>
          )}
        </div>

        {!paymentFound && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
