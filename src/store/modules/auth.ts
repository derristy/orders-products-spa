import type { Module } from 'vuex'
import type { RootState } from '../index'
import { api, TOKEN_KEY } from '@/api'

const USER_KEY = 'op-user'

export interface AuthUser {
  username: string
}

export interface AuthState {
  token: string | null
  user: AuthUser | null
}

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: readUser(),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.user?.username ?? '',
  },
  mutations: {
    setAuth(state, payload: { token: string; user: AuthUser }) {
      state.token = payload.token
      state.user = payload.user
      try {
        localStorage.setItem(TOKEN_KEY, payload.token)
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      } catch {
        /* ignore */
      }
    },
    clearAuth(state) {
      state.token = null
      state.user = null
      try {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } catch {
        /* ignore */
      }
    },
  },
  actions: {
    async login({ commit }, credentials: { username: string; password: string }) {
      const { token, user } = await api.login(credentials.username, credentials.password)
      commit('setAuth', { token, user })
    },
    logout({ commit }) {
      commit('clearAuth')
    },
  },
}
