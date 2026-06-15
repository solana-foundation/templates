import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-7', className)}
      aria-label="Copy"
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check className="size-3.5 text-green-600 dark:text-green-500" /> : <Copy className="size-3.5" />}
    </Button>
  )
}
