'use client'

import { useState, useMemo } from 'react'
import type { Product, ProductImage, SelectedVariation } from '@/store/types'

type ViewType = 'front' | 'back'

interface UseProductViewReturn {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  toggleView: () => void
  productImage: ProductImage | undefined
  currentImage: string | null
  currentHighResImage: string | null
  hasBackImage: boolean
}

/**
 * Manages product image display and view state (front/back)
 * Handles image selection based on color and view
 */
export function useProductView(product: Product | null, selectedVariation: SelectedVariation): UseProductViewReturn {
  const [currentView, setCurrentView] = useState<ViewType>('front')

  const productImage = useMemo(() => {
    if (!product || !selectedVariation.color) return undefined
    return product.images[selectedVariation.color]
  }, [product, selectedVariation.color])

  const hasBackImage = useMemo(() => {
    return Boolean(productImage?.back)
  }, [productImage])

  const currentImage = useMemo(() => {
    if (!product) return null
    if (!productImage) return product.imageUrl || null

    const image = currentView === 'front' ? productImage.front : productImage.back || productImage.front
    return image || null
  }, [product, productImage, currentView])

  const currentHighResImage = useMemo(() => {
    if (!product) return null
    if (!productImage) return product.imageUrl || null

    if (currentView === 'front') {
      return productImage.frontHighRes || productImage.front || null
    }
    return productImage.backHighRes || productImage.back || productImage.front || null
  }, [product, productImage, currentView])

  const toggleView = () => {
    if (hasBackImage) {
      setCurrentView((prev) => (prev === 'front' ? 'back' : 'front'))
    }
  }

  return {
    currentView,
    setCurrentView,
    toggleView,
    productImage,
    currentImage,
    currentHighResImage,
    hasBackImage,
  }
}
