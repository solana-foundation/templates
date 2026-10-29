import { cn } from '@/lib/utils'

/** Renders a wallet-standard wallet icon, which is always a self-contained data URI. */
export function WalletUiIcon({ alt, className, src }: { alt: string; className?: string; src?: string }) {
  if (!src) {
    return <span className={cn('bg-muted inline-block size-4 rounded-sm', className)} />
  }
  return <img alt={alt} className={cn('size-4 rounded-sm', className)} src={src} />
}
