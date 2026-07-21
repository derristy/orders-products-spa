/** Currency price entry (a product can be priced in several currencies). */
export interface Price {
  value: number
  symbol: 'USD' | 'UAH' | string
  isDefault: 0 | 1
}

/** Warranty period of a product. */
export interface Guarantee {
  start: string // ISO-ish datetime, e.g. '2017-06-29 12:09:33'
  end: string
}

/** A single product that belongs to an order (приход). */
export interface Product {
  id: number
  serialNumber: number | string
  isNew: 0 | 1
  photo: string
  title: string
  type: string // e.g. 'Monitors'
  specification: string
  guarantee: Guarantee
  price: Price[]
  order: number // id of the parent order
  orderTitle?: string // parent order title (populated by the products endpoint)
  date: string
}

/** An order (приход) — a batch of products. */
export interface Order {
  id: number
  title: string
  date: string
  description: string
  products: Product[]
}

/** Aggregated sum of an order per currency symbol. */
export interface OrderTotal {
  symbol: string
  value: number
}

/** Product group (directory). */
export interface Group {
  id: number
  name: string
  description: string
}

/** Application user (directory). */
export interface User {
  id: number
  name: string
  email: string
  role: string
}
