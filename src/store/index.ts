import { createStore } from 'vuex'
import { orders } from './modules/orders'
import { products } from './modules/products'
import { auth } from './modules/auth'
import { ui } from './modules/ui'
import { groups } from './modules/groups'
import { users } from './modules/users'
import { persistFilters } from './persist'

export interface RootState {
  version: string
}

export const store = createStore<RootState>({
  state: () => ({ version: '1.0.0' }),
  modules: {
    orders,
    products,
    auth,
    ui,
    groups,
    users,
  },
  plugins: [persistFilters],
})

export default store
