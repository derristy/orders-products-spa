// Persistent data layer backed by SQLite (Node's built-in node:sqlite).
// Data survives server/container restarts (the .sqlite file lives on a volume).
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite')

const db = new DatabaseSync(DB_PATH)
db.exec('PRAGMA foreign_keys = ON')
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    position INTEGER
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    serialNumber TEXT,
    isNew INTEGER,
    photo TEXT,
    title TEXT,
    type TEXT,
    specification TEXT,
    guarantee_start TEXT,
    guarantee_end TEXT,
    price_usd REAL,
    price_uah REAL,
    date TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT
  );
`)

// --- Helpers ----------------------------------------------------------------
const pad = (n) => String(n).padStart(2, '0')
const dt = (y, m, d) => `${y}-${pad(m)}-${pad(d)} 12:09:33`
const now = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function productShape(row, orderTitle) {
  const p = {
    id: row.id,
    serialNumber: row.serialNumber,
    isNew: row.isNew,
    photo: row.photo || '',
    title: row.title,
    type: row.type,
    specification: row.specification,
    guarantee: { start: row.guarantee_start, end: row.guarantee_end },
    price: [
      { value: row.price_usd, symbol: 'USD', isDefault: 0 },
      { value: row.price_uah, symbol: 'UAH', isDefault: 1 },
    ],
    order: row.order_id,
    date: row.date,
  }
  if (orderTitle !== undefined) p.orderTitle = orderTitle
  return p
}

const productsByOrder = db.prepare('SELECT * FROM products WHERE order_id = ? ORDER BY id')

function orderShape(row) {
  const products = productsByOrder.all(row.id).map((r) => productShape(r))
  return { id: row.id, title: row.title, date: row.date, description: row.description, products }
}

// --- Seeding ----------------------------------------------------------------
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

function seed() {
  const insOrder = db.prepare(
    'INSERT INTO orders (title, description, date, position) VALUES (?, ?, ?, ?)',
  )
  const insProduct = db.prepare(`
    INSERT INTO products
      (order_id, serialNumber, isNew, photo, title, type, specification,
       guarantee_start, guarantee_end, price_usd, price_uah, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (let o = 1; o <= 25; o += 1) {
    const title = o % 3 === 0 ? 'Длинное предлинное длиннючее название прихода' : `Приход №${o}`
    const date = dt(2017, ((o - 1) % 12) + 1, 6)
    const res = insOrder.run(title, `Описание прихода №${o}`, date, o)
    const orderId = Number(res.lastInsertRowid)
    const count = 2 + (o % 6)
    for (let i = 0; i < count; i += 1) {
      const type = TYPES[(o + i) % TYPES.length]
      const month = ((o + i) % 12) + 1
      insProduct.run(
        orderId,
        '12.3456789',
        (o + i) % 2 === 0 ? 1 : 0,
        '',
        TITLE_BY_TYPE[type],
        type,
        SPEC_BY_TYPE[type],
        dt(2017, month, 6),
        dt(2025, month, 6),
        100 + i * 10,
        2600 + i * 250,
        dt(2017, month, 6),
      )
    }
  }

  const insGroup = db.prepare('INSERT INTO groups (name, description) VALUES (?, ?)')
  for (const g of [
    ['Мониторы', 'Группа мониторов'],
    ['Ноутбуки', 'Группа ноутбуков'],
    ['Телефоны', 'Группа телефонов'],
    ['Клавиатуры', 'Периферия и клавиатуры'],
  ])
    insGroup.run(...g)

  const insUser = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)')
  for (const u of [
    ['Христорождественский Александр', 'alex@inventory.dev', 'Администратор'],
    ['Иванов Иван', 'ivanov@inventory.dev', 'Менеджер'],
    ['Петрова Мария', 'petrova@inventory.dev', 'Кладовщик'],
  ])
    insUser.run(...u)
}

if (db.prepare('SELECT COUNT(*) AS c FROM orders').get().c === 0) seed()

// --- Orders API -------------------------------------------------------------
export const getOrders = () =>
  db
    .prepare('SELECT * FROM orders ORDER BY position, id')
    .all()
    .map(orderShape)

export const getProducts = () =>
  db
    .prepare(
      'SELECT p.*, o.title AS orderTitle FROM products p JOIN orders o ON o.id = p.order_id ORDER BY p.id',
    )
    .all()
    .map((r) => productShape(r, r.orderTitle))

export const addOrder = ({ title, description = '' }) => {
  const min = db.prepare('SELECT MIN(position) AS m FROM orders').get().m
  const position = (min ?? 0) - 1 // put new order on top
  const res = db
    .prepare('INSERT INTO orders (title, description, date, position) VALUES (?, ?, ?, ?)')
    .run(title, description, now(), position)
  return orderShape(db.prepare('SELECT * FROM orders WHERE id = ?').get(Number(res.lastInsertRowid)))
}

export const removeOrder = (id) =>
  db.prepare('DELETE FROM orders WHERE id = ?').run(id).changes > 0

export const reorderOrders = (ids) => {
  const upd = db.prepare('UPDATE orders SET position = ? WHERE id = ?')
  ids.forEach((id, index) => upd.run(index, id))
  return getOrders()
}

export const addProduct = (orderId, data) => {
  const exists = db.prepare('SELECT 1 FROM orders WHERE id = ?').get(orderId)
  if (!exists) return null
  const res = db
    .prepare(
      `INSERT INTO products
        (order_id, serialNumber, isNew, photo, title, type, specification,
         guarantee_start, guarantee_end, price_usd, price_uah, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      orderId,
      data.serialNumber ?? '00.0000000',
      data.isNew ? 1 : 0,
      '',
      data.title ?? 'New product',
      data.type ?? TYPES[0],
      data.specification ?? SPEC_BY_TYPE[data.type] ?? '',
      now(),
      now(),
      Number(data.priceUsd) || 0,
      Number(data.priceUah) || 0,
      now(),
    )
  return productShape(db.prepare('SELECT * FROM products WHERE id = ?').get(Number(res.lastInsertRowid)))
}

export const removeProduct = (orderId, productId) =>
  db.prepare('DELETE FROM products WHERE id = ? AND order_id = ?').run(productId, orderId).changes > 0

// --- Generic directory CRUD (groups, users) --------------------------------
const COLUMNS = {
  groups: ['name', 'description'],
  users: ['name', 'email', 'role'],
}

export const listOf = (key) => db.prepare(`SELECT * FROM ${key} ORDER BY id`).all()

export const createIn = (key, data) => {
  const cols = COLUMNS[key]
  const placeholders = cols.map(() => '?').join(', ')
  const res = db
    .prepare(`INSERT INTO ${key} (${cols.join(', ')}) VALUES (${placeholders})`)
    .run(...cols.map((c) => data[c] ?? ''))
  return db.prepare(`SELECT * FROM ${key} WHERE id = ?`).get(Number(res.lastInsertRowid))
}

export const updateIn = (key, id, data) => {
  const existing = db.prepare(`SELECT * FROM ${key} WHERE id = ?`).get(id)
  if (!existing) return null
  const cols = COLUMNS[key]
  const assignments = cols.map((c) => `${c} = ?`).join(', ')
  db.prepare(`UPDATE ${key} SET ${assignments} WHERE id = ?`).run(
    ...cols.map((c) => (data[c] !== undefined ? data[c] : existing[c])),
    id,
  )
  return db.prepare(`SELECT * FROM ${key} WHERE id = ?`).get(id)
}

export const removeFrom = (key, id) =>
  db.prepare(`DELETE FROM ${key} WHERE id = ?`).run(id).changes > 0
