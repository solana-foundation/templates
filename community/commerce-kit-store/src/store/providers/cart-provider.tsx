'use client'

import { createContext, useContext } from 'react'
import { useCart as useCartHook } from '@/store/hooks/use-cart'

type CartContextType = ReturnType<typeof useCartHook>

const CartContext = createContext<CartContextType | null>(null)

/**
 * CartProvider - Shares cart state across the entire application
 * This ensures all components see the same cart data in real-time
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartHook()
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

/**
 * useCart - Access cart state and actions from anywhere in the app
 * Must be used within a CartProvider
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
