'use client'

import { useState } from 'react'
import type { Product } from '@/store/types'

interface UseProductSelectionReturn {
  selectedProduct: Product | null
  selectProduct: (product: Product) => void
  clearSelection: () => void
}

/**
 * Manages which product is currently selected
 * Core hook for product selection state
 */
export function useProductSelection(): UseProductSelectionReturn {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const selectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  const clearSelection = () => {
    setSelectedProduct(null)
  }

  return {
    selectedProduct,
    selectProduct,
    clearSelection,
  }
}
