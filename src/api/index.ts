import type { Order, Product, Group, User } from '@/types'

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

export interface NewProduct {
  title: string
  type: string
  serialNumber: string
  isNew: boolean
  priceUsd: number
  priceUah: number
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
  createOrder: (data: { title: string; description?: string }) =>
    request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  deleteOrder: (id: number) => request<void>(`/orders/${id}`, { method: 'DELETE' }),
  reorderOrders: (ids: number[]) =>
    request<Order[]>('/orders/reorder', { method: 'PUT', body: JSON.stringify({ ids }) }),
  addProduct: (orderId: number, data: NewProduct) =>
    request<Product>(`/orders/${orderId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteProduct: (orderId: number, productId: number) =>
    request<void>(`/orders/${orderId}/products/${productId}`, { method: 'DELETE' }),

  // Directories (groups, users)
  getGroups: () => request<Group[]>('/groups'),
  createGroup: (data: Omit<Group, 'id'>) =>
    request<Group>('/groups', { method: 'POST', body: JSON.stringify(data) }),
  updateGroup: (id: number, data: Omit<Group, 'id'>) =>
    request<Group>(`/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGroup: (id: number) => request<void>(`/groups/${id}`, { method: 'DELETE' }),

  getUsers: () => request<User[]>('/users'),
  createUser: (data: Omit<User, 'id'>) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: number, data: Omit<User, 'id'>) =>
    request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: number) => request<void>(`/users/${id}`, { method: 'DELETE' }),
}
