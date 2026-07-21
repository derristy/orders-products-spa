import type { Module } from 'vuex'
import type { Order } from '@/types'
import type { RootState } from '../index'
import { api } from '@/api'

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
  },
  mutations: {
    setItems(state, items: Order[]) {
      state.items = items
    },
    setLoading(state, value: boolean) {
      state.loading = value
    },
    setActive(state, id: number | null) {
      // Toggle: clicking the active order again closes the details panel.
      state.activeOrderId = state.activeOrderId === id ? null : id
    },
    removeOrder(state, id: number) {
      state.items = state.items.filter((o) => o.id !== id)
      if (state.activeOrderId === id) state.activeOrderId = null
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
    async remove({ commit }, id: number) {
      await api.deleteOrder(id)
      commit('removeOrder', id)
    },
  },
}
