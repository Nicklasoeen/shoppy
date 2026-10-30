import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import Toast from '../components/Toast'
import { useCart } from '../hooks/useCart'
import { useProduct } from '../hooks/useProduct'
import { formatPrice, formatRating, getPricing } from '../utils/pricing'
import type { Product } from '../types/product'
import '../components/ProductDetail.css'

const backLink = (
  <Link className="product-detail__back" to="/#products-heading">
    Back to products
  </Link>
)

function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="product-detail__fallback">Image unavailable</span>
  }

  return (
    <img
      alt={product.image.alt.trim() || product.title}
      className="product-detail__image"
      onError={() => setFailed(true)}
      src={product.image.url}
    />
  )
}

function ProductInfo({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [toast, setToast] = useState<{ message: string; nonce: number } | null>(
    null,
  )
  const dismissToast = useCallback(() => setToast(null), [])

  function handleAddToCart() {
    addToCart(product)
    setToast((current) => ({
      message: `${product.title} added to cart`,
      nonce: (current?.nonce ?? 0) + 1,
    }))
  }

  const { isDiscounted, sellingPrice, discountPercent } = getPricing(
    product.price,
    product.discountedPrice,
  )

  return (
    <article className="product-detail__layout">
      <Toast
        message={toast?.message ?? null}
        nonce={toast?.nonce ?? 0}
        onDismiss={dismissToast}
      />
      <div className="product-detail__media">
        <ProductImage product={product} />
      </div>
      <div className="product-detail__info">
        <h1 className="product-detail__title">{product.title}</h1>
        <p className="product-detail__price">
          <span>{formatPrice(sellingPrice)}</span>
          {isDiscounted && (
            <s className="product-detail__original-price">
              {formatPrice(product.price)}
            </s>
          )}
          {discountPercent > 0 && (
            <span className="product-detail__discount">-{discountPercent}%</span>
          )}
        </p>
        <p className="product-detail__rating">{formatRating(product.rating)}</p>
        <p className="product-detail__description">{product.description}</p>
        <button
          className="product-detail__add"
          onClick={handleAddToCart}
          type="button"
        >
          Add to Cart
        </button>

        {product.tags.length > 0 && (
          <ul aria-label="Tags" className="product-detail__tags">
            {product.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>

      {product.reviews.length > 0 && (
        <section
          aria-labelledby="reviews-heading"
          className="product-detail__reviews"
        >
          <h2 id="reviews-heading">Reviews</h2>
          <ul>
            {product.reviews.map((review) => (
              <li key={review.id}>
                <p className="product-detail__review-meta">
                  <strong>{review.username}</strong>
                  <span>{review.rating} / 5</span>
                </p>
                <p>{review.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const { product, isLoading, error } = useProduct(id)

  let content
  if (isLoading) {
    content = <p role="status">Loading product…</p>
  } else if (error) {
    content = <p role="alert">We couldn’t load this product. {error}</p>
  } else if (!product) {
    content = (
      <>
        <h1>Product not found</h1>
        <p>We couldn’t find the product you are looking for.</p>
      </>
    )
  } else {
    content = <ProductInfo product={product} />
  }

  return (
    <div className="product-detail">
      <div className="product-detail__inner">
        {backLink}
        {content}
      </div>
    </div>
  )
}

export default ProductDetail
