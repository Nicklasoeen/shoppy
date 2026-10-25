import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'
import './Products.css'

function ProductSection() {
  const { products, isLoading, error } = useProducts()

  let content
  if (isLoading) {
    content = <p role="status">Loading products…</p>
  } else if (error) {
    content = <p role="alert">We couldn’t load the collection. {error}</p>
  } else if (products.length === 0) {
    content = <p>No products are available right now.</p>
  } else {
    content = (
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  return (
    <section aria-labelledby="products-heading" className="product-section">
      <div className="product-section__inner">
        <h2 className="product-section__heading" id="products-heading">
          The collection
        </h2>
        {content}
      </div>
    </section>
  )
}

export default ProductSection
