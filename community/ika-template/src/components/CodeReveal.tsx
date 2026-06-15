import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Code2, ChevronDown } from 'lucide-react'

import { CopyButton } from '@/components/CopyButton'
import { cn } from '@/lib/utils'

/**
 * A collapsible "here's the real SDK call" panel. The whole template is a
 * teaching tool, so every async action shows the exact code that ran.
 */
export function CodeReveal({ title = 'Show the code', code }: { title?: string; code: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-border-low bg-cream/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <Code2 className="size-4 text-muted" />
          {title}
        </span>
        <ChevronDown className={cn('size-4 text-muted transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative border-t">
              <div className="absolute right-2 top-2">
                <CopyButton value={code} />
              </div>
              <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed">
                <code className="font-mono">{code}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
