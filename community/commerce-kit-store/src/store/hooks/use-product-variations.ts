'use client'

import { useState, useEffect, useMemo } from 'react'
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
  const [selectedVariation, setSelectedVariation] = useState<SelectedVariation>({
    size: null,
    color: null,
  })

  useEffect(() => {
    if (product) {
      setSelectedVariation({
        size: null,
        color: product.variations[0]?.color || null,
      })
    }
  }, [product])

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
    setSelectedVariation((prev) => ({ ...prev, size }))
  }

  const setSelectedColor = (color: string) => {
    setSelectedVariation((prev) => ({ ...prev, color }))
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
