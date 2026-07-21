import { createStore } from 'vuex'
import { orders } from './modules/orders'
import { products } from './modules/products'
import { persistFilters } from './persist'

export interface RootState {
  version: string
}

export const store = createStore<RootState>({
  state: () => ({ version: '1.0.0' }),
  modules: {
    orders,
    products,
  },
  plugins: [persistFilters],
})

export default store
