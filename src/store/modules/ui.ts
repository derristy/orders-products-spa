import type { Module } from 'vuex'
import type { RootState } from '../index'

export interface UiState {
  search: string
}

export const ui: Module<UiState, RootState> = {
  namespaced: true,
  state: () => ({ search: '' }),
  mutations: {
    setSearch(state, value: string) {
      state.search = value
    },
  },
}
