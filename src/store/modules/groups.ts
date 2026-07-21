import type { Module } from 'vuex'
import type { Group } from '@/types'
import type { RootState } from '../index'
import { api } from '@/api'

export interface GroupsState {
  items: Group[]
  loading: boolean
}

export const groups: Module<GroupsState, RootState> = {
  namespaced: true,
  state: () => ({ items: [], loading: false }),
  getters: {
    count: (state) => state.items.length,
  },
  mutations: {
    setItems(state, items: Group[]) {
      state.items = items
    },
    setLoading(state, value: boolean) {
      state.loading = value
    },
    upsert(state, item: Group) {
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
        commit('setItems', await api.getGroups())
      } finally {
        commit('setLoading', false)
      }
    },
    async save({ commit }, payload: { id?: number; data: Omit<Group, 'id'> }) {
      const item = payload.id
        ? await api.updateGroup(payload.id, payload.data)
        : await api.createGroup(payload.data)
      commit('upsert', item)
    },
    async remove({ commit }, id: number) {
      await api.deleteGroup(id)
      commit('remove', id)
    },
  },
}
