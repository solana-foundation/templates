'use client'

import { useMemo, useState } from 'react'
import type { Product, SelectedVariation } from '@/store/types'

interface UseProductVariationsReturn {
  selectedVariation: SelectedVariation
  setSelectedSize: (size: string) => void
  setSelectedColor: (color: string) => void
  setSelectedVariation: (variation: SelectedVariation) => void
  availableSizes: string[]
  availableColors: string[]
  stockAvailable: number
  isSelectionComplete: boolean
  canAddToCart: boolean
  currentVariation: Product['variations'][0] | undefined
}

/**
 * Manages product variations (size, color) and stock availability
 * Handles the business logic for product configuration
 */
export function useProductVariations(product: Product | null): UseProductVariationsReturn {
  const defaultVariation = useMemo<SelectedVariation>(
    () => ({ size: null, color: product?.variations[0]?.color || null }),
    [product],
  )
  const [selection, setSelection] = useState<{ productId: string | null; variation: SelectedVariation }>({
    productId: null,
    variation: defaultVariation,
  })
  const productId = product?.id ?? null
  const selectedVariation = selection.productId === productId ? selection.variation : defaultVariation

  const updateSelectedVariation = (update: (current: SelectedVariation) => SelectedVariation) => {
    setSelection((current) => ({
      productId,
      variation: update(current.productId === productId ? current.variation : defaultVariation),
    }))
  }

  const setSelectedVariation = (variation: SelectedVariation) => {
    setSelection({ productId, variation })
  }

  const availableSizes = useMemo(() => {
    if (!product) return []
    return Array.from(new Set(product.variations.map((v) => v.size)))
  }, [product])

  const availableColors = useMemo(() => {
    if (!product) return []
    return Array.from(new Set(product.variations.map((v) => v.color)))
  }, [product])

  const currentVariation = useMemo(() => {
    if (!product || !selectedVariation.size || !selectedVariation.color) {
      return undefined
    }
    return product.variations.find((v) => v.size === selectedVariation.size && v.color === selectedVariation.color)
  }, [product, selectedVariation])

  const stockAvailable = useMemo(() => {
    return currentVariation?.stock ?? 0
  }, [currentVariation])

  const isSelectionComplete = useMemo(
    () => Boolean(selectedVariation.size && selectedVariation.color),
    [selectedVariation],
  )

  const canAddToCart = useMemo(() => isSelectionComplete && stockAvailable > 0, [isSelectionComplete, stockAvailable])

  const setSelectedSize = (size: string) => {
    updateSelectedVariation((current) => ({ ...current, size }))
  }

  const setSelectedColor = (color: string) => {
    updateSelectedVariation((current) => ({ ...current, color }))
  }

  return {
    selectedVariation,
    setSelectedSize,
    setSelectedColor,
    setSelectedVariation,
    availableSizes,
    availableColors,
    stockAvailable,
    isSelectionComplete,
    canAddToCart,
    currentVariation,
  }
}
