import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import '../components/CheckoutSuccess.css'

function isCheckoutCompleted(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'checkoutCompleted' in value &&
    value.checkoutCompleted === true
  )
}

function CheckoutSuccess() {
  const location = useLocation()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const completed = isCheckoutCompleted(location.state)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section aria-labelledby="checkout-heading" className="checkout-result">
      {completed ? (
        <>
          <h1 id="checkout-heading" ref={headingRef} tabIndex={-1}>
            Thank you!
          </h1>
          <p>Your demo checkout is complete.</p>
          <p>No payment has been processed.</p>
          <Link to="/#products-heading">Continue shopping</Link>
        </>
      ) : (
        <>
          <h1 id="checkout-heading" ref={headingRef} tabIndex={-1}>
            No checkout confirmation
          </h1>
          <p>There is no completed checkout to display.</p>
          <Link to="/#products-heading">Return to the shop</Link>
        </>
      )}
    </section>
  )
}

export default CheckoutSuccess
