import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { isProduct } from '../services/products'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { CartContext } from './CartContext'

const CART_STORAGE_KEY = 'shoppy-cart'

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved === null) return []

    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      console.warn('Could not restore cart: saved data is not an array.')
      return []
    }

    const ids = new Set<string>()
    const items: CartItem[] = []
    for (const entry of parsed) {
      if (
        typeof entry !== 'object' ||
        entry === null ||
        !('product' in entry) ||
        !isProduct(entry.product) ||
        !('quantity' in entry) ||
        typeof entry.quantity !== 'number' ||
        !Number.isSafeInteger(entry.quantity) ||
        entry.quantity < 1 ||
        ids.has(entry.product.id)
      ) {
        console.warn('Could not restore an invalid cart item.')
        continue
      }

      ids.add(entry.product.id)
      items.push({ product: entry.product, quantity: entry.quantity })
    }
    return items
  } catch (error) {
    console.warn('Could not restore cart from local storage.', error)
    return []
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.warn('Could not save cart to local storage.', error)
  }
}

function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addToCart = useCallback((product: Product) => {
    setItems((current) => {
      const exists = current.some((item) => item.product.id === product.id)

      if (!exists) {
        return [...current, { product, quantity: 1 }]
      }

      if (current.some((item) =>
        item.product.id === product.id && item.quantity === Number.MAX_SAFE_INTEGER
      )) {
        console.warn('Could not add product: maximum quantity reached.')
        return current
      }

      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((item) => item.product.id !== productId),
    )
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return

    setItems((current) => {
      if (!current.some((item) => item.product.id === productId)) {
        return current
      }

      return current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    saveCart([])
    setItems([])
  }, [])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
