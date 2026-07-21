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

// Kept in mutable module-level arrays so create/update/delete actually persist
// for the lifetime of the server process.
export const db = {
  orders: buildOrders(),
  groups: [
    { id: 1, name: 'Мониторы', description: 'Группа мониторов' },
    { id: 2, name: 'Ноутбуки', description: 'Группа ноутбуков' },
    { id: 3, name: 'Телефоны', description: 'Группа телефонов' },
    { id: 4, name: 'Клавиатуры', description: 'Периферия и клавиатуры' },
  ],
  users: [
    { id: 1, name: 'Христорождественский Александр', email: 'alex@inventory.dev', role: 'Администратор' },
    { id: 2, name: 'Иванов Иван', email: 'ivanov@inventory.dev', role: 'Менеджер' },
    { id: 3, name: 'Петрова Мария', email: 'petrova@inventory.dev', role: 'Кладовщик' },
  ],
}

// Generic CRUD helpers over a named collection ('groups' | 'users').
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1

export const listOf = (key) => db[key]
export const createIn = (key, data) => {
  const item = { ...data, id: nextId(db[key]) }
  db[key].push(item)
  return item
}
export const updateIn = (key, id, data) => {
  const item = db[key].find((x) => x.id === id)
  if (!item) return null
  Object.assign(item, data, { id })
  return item
}
export const removeFrom = (key, id) => {
  const before = db[key].length
  db[key] = db[key].filter((x) => x.id !== id)
  return db[key].length < before
}

const now = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
const nextOrderId = () => db.orders.reduce((m, o) => Math.max(m, o.id), 0) + 1
const nextProductId = () =>
  db.orders.reduce((m, o) => Math.max(m, ...o.products.map((p) => p.id), 0), 0) + 1

export const getOrders = () => db.orders
// Products are enriched with their parent order title for the Products page.
export const getProducts = () =>
  db.orders.flatMap((o) => o.products.map((p) => ({ ...p, orderTitle: o.title })))

export const addOrder = ({ title, description = '' }) => {
  const order = { id: nextOrderId(), title, description, date: now(), products: [] }
  db.orders.unshift(order)
  return order
}

export const removeOrder = (id) => {
  const before = db.orders.length
  db.orders = db.orders.filter((o) => o.id !== id)
  return db.orders.length < before
}

export const addProduct = (orderId, data) => {
  const order = db.orders.find((o) => o.id === orderId)
  if (!order) return null
  const product = {
    id: nextProductId(),
    serialNumber: data.serialNumber ?? '00.0000000',
    isNew: data.isNew ? 1 : 0,
    photo: '',
    title: data.title ?? 'New product',
    type: data.type ?? TYPES[0],
    specification: data.specification ?? SPEC_BY_TYPE[data.type] ?? '',
    guarantee: { start: now(), end: now() },
    price: [
      { value: Number(data.priceUsd) || 0, symbol: 'USD', isDefault: 0 },
      { value: Number(data.priceUah) || 0, symbol: 'UAH', isDefault: 1 },
    ],
    order: orderId,
    date: now(),
  }
  order.products.push(product)
  return product
}

export const removeProduct = (orderId, productId) => {
  const order = db.orders.find((o) => o.id === orderId)
  if (!order) return false
  const before = order.products.length
  order.products = order.products.filter((p) => p.id !== productId)
  return order.products.length < before
}
