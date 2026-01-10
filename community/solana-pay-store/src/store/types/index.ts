export interface ProductVariation {
  variationId: string
  size: string
  color: string
  sku: string
  stock: number
  priceModifier?: number
}

export interface ProductImage {
  front: string
  back?: string
  frontHighRes?: string
  backHighRes?: string
}

export interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  category?: string
  imageUrl: string
  images: Record<string, ProductImage>
  variations: ProductVariation[]
  features?: string[]
  tags?: string[]
}

export interface SelectedVariation {
  size: string | null
  color: string | null
}

export * from './cart'
