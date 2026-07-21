import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import { Server as SocketServer } from 'socket.io'
import { getOrders, getProducts, removeOrder } from './data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

// --- REST API ---------------------------------------------------------------
app.get('/api/orders', (_req, res) => {
  res.json(getOrders())
})

app.get('/api/orders/:id', (req, res) => {
  const order = getOrders().find((o) => o.id === Number(req.params.id))
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
})

app.delete('/api/orders/:id', (req, res) => {
  const ok = removeOrder(Number(req.params.id))
  if (!ok) return res.status(404).json({ message: 'Order not found' })
  res.status(204).end()
})

app.get('/api/products', (req, res) => {
  const { type } = req.query
  let products = getProducts()
  if (type) products = products.filter((p) => p.type === type)
  res.json(products)
})

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
