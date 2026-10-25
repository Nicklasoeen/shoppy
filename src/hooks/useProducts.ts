import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/products'
import type { Product } from '../types/product'

interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchProducts(controller.signal)
      .then((result) => {
        setProducts(result)
        setError(null)
        setIsLoading(false)
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return
        setError(
          caught instanceof Error
            ? caught.message
            : 'Something went wrong while loading products.',
        )
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { products, isLoading, error }
}
