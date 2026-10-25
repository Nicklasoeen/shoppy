import { useState } from 'react'
import type { Product } from '../types/product'
import './Products.css'

const priceFormatter = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
})

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const { title, price, discountedPrice, image, rating } = product

  const isDiscounted = discountedPrice < price
  const sellingPrice = isDiscounted ? discountedPrice : price
  const discountPercent =
    isDiscounted && price > 0
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0

  return (
    <article className="product-card">
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
          <span>{priceFormatter.format(sellingPrice)}</span>
          {isDiscounted && (
            <s className="product-card__original-price">
              {priceFormatter.format(price)}
            </s>
          )}
        </p>
        <p className="product-card__rating">
          {rating > 0 ? `Rating: ${rating} / 5` : 'No reviews yet'}
        </p>
      </div>
    </article>
  )
}

export default ProductCard
