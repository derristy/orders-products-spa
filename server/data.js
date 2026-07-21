// In-memory dataset (single source of truth for the REST API).
// Shape mirrors the reference app.js from the task, with the original typos fixed.

const TYPES = ['Monitors', 'Laptops', 'Phones', 'Keyboards']

const TITLE_BY_TYPE = {
  Monitors: 'Gigabyte Technology X58-USB3 (Socket 1366) 6 X58-USB3',
  Laptops: 'Lenovo ThinkPad X1 Carbon Gen 9 14"',
  Phones: 'Samsung Galaxy S21 Ultra 5G 256GB',
  Keyboards: 'Logitech MX Keys Advanced Wireless',
}

const SPEC_BY_TYPE = {
  Monitors: 'Specification 1',
  Laptops: 'Specification 2',
  Phones: 'Specification 3',
  Keyboards: 'Specification 4',
}

const pad = (n) => String(n).padStart(2, '0')
const dt = (y, m, d) => `${y}-${pad(m)}-${pad(d)} 12:09:33`

let productId = 0

function makeProduct(orderId, i) {
  productId += 1
  const type = TYPES[(orderId + i) % TYPES.length]
  const isNew = (orderId + i) % 2 === 0 ? 1 : 0
  const startYear = 2017
  const endYear = 2025
  return {
    id: productId,
    serialNumber: '12.3456789',
    isNew,
    photo: '',
    title: TITLE_BY_TYPE[type],
    type,
    specification: SPEC_BY_TYPE[type],
    guarantee: {
      start: dt(startYear, ((orderId + i) % 12) + 1, 6),
      end: dt(endYear, ((orderId + i) % 12) + 1, 6),
    },
    price: [
      { value: 100 + i * 10, symbol: 'USD', isDefault: 0 },
      { value: 2600 + i * 250, symbol: 'UAH', isDefault: 1 },
    ],
    order: orderId,
    date: dt(startYear, ((orderId + i) % 12) + 1, 6),
  }
}

function buildOrders() {
  const orders = []
  const ORDER_COUNT = 25
  for (let o = 1; o <= ORDER_COUNT; o += 1) {
    const productsCount = 2 + (o % 6) // 2..7 products per order
    const products = Array.from({ length: productsCount }, (_, i) => makeProduct(o, i))
    orders.push({
      id: o,
      title:
        o % 3 === 0
          ? 'Длинное предлинное длиннючее название прихода'
          : `Приход №${o}`,
      date: dt(2017, ((o - 1) % 12) + 1, 6),
      description: `Описание прихода №${o}`,
      products,
    })
  }
  return orders
}

// Kept in a mutable module-level array so DELETE actually removes items.
export const db = {
  orders: buildOrders(),
}

export const getOrders = () => db.orders
// Products are enriched with their parent order title for the Products page.
export const getProducts = () =>
  db.orders.flatMap((o) => o.products.map((p) => ({ ...p, orderTitle: o.title })))
export const removeOrder = (id) => {
  const before = db.orders.length
  db.orders = db.orders.filter((o) => o.id !== id)
  return db.orders.length < before
}
