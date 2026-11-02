import { useProducts } from '../hooks/useProducts'
import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { getPricing } from '../utils/pricing'
import ProductCard from './ProductCard'
import './Products.css'

type SortOption =
  | 'default'
  | 'price-ascending'
  | 'price-descending'
  | 'name-ascending'

function isSortOption(value: string): value is SortOption {
  return (
    value === 'default' ||
    value === 'price-ascending' ||
    value === 'price-descending' ||
    value === 'name-ascending'
  )
}

function ProductSection() {
  const { products, isLoading, error } = useProducts()
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const trimmedQuery = query.trim()
  const sortedProducts = products
    .map((product, index) => ({ product, index }))
    .sort((left, right) => {
      let comparison = 0

      if (sortOption === 'price-ascending') {
        comparison =
          getPricing(left.product.price, left.product.discountedPrice)
            .sellingPrice -
          getPricing(right.product.price, right.product.discountedPrice)
            .sellingPrice
      } else if (sortOption === 'price-descending') {
        comparison =
          getPricing(right.product.price, right.product.discountedPrice)
            .sellingPrice -
          getPricing(left.product.price, left.product.discountedPrice)
            .sellingPrice
      } else if (sortOption === 'name-ascending') {
        comparison = left.product.title.localeCompare(right.product.title, undefined, {
          sensitivity: 'base',
        })
      }

      return comparison || left.index - right.index
    })
    .map(({ product }) => product)
  const matches = trimmedQuery
    ? sortedProducts.filter((product) =>
        product.title.toLocaleLowerCase().includes(trimmedQuery.toLocaleLowerCase()),
      )
    : []
  const showResults =
    trimmedQuery.length > 0 && !isLoading && !error && products.length > 0
  const resultStatus = showResults
    ? matches.length === 0
      ? 'No products found.'
      : `${matches.length} ${matches.length === 1 ? 'product' : 'products'} found.`
    : ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function handleSortChange(value: string) {
    if (isSortOption(value)) {
      setSortOption(value)
    }
  }

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
        {sortedProducts.map((product) => (
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
        <div className="product-section__tools">
          <form className="product-search" onSubmit={handleSubmit} role="search">
            <label htmlFor="product-search-input">Search products</label>
            <div className="product-search__controls">
              <input
                autoComplete="off"
                id="product-search-input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product name"
                ref={searchInputRef}
                type="search"
                value={query}
              />
              {query.length > 0 && (
                <button
                  aria-label="Clear product search"
                  className="product-search__clear"
                  onClick={() => {
                    setQuery('')
                    searchInputRef.current?.focus()
                  }}
                  type="button"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
          <div className="product-sort">
            <label htmlFor="product-sort-select">Sort by</label>
            <select
              disabled={products.length === 0}
              id="product-sort-select"
              onChange={(event) => handleSortChange(event.target.value)}
              value={sortOption}
            >
              <option value="default">Default order</option>
              <option value="price-ascending">Price: low to high</option>
              <option value="price-descending">Price: high to low</option>
              <option value="name-ascending">Name: A–Z</option>
            </select>
          </div>
        </div>
        <p aria-live="polite" className="product-search__announcer">
          {resultStatus}
        </p>
        {showResults && (
          <div
            aria-labelledby="product-search-results-heading"
            className="product-search__results"
          >
            <h3 id="product-search-results-heading">Search results</h3>
            <p className="product-search__status">{resultStatus}</p>
            {matches.length > 0 ? (
              <ul>
                {matches.map((product) => (
                  <li key={product.id}>
                    <Link to={`/products/${encodeURIComponent(product.id)}`}>
                      {product.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
        {content}
      </div>
    </section>
  )
}

export default ProductSection
