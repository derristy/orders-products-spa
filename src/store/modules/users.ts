import type { Module } from 'vuex'
import type { User } from '@/types'
import type { RootState } from '../index'
import { api } from '@/api'

export interface UsersState {
  items: User[]
  loading: boolean
}

export const users: Module<UsersState, RootState> = {
  namespaced: true,
  state: () => ({ items: [], loading: false }),
  getters: {
    count: (state) => state.items.length,
  },
  mutations: {
    setItems(state, items: User[]) {
      state.items = items
    },
    setLoading(state, value: boolean) {
      state.loading = value
    },
    upsert(state, item: User) {
      const idx = state.items.findIndex((x) => x.id === item.id)
      if (idx >= 0) state.items.splice(idx, 1, item)
      else state.items.unshift(item)
    },
    remove(state, id: number) {
      state.items = state.items.filter((x) => x.id !== id)
    },
  },
  actions: {
    async fetch({ commit }) {
      commit('setLoading', true)
      try {
        commit('setItems', await api.getUsers())
      } finally {
        commit('setLoading', false)
      }
    },
    async save({ commit }, payload: { id?: number; data: Omit<User, 'id'> }) {
      const item = payload.id
        ? await api.updateUser(payload.id, payload.data)
        : await api.createUser(payload.data)
      commit('upsert', item)
    },
    async remove({ commit }, id: number) {
      await api.deleteUser(id)
      commit('remove', id)
    },
  },
}
