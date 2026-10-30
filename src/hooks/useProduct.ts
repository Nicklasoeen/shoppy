import { useEffect, useState } from 'react'
import { fetchProduct } from '../services/products'
import type { Product } from '../types/product'

interface ProductState {
  id: string
  product: Product | null
  error: string | null
}

interface UseProductResult {
  product: Product | null
  isLoading: boolean
  error: string | null
}

export function useProduct(id: string | undefined): UseProductResult {
  const [state, setState] = useState<ProductState | null>(null)

  useEffect(() => {
    if (!id) return

    const controller = new AbortController()

    fetchProduct(id, controller.signal)
      .then((product) => setState({ id, product, error: null }))
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return
        setState({
          id,
          product: null,
          error:
            caught instanceof Error
              ? caught.message
              : 'Something went wrong while loading the product.',
        })
      })

    return () => controller.abort()
  }, [id])

  if (!id) {
    return { product: null, isLoading: false, error: null }
  }

  // State from a previous route ID is ignored until the new request settles.
  if (state === null || state.id !== id) {
    return { product: null, isLoading: true, error: null }
  }

  return { product: state.product, isLoading: false, error: state.error }
}
