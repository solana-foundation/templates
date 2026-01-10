'use client'

import Image from 'next/image'
import type { Product } from '@/store/types'
import { useProductSelection } from '@/store/hooks/use-product-selection'
import { useDrawer } from '@/store/hooks/use-drawer'
import { ProductDrawer } from './product-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { selectedProduct, selectProduct } = useProductSelection()
  const drawer = useDrawer()

  const handleProductClick = (product: Product) => {
    selectProduct(product)
    drawer.open()
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden border-none cursor-pointer hover:shadow-lg gap-0 transition-shadow bg-foreground/10 p-0"
            onClick={() => handleProductClick(product)}
          >
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg line-clamp-1 text-foreground">{product.name}</h2>
              <p className="text-muted-foreground line-clamp-2 text-sm mt-1">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <span className="font-bold text-foreground">${product.basePrice}</span>
              <Button size="sm" className="cursor-pointer bg-foreground/80 text-background hover:bg-foreground/90">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ProductDrawer isOpen={drawer.isOpen} onClose={drawer.close} product={selectedProduct} />
    </>
  )
}
