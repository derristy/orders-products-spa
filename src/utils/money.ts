import type { Order, OrderTotal, Product } from '@/types'

/**
 * Sums prices of the given products grouped by currency symbol.
 * Returns an array like [{ symbol: 'USD', value: 200 }, { symbol: 'UAH', value: 5200 }].
 */
export function totalsByCurrency(products: Product[]): OrderTotal[] {
  const map = new Map<string, number>()
  for (const product of products) {
    for (const price of product.price) {
      map.set(price.symbol, (map.get(price.symbol) ?? 0) + price.value)
    }
  }
  return [...map.entries()].map(([symbol, value]) => ({ symbol, value }))
}

/** Convenience: totals for a whole order. */
export function orderTotals(order: Order): OrderTotal[] {
  return totalsByCurrency(order.products)
}

/** Formats a number with a thousands space separator: 250000.5 -> "250 000.50". */
export function formatAmount(value: number): string {
  const [int, frac] = value.toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${grouped}.${frac}`
}
