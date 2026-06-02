'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

type CopyCommandButtonProps = {
  command: string
  label?: string
}

export function CopyCommandButton({ command, label = 'Copy command' }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copyCommand() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copyCommand} aria-label={label}>
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}
