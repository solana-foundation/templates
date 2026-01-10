'use client'

import { useCallback } from 'react'
import type { Product } from '@/store/types'
import { useProductSelection } from './use-product-selection'
import { useDrawer } from './use-drawer'
import { useProductVariations } from './use-product-variations'
import { useProductView } from './use-product-view'

interface UseProductsReturn {
  selectedProduct: Product | null
  selectProduct: (product: Product) => void
  clearSelection: () => void
  handleProductClick: (product: Product) => void
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  selectedVariation: ReturnType<typeof useProductVariations>['selectedVariation']
  setSelectedSize: (size: string) => void
  setSelectedColor: (color: string) => void
  availableSizes: string[]
  availableColors: string[]
  stockAvailable: number
  isSelectionComplete: boolean
  canAddToCart: boolean
  currentVariation: ReturnType<typeof useProductVariations>['currentVariation']
  currentView: 'front' | 'back'
  setCurrentView: (view: 'front' | 'back') => void
  toggleView: () => void
  currentImage: string | null
  currentHighResImage: string | null
  productImage: ReturnType<typeof useProductView>['productImage']
  hasBackImage: boolean
}

/**
 * Composite hook that combines all product-related functionality
 *
 * This is a convenience hook that composes smaller, focused hooks:
 * - useProductSelection: Manages which product is selected
 * - useDrawer: Manages drawer/modal open/close state
 * - useProductVariations: Handles size/color selection and stock
 * - useProductView: Manages image display and front/back views
 *
 * Use this when you need full product functionality, or use
 * individual hooks for more granular control.
 */
export function useProducts(): UseProductsReturn {
  const selection = useProductSelection()
  const drawer = useDrawer()
  const variations = useProductVariations(selection.selectedProduct)
  const view = useProductView(selection.selectedProduct, variations.selectedVariation)

  const handleProductClick = useCallback(
    (product: Product) => {
      selection.selectProduct(product)
      drawer.open()
    },
    [selection, drawer],
  )

  return {
    selectedProduct: selection.selectedProduct,
    selectProduct: selection.selectProduct,
    clearSelection: selection.clearSelection,
    handleProductClick,
    isDrawerOpen: drawer.isOpen,
    openDrawer: drawer.open,
    closeDrawer: drawer.close,
    selectedVariation: variations.selectedVariation,
    setSelectedSize: variations.setSelectedSize,
    setSelectedColor: variations.setSelectedColor,
    availableSizes: variations.availableSizes,
    availableColors: variations.availableColors,
    stockAvailable: variations.stockAvailable,
    isSelectionComplete: variations.isSelectionComplete,
    canAddToCart: variations.canAddToCart,
    currentVariation: variations.currentVariation,
    currentView: view.currentView,
    setCurrentView: view.setCurrentView,
    toggleView: view.toggleView,
    currentImage: view.currentImage,
    currentHighResImage: view.currentHighResImage,
    productImage: view.productImage,
    hasBackImage: view.hasBackImage,
  }
}

export { useProductSelection } from './use-product-selection'
export { useDrawer } from './use-drawer'
export { useProductVariations } from './use-product-variations'
export { useProductView } from './use-product-view'
