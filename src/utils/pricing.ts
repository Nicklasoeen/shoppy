const priceFormatter = new Intl.NumberFormat('nb-NO', {
  style: 'currency',
  currency: 'NOK',
})

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function formatRating(rating: number): string {
  return rating > 0 ? `Rating: ${rating} / 5` : 'No reviews yet'
}

export function getPricing(price: number, discountedPrice: number) {
  const isDiscounted = discountedPrice < price
  const sellingPrice = isDiscounted ? discountedPrice : price
  const discountPercent =
    isDiscounted && price > 0
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0

  return { isDiscounted, sellingPrice, discountPercent }
}

export function toMinorUnits(value: number): number {
  return Math.round(value * 100)
}

export function formatMinorUnits(minorUnits: number): string {
  return formatPrice(minorUnits / 100)
}
