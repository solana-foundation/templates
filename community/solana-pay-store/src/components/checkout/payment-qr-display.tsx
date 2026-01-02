'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface PaymentQRDisplayProps {
  qrCode: { append: (element: HTMLElement) => void } | null
  url?: URL | null
}

/**
 * Displays a Solana Pay QR code for scanning with a mobile wallet.
 */
export function PaymentQRDisplay({ qrCode, url }: PaymentQRDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.append(qrRef.current)
    }
  }, [qrCode])

  if (!qrCode) {
    return (
      <Card className="flex items-center justify-center p-8 bg-muted/50">
        <div className="text-center text-muted-foreground">Generating QR code...</div>
      </Card>
    )
  }

  return (
    <div className="space-y-3 w-full overflow-hidden">
      <Card className="flex items-center justify-center p-3 sm:p-6 bg-white dark:bg-gray-900 overflow-hidden w-full">
        <div
          ref={qrRef}
          className="flex items-center justify-center w-full max-w-[280px] sm:max-w-[400px]"
          style={{ aspectRatio: '1/1' }}
        />
      </Card>

      {url && (
        <div className="block md:hidden text-center space-y-2 overflow-hidden">
          <p className="text-xs text-muted-foreground hidden sm:block">Or click to open in your wallet:</p>
          <p className="text-xs text-muted-foreground sm:hidden">Tap to open in your wallet:</p>
          <a
            href={url.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline break-all block px-2 overflow-hidden"
          >
            {url.toString().substring(0, 45)}...
          </a>
        </div>
      )}
    </div>
  )
}
