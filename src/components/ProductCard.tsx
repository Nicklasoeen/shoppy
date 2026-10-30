import { useState } from 'react'
import { Link } from 'react-router'
import type { Product } from '../types/product'
import { formatPrice, formatRating, getPricing } from '../utils/pricing'
import './Products.css'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const { id, title, price, discountedPrice, image, rating } = product
  const { isDiscounted, sellingPrice, discountPercent } = getPricing(
    price,
    discountedPrice,
  )

  return (
    <article className="product-card">
      <Link
        className="product-card__link"
        to={`/products/${encodeURIComponent(id)}`}
      >
        <div className="product-card__media">
          {discountPercent > 0 && (
            <span className="product-card__sticker">-{discountPercent}%</span>
          )}
          {imageFailed ? (
            <span className="product-card__fallback">Image unavailable</span>
          ) : (
            <img
              alt={image?.alt?.trim() || title}
              className="product-card__image"
              loading="lazy"
              onError={() => setImageFailed(true)}
              src={image?.url}
            />
          )}
        </div>
        <div className="product-card__body">
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__price">
            <span>{formatPrice(sellingPrice)}</span>
            {isDiscounted && (
              <s className="product-card__original-price">
                {formatPrice(price)}
              </s>
            )}
          </p>
          <p className="product-card__rating">
            {formatRating(rating)}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
