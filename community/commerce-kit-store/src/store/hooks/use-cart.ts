'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CartItem, Cart } from '@/store/types/cart'
import type { Product } from '@/store/types'

const CART_STORAGE_KEY = 'solana-pay-store-cart'

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return []
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

function calculateCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return { items, total, itemCount }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setItems(getStoredCart())
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      saveCart(items)
    }
  }, [items, isInitialized])

  const addToCart = useCallback((product: Product, size: string, color: string, quantity: number = 1): boolean => {
    const variation = product.variations.find((v) => v.size === size && v.color === color)

    if (!variation || variation.stock < quantity) {
      return false
    }

    const variationId = variation.variationId
    const price = product.basePrice + (variation.priceModifier || 0)

    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex((item) => item.variationId === variationId)

      if (existingItemIndex >= 0) {
        const newItems = [...currentItems]
        const existingItem = newItems[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity

        if (newQuantity > variation.stock) {
          return currentItems
        }

        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        }
        return newItems
      }

      const newItem: CartItem = {
        product,
        variationId,
        size,
        color,
        quantity,
        price,
      }

      return [...currentItems, newItem]
    })

    return true
  }, [])

  const removeFromCart = useCallback((variationId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.variationId !== variationId))
  }, [])

  const updateQuantity = useCallback(
    (variationId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(variationId)
        return
      }

      setItems((currentItems) => {
        return currentItems.map((item) => {
          if (item.variationId === variationId) {
            const variation = item.product.variations.find((v) => v.variationId === variationId)

            if (!variation || quantity > variation.stock) {
              return item
            }

            return { ...item, quantity }
          }
          return item
        })
      })
    },
    [removeFromCart],
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const cart = calculateCart(items)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInitialized,
  }
}
