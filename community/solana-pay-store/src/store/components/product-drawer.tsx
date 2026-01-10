'use client'

import type { Product } from '@/store/types'
import { useProductVariations } from '@/store/hooks/use-product-variations'
import { useProductView } from '@/store/hooks/use-product-view'
import { useCart } from '@/store/providers/cart-provider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ProductGallery } from './product-gallery'
import { toast } from 'sonner'

interface ProductDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function ProductDrawer({ isOpen, onClose, product }: ProductDrawerProps) {
  const variations = useProductVariations(product)
  const view = useProductView(product, variations.selectedVariation)
  const { addToCart } = useCart()

  if (!product) return null

  const handleAddToCart = () => {
    if (!variations.selectedVariation.size || !variations.selectedVariation.color) {
      toast.error('Please select size and color')
      return
    }

    const success = addToCart(product, variations.selectedVariation.size, variations.selectedVariation.color, 1)

    if (success) {
      toast.success('Added to cart!')
      onClose()
    } else {
      toast.error('Failed to add to cart. Check stock availability.')
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-foreground/10 backdrop-blur-md border-none px-4">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl text-neutral-100">{product.name}</SheetTitle>
          <SheetDescription className="text-neutral-100/70">{product.description}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <ProductGallery
            productName={product.name}
            selectedColor={variations.selectedVariation.color}
            productImage={view.productImage}
            defaultImage={product.imageUrl}
            currentView={view.currentView}
            setCurrentView={view.setCurrentView}
          />
          <div className="space-y-4">
            <div>
              <h3 className="text-lg text-neutral-100 font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-3">
                {variations.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => variations.setSelectedSize(size)}
                    className={cn(
                      'h-10 min-w-10 rounded-md px-3 flex items-center text-neutral-100 justify-center text-sm font-medium transition-all cursor-pointer',
                      variations.selectedVariation.size === size
                        ? 'bg-foreground/80 text-neutral-100 hover:bg-foreground/90'
                        : 'bg-foreground/40 hover:bg-foreground/50 hover:text-neutral-100',
                    )}
                    aria-checked={variations.selectedVariation.size === size}
                    role="radio"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg text-neutral-100 font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-4">
                {variations.availableColors.map((color) => (
                  <div
                    key={color}
                    className={`w-10 h-10 cursor-pointer rounded transition-all ${
                      color === 'black' ? 'bg-black' : 'bg-white border border-gray-300'
                    } ${
                      variations.selectedVariation.color === color
                        ? 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                        : ''
                    }`}
                    onClick={() => variations.setSelectedColor(color)}
                    aria-label={color}
                    role="radio"
                    aria-checked={variations.selectedVariation.color === color}
                  />
                ))}
              </div>
            </div>

            <Button
              className="w-full cursor-pointer bg-foreground/80 text-background hover:bg-foreground/90"
              disabled={!variations.canAddToCart}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
