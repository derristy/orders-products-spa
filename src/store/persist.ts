import type { Plugin } from 'vuex'
import type { ProductsState } from './modules/products'

type FilterState = { products: ProductsState }

const KEY = 'op-filters'

interface Saved {
  typeFilter: string | null
  specFilter: string | null
}

function read(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Saved) : null
  } catch {
    return null
  }
}

function write(data: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Persists the product filters to Web Storage (localStorage) so a page reload
 * keeps the user's current type/specification selection.
 */
export const persistFilters: Plugin<unknown> = (store) => {
  const saved = read()
  if (saved) {
    store.commit('products/setTypeFilter', saved.typeFilter ?? null)
    store.commit('products/setSpecFilter', saved.specFilter ?? null)
  }

  store.subscribe((mutation, state) => {
    if (mutation.type === 'products/setTypeFilter' || mutation.type === 'products/setSpecFilter') {
      const s = state as FilterState
      write({ typeFilter: s.products.typeFilter, specFilter: s.products.specFilter })
    }
  })
}
