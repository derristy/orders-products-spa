import type { Order, Product } from '@/types'

// In dev, Vite proxies /api -> http://localhost:3000 (see vite.config.ts).
// In production the frontend is served by the same Node server.
const BASE = '/api'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  getOrders: () => request<Order[]>('/orders'),
  getProducts: (type?: string) =>
    request<Product[]>(`/products${type ? `?type=${encodeURIComponent(type)}` : ''}`),
  deleteOrder: (id: number) => request<void>(`/orders/${id}`, { method: 'DELETE' }),
}
