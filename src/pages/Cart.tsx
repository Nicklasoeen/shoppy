import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Toast from '../components/Toast'
import { useCart } from '../hooks/useCart'
import type { CartItem } from '../types/cart'
import {
  formatMinorUnits,
  getPricing,
  toMinorUnits,
} from '../utils/pricing'
import '../components/Cart.css'

function CartImage({ item }: { item: CartItem }) {
  const [failed, setFailed] = useState(false)
  const { image, title } = item.product

  if (failed) {
    return <span className="cart-item__fallback">Image unavailable</span>
  }

  return (
    <img
      alt={image.alt.trim() || title}
      className="cart-item__image"
      loading="lazy"
      onError={() => setFailed(true)}
      src={image.url}
    />
  )
}

function Cart() {
  const { items, removeFromCart, updateQuantity } = useCart()
  const [toast, setToast] = useState<{ message: string; nonce: number } | null>(
    null,
  )
  const dismissToast = useCallback(() => setToast(null), [])
  const listRef = useRef<HTMLUListElement>(null)
  const emptyHeadingRef = useRef<HTMLHeadingElement>(null)
  const pendingFocusIndex = useRef<number | null>(null)

  useEffect(() => {
    const index = pendingFocusIndex.current
    if (index === null) return
    pendingFocusIndex.current = null

    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[data-cart-remove]',
    )

    if (buttons && buttons.length > 0) {
      buttons[Math.min(index, buttons.length - 1)].focus()
    } else {
      emptyHeadingRef.current?.focus()
    }
  }, [items])

  function handleRemove(item: CartItem, index: number) {
    pendingFocusIndex.current = index
    removeFromCart(item.product.id)
    setToast((current) => ({
      message: `${item.product.title} removed from cart`,
      nonce: (current?.nonce ?? 0) + 1,
    }))
  }

  const rows = items.map((item) => {
    const { sellingPrice } = getPricing(
      item.product.price,
      item.product.discountedPrice,
    )
    const unitMinor = toMinorUnits(sellingPrice)
    return { item, unitMinor, lineMinor: unitMinor * item.quantity }
  })
  const totalMinor = rows.reduce((sum, row) => sum + row.lineMinor, 0)

  return (
    <div className="cart">
      <Toast
        message={toast?.message ?? null}
        nonce={toast?.nonce ?? 0}
        onDismiss={dismissToast}
      />
      <h1>Your cart</h1>

      {rows.length === 0 ? (
        <section aria-labelledby="cart-empty-heading" className="cart__empty">
          <h2 id="cart-empty-heading" ref={emptyHeadingRef} tabIndex={-1}>
            Your cart is empty
          </h2>
          <p>Add something you like and it will show up here.</p>
          <Link to="/#products-heading">Explore products</Link>
        </section>
      ) : (
        <>
          <ul className="cart__list" ref={listRef}>
            {rows.map(({ item, unitMinor, lineMinor }, index) => {
              const { product, quantity } = item
              return (
                <li className="cart-item" key={product.id}>
                  <div className="cart-item__media">
                    <CartImage item={item} />
                  </div>
                  <div className="cart-item__details">
                    <h2 className="cart-item__title">
                      <Link to={`/products/${encodeURIComponent(product.id)}`}>
                        {product.title}
                      </Link>
                    </h2>
                    <p className="cart-item__unit">
                      {formatMinorUnits(unitMinor)} each
                    </p>
                    <div className="cart-item__quantity">
                      <button
                        aria-label={`Decrease quantity of ${product.title}`}
                        disabled={quantity <= 1}
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        type="button"
                      >
                        −
                      </button>
                      <span aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                      <button
                        aria-label={`Increase quantity of ${product.title}`}
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-item__summary">
                    <p className="cart-item__line-total">
                      {formatMinorUnits(lineMinor)}
                    </p>
                    <button
                      aria-label={`Remove ${product.title} from cart`}
                      className="cart-item__remove"
                      data-cart-remove
                      onClick={() => handleRemove(item, index)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="cart__total">
            <span>Total</span>
            <strong>{formatMinorUnits(totalMinor)}</strong>
          </p>
        </>
      )}
    </div>
  )
}

export default Cart
