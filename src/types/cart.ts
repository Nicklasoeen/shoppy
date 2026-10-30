import type { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  addToCart: (product: Product) => void
}
