import type { Module } from 'vuex'
import type { Product } from '@/types'
import type { RootState } from '../index'
import { api } from '@/api'

export interface ProductsState {
  items: Product[]
  typeFilter: string | null
  specFilter: string | null
  loading: boolean
}

export const products: Module<ProductsState, RootState> = {
  namespaced: true,
  state: () => ({
    items: [],
    typeFilter: null,
    specFilter: null,
    loading: false,
  }),
  getters: {
    count: (state) => state.items.length,
    types: (state) => [...new Set(state.items.map((p) => p.type))],
    specifications: (state) => [...new Set(state.items.map((p) => p.specification))],
    filtered: (state) =>
      state.items.filter(
        (p) =>
          (!state.typeFilter || p.type === state.typeFilter) &&
          (!state.specFilter || p.specification === state.specFilter),
      ),
  },
  mutations: {
    setItems(state, items: Product[]) {
      state.items = items
    },
    setLoading(state, value: boolean) {
      state.loading = value
    },
    setTypeFilter(state, type: string | null) {
      state.typeFilter = type
    },
    setSpecFilter(state, spec: string | null) {
      state.specFilter = spec
    },
  },
  actions: {
    async fetch({ commit }) {
      commit('setLoading', true)
      try {
        const items = await api.getProducts()
        commit('setItems', items)
      } finally {
        commit('setLoading', false)
      }
    },
  },
}
