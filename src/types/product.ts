export interface ProductImage {
  url: string
  alt: string
}

export interface ProductReview {
  id: string
  username: string
  rating: number
  description: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  discountedPrice: number
  image: ProductImage
  rating: number
  tags: string[]
  reviews: ProductReview[]
}

export interface ProductListResponse {
  data: Product[]
  meta: Record<string, unknown>
}
