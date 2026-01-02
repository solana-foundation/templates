import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { PaymentStatus } from '@/lib/solana-pay/types'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

/**
 * Displays the current payment status with an appropriate icon and color.
 */
export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const statusConfig = {
    idle: {
      label: 'Ready',
      icon: Clock,
      variant: 'secondary' as const,
      animated: false,
      success: false,
    },
    pending: {
      label: 'Waiting for payment',
      icon: Loader2,
      variant: 'default' as const,
      animated: true,
      success: false,
    },
    confirming: {
      label: 'Confirming',
      icon: Loader2,
      variant: 'default' as const,
      animated: true,
      success: false,
    },
    confirmed: {
      label: 'Payment confirmed',
      icon: CheckCircle2,
      variant: 'default' as const,
      animated: false,
      success: true,
    },
    failed: {
      label: 'Payment failed',
      icon: XCircle,
      variant: 'destructive' as const,
      animated: false,
      success: false,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-2 ${config.success ? 'bg-green-500 hover:bg-green-600' : ''} ${className}`}
    >
      <Icon className={`h-4 w-4 ${config.animated ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  )
}
