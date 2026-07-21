import type { Order, Product } from '@/types'

// In dev, Vite proxies /api -> the Node server (see vite.config.ts).
// In production the frontend is served by the same Node server.
const BASE = '/api'

export const TOKEN_KEY = 'op-token'

let onUnauthorized: (() => void) | null = null
/** Registers a handler invoked on any 401 (used to log out + redirect). */
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...(init.headers ?? {}) },
  })
  if (res.status === 401) {
    onUnauthorized?.()
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export interface LoginResponse {
  token: string
  user: { username: string }
}

export const api = {
  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getOrders: () => request<Order[]>('/orders'),
  getProducts: (type?: string) =>
    request<Product[]>(`/products${type ? `?type=${encodeURIComponent(type)}` : ''}`),
  deleteOrder: (id: number) => request<void>(`/orders/${id}`, { method: 'DELETE' }),
}
