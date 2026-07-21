import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { Server as SocketServer } from 'socket.io'
import {
  getOrders,
  getProducts,
  addOrder,
  removeOrder,
  reorderOrders,
  addProduct,
  removeProduct,
  listOf,
  createIn,
  updateIn,
  removeFrom,
} from './data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
// Demo credentials (for the test task). In real apps — a user store + hashing.
const DEMO_USER = { username: 'admin', password: 'admin' }

const app = express()
app.use(cors())
app.use(express.json())

// --- Auth -------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {}
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = jwt.sign({ sub: username }, JWT_SECRET, { expiresIn: '12h' })
    return res.json({ token, user: { username } })
  }
  res.status(401).json({ message: 'Invalid credentials' })
})

// JWT guard for protected REST routes.
function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// --- REST API (protected) ---------------------------------------------------
app.get('/api/orders', auth, (_req, res) => {
  res.json(getOrders())
})

app.get('/api/orders/:id', auth, (req, res) => {
  const order = getOrders().find((o) => o.id === Number(req.params.id))
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
})

app.post('/api/orders', auth, (req, res) => {
  const { title, description } = req.body || {}
  if (!title || !title.trim()) return res.status(422).json({ message: 'Title is required' })
  res.status(201).json(addOrder({ title: title.trim(), description }))
})

app.put('/api/orders/reorder', auth, (req, res) => {
  const ids = (req.body && req.body.ids) || []
  if (!Array.isArray(ids)) return res.status(422).json({ message: 'ids must be an array' })
  res.json(reorderOrders(ids.map(Number)))
})

app.delete('/api/orders/:id', auth, (req, res) => {
  const ok = removeOrder(Number(req.params.id))
  if (!ok) return res.status(404).json({ message: 'Order not found' })
  res.status(204).end()
})

app.post('/api/orders/:id/products', auth, (req, res) => {
  const product = addProduct(Number(req.params.id), req.body || {})
  if (!product) return res.status(404).json({ message: 'Order not found' })
  res.status(201).json(product)
})

app.delete('/api/orders/:orderId/products/:productId', auth, (req, res) => {
  const ok = removeProduct(Number(req.params.orderId), Number(req.params.productId))
  if (!ok) return res.status(404).json({ message: 'Product not found' })
  res.status(204).end()
})

app.get('/api/products', auth, (req, res) => {
  const { type } = req.query
  let products = getProducts()
  if (type) products = products.filter((p) => p.type === type)
  res.json(products)
})

// --- Generic CRUD for directories (groups, users) ---------------------------
function registerCrud(collection, requiredField) {
  app.get(`/api/${collection}`, auth, (_req, res) => res.json(listOf(collection)))

  app.post(`/api/${collection}`, auth, (req, res) => {
    const body = req.body || {}
    if (!body[requiredField] || !String(body[requiredField]).trim()) {
      return res.status(422).json({ message: `${requiredField} is required` })
    }
    res.status(201).json(createIn(collection, body))
  })

  app.put(`/api/${collection}/:id`, auth, (req, res) => {
    const item = updateIn(collection, Number(req.params.id), req.body || {})
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  })

  app.delete(`/api/${collection}/:id`, auth, (req, res) => {
    const ok = removeFrom(collection, Number(req.params.id))
    if (!ok) return res.status(404).json({ message: 'Not found' })
    res.status(204).end()
  })
}

registerCrud('groups', 'name')
registerCrud('users', 'name')

// --- Static frontend (production) -------------------------------------------
const distDir = path.resolve(__dirname, '../dist')
app.use(express.static(distDir))
app.get(/^\/(?!api|socket\.io).*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) res.status(200).send('Frontend build not found. Run "npm run build".')
  })
})

// --- Socket.io: active sessions counter -------------------------------------
const server = http.createServer(app)
const io = new SocketServer(server, { cors: { origin: '*' } })

const broadcastCount = () => io.emit('sessions', io.engine.clientsCount)

io.on('connection', (socket) => {
  broadcastCount()
  socket.on('disconnect', broadcastCount)
})

server.listen(PORT, () => {
  console.log(`API + WS server on http://localhost:${PORT}`)
})
