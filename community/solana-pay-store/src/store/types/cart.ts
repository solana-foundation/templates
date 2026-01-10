import type { Product } from './index'

export interface CartItem {
  product: Product
  variationId: string
  size: string
  color: string
  quantity: number
  price: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}
