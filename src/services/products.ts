import type { Product, ProductImage, ProductReview } from '../types/product'

const PRODUCTS_URL = 'https://v2.api.noroff.dev/online-shop'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isProductImage(value: unknown): value is ProductImage {
  return (
    isRecord(value) &&
    typeof value.url === 'string' &&
    typeof value.alt === 'string'
  )
}

function isProductReview(value: unknown): value is ProductReview {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.username === 'string' &&
    isFiniteNumber(value.rating) &&
    typeof value.description === 'string'
  )
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    isFiniteNumber(value.price) &&
    isFiniteNumber(value.discountedPrice) &&
    isProductImage(value.image) &&
    isFiniteNumber(value.rating) &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === 'string') &&
    Array.isArray(value.reviews) &&
    value.reviews.every(isProductReview)
  )
}

function hasProductData(value: unknown): value is { data: Product[] } {
  return isRecord(value) && Array.isArray(value.data)
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal })

  if (!response.ok) {
    throw new Error(
      `Could not load products (${response.status} ${response.statusText}).`,
    )
  }

  const body: unknown = await response.json()

  if (!hasProductData(body)) {
    throw new Error('Received an unexpected response while loading products.')
  }

  const invalidIndex = body.data.findIndex((entry) => !isProduct(entry))

  if (invalidIndex !== -1) {
    throw new Error(
      `Received an invalid product (entry ${invalidIndex + 1}) while loading products.`,
    )
  }

  return body.data
}
