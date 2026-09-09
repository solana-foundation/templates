'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { CartItem, Cart } from '@/store/types/cart'
import type { Product } from '@/store/types'

const CART_STORAGE_KEY = 'solana-pay-store-cart'
const CART_UPDATED_EVENT = 'solana-pay-store-cart-updated'
const EMPTY_CART: CartItem[] = []
let cachedCartValue: string | null = null
let cachedCartItems: CartItem[] = EMPTY_CART
let cartInitialized = false

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY_CART
  if (cartInitialized) return cachedCartItems

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    cachedCartValue = stored
    cachedCartItems = stored ? JSON.parse(stored) : EMPTY_CART
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    cachedCartValue = null
    cachedCartItems = EMPTY_CART
  }

  cartInitialized = true
  return cachedCartItems
}

function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return

  cachedCartItems = items
  cartInitialized = true

  try {
    const serialized = JSON.stringify(items)
    cachedCartValue = serialized
    localStorage.setItem(CART_STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }

  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}

function subscribeToCart(onStoreChange: () => void): () => void {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== CART_STORAGE_KEY || event.newValue === cachedCartValue) return

    try {
      cachedCartValue = event.newValue
      cachedCartItems = event.newValue ? JSON.parse(event.newValue) : EMPTY_CART
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      cachedCartValue = null
      cachedCartItems = EMPTY_CART
    }

    cartInitialized = true
    onStoreChange()
  }

  window.addEventListener('storage', handleStorageChange)
  window.addEventListener(CART_UPDATED_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('storage', handleStorageChange)
    window.removeEventListener(CART_UPDATED_EVENT, onStoreChange)
  }
}

function subscribeToHydration(): () => void {
  return () => undefined
}

function calculateCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return { items, total, itemCount }
}

export function useCart() {
  const items = useSyncExternalStore(subscribeToCart, getStoredCart, () => EMPTY_CART)
  const isInitialized = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )
  const updateCart = useCallback((update: (currentItems: CartItem[]) => CartItem[]) => {
    saveCart(update(getStoredCart()))
  }, [])

  const addToCart = useCallback(
    (product: Product, size: string, color: string, quantity: number = 1): boolean => {
      const variation = product.variations.find((v) => v.size === size && v.color === color)

      if (!variation || variation.stock < quantity) {
        return false
      }

      const variationId = variation.variationId
      const price = product.basePrice + (variation.priceModifier || 0)

      let didUpdate = false
      updateCart((currentItems) => {
        const existingItemIndex = currentItems.findIndex((item) => item.variationId === variationId)

        if (existingItemIndex >= 0) {
          const newItems = [...currentItems]
          const existingItem = newItems[existingItemIndex]
          const newQuantity = existingItem.quantity + quantity

          if (newQuantity > variation.stock) {
            return currentItems
          }

          didUpdate = true
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

        didUpdate = true
        return [...currentItems, newItem]
      })

      return didUpdate
    },
    [updateCart],
  )

  const removeFromCart = useCallback(
    (variationId: string) => {
      updateCart((currentItems) => currentItems.filter((item) => item.variationId !== variationId))
    },
    [updateCart],
  )

  const updateQuantity = useCallback(
    (variationId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(variationId)
        return
      }

      updateCart((currentItems) => {
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
    [removeFromCart, updateCart],
  )

  const clearCart = useCallback(() => {
    saveCart(EMPTY_CART)
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
