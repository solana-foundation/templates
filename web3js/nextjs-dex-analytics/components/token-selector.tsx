'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import type { Token } from '@/components/swap-interface'

interface TokenSelectorProps {
  selectedToken: Token
  onSelectToken: (token: Token) => void
  tokens: Token[]
}

export function TokenSelector({ selectedToken, onSelectToken, tokens }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex-shrink-0">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-12 gap-2 rounded-full border-border bg-secondary/50 px-4 hover:bg-secondary"
          >
            <span className="text-2xl">{selectedToken.icon}</span>
            <span className="font-semibold">{selectedToken.symbol}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} alignOffset={0} className="w-56 bg-popover border-border">
          {tokens.map((token) => (
            <DropdownMenuItem
              key={token.symbol}
              onClick={() => {
                onSelectToken(token)
                setOpen(false)
              }}
              className="flex items-center justify-between gap-3 cursor-pointer hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{token.icon}</span>
                <div className="flex flex-col">
                  <span className="font-semibold">{token.symbol}</span>
                  <span className="text-xs text-muted-foreground">{token.name}</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{token.balance.toFixed(4)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
