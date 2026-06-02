'use client'

import { Check, Copy, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

type CopyCommandButtonProps = {
  command: string
  label?: string
}

export function CopyCommandButton({ command, label = 'Copy command' }: CopyCommandButtonProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }

    window.setTimeout(() => setCopyState('idle'), 1600)
  }

  const isCopied = copyState === 'copied'
  const isFailed = copyState === 'failed'

  return (
    <Button type="button" variant="outline" size="sm" onClick={copyCommand} aria-label={label}>
      {isCopied ? <Check className="size-3.5" aria-hidden="true" /> : null}
      {isFailed ? <TriangleAlert className="size-3.5" aria-hidden="true" /> : null}
      {!isCopied && !isFailed ? <Copy className="size-3.5" aria-hidden="true" /> : null}
      {isCopied ? 'Copied' : null}
      {isFailed ? 'Failed' : null}
      {!isCopied && !isFailed ? 'Copy' : null}
    </Button>
  )
}
