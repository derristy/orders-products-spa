import type { Module } from 'vuex'
import type { Order, Product } from '@/types'
import type { RootState } from '../index'
import { api, type NewProduct } from '@/api'

export interface OrdersState {
  items: Order[]
  activeOrderId: number | null
  loading: boolean
}

export const orders: Module<OrdersState, RootState> = {
  namespaced: true,
  state: () => ({
    items: [],
    activeOrderId: null,
    loading: false,
  }),
  getters: {
    count: (state) => state.items.length,
    activeOrder: (state) => state.items.find((o) => o.id === state.activeOrderId) ?? null,
    visible: (state, _getters, rootState) => {
      const search = ((rootState as { ui?: { search?: string } }).ui?.search ?? '')
        .trim()
        .toLowerCase()
      return search ? state.items.filter((o) => o.title.toLowerCase().includes(search)) : state.items
    },
  },
  mutations: {
    setItems(state, items: Order[]) {
      state.items = items
    },
    reorder(state, ids: number[]) {
      const byId = new Map(state.items.map((o) => [o.id, o]))
      state.items = ids.map((id) => byId.get(id)).filter((o): o is Order => !!o)
    },
    setLoading(state, value: boolean) {
      state.loading = value
    },
    setActive(state, id: number | null) {
      // Toggle: clicking the active order again closes the details panel.
      state.activeOrderId = state.activeOrderId === id ? null : id
    },
    addOrder(state, order: Order) {
      state.items.unshift(order)
    },
    removeOrder(state, id: number) {
      state.items = state.items.filter((o) => o.id !== id)
      if (state.activeOrderId === id) state.activeOrderId = null
    },
    addProduct(state, { orderId, product }: { orderId: number; product: Product }) {
      state.items.find((o) => o.id === orderId)?.products.push(product)
    },
    removeProduct(state, { orderId, productId }: { orderId: number; productId: number }) {
      const order = state.items.find((o) => o.id === orderId)
      if (order) order.products = order.products.filter((p) => p.id !== productId)
    },
  },
  actions: {
    async fetch({ commit }) {
      commit('setLoading', true)
      try {
        const items = await api.getOrders()
        commit('setItems', items)
      } finally {
        commit('setLoading', false)
      }
    },
    async create({ commit }, data: { title: string; description?: string }) {
      const order = await api.createOrder(data)
      commit('addOrder', order)
      return order
    },
    async remove({ commit }, id: number) {
      await api.deleteOrder(id)
      commit('removeOrder', id)
    },
    async reorder({ commit, state }, ids: number[]) {
      const previous = state.items.map((o) => o.id)
      commit('reorder', ids) // optimistic
      try {
        await api.reorderOrders(ids)
      } catch {
        commit('reorder', previous) // revert on failure
      }
    },
    async addProduct({ commit }, payload: { orderId: number; data: NewProduct }) {
      const product = await api.addProduct(payload.orderId, payload.data)
      commit('addProduct', { orderId: payload.orderId, product })
      return product
    },
    async removeProduct({ commit }, payload: { orderId: number; productId: number }) {
      await api.deleteProduct(payload.orderId, payload.productId)
      commit('removeProduct', payload)
    },
  },
}
