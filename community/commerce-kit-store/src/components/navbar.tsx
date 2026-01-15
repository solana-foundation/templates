'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCart } from '@/store/providers/cart-provider'
import { useDrawer } from '@/store/hooks/use-drawer'
import { CartDrawer } from '@/store/components'
import { WalletUI } from './wallet-ui'

export function Navbar() {
  const { cart } = useCart()
  const cartDrawer = useDrawer()

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="font-bold text-lg hidden sm:inline-block">Solana Pay Store</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={cartDrawer.open}
                title="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cart.itemCount}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>

              <WalletUI />
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={cartDrawer.isOpen} onClose={cartDrawer.close} />
    </>
  )
}
