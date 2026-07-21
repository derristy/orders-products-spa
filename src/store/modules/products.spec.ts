import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import { products, type ProductsState } from './products'
import type { Product } from '@/types'

function product(id: number, type: string, specification: string): Product {
  return {
    id,
    serialNumber: id,
    isNew: 1,
    photo: '',
    title: `p${id}`,
    type,
    specification,
    guarantee: { start: '2017-01-01 00:00:00', end: '2018-01-01 00:00:00' },
    price: [{ value: 100, symbol: 'UAH', isDefault: 1 }],
    order: 1,
    date: '2017-01-01 00:00:00',
  }
}

function makeStore() {
  return createStore({ modules: { products } })
}

const sample: Product[] = [
  product(1, 'Monitors', 'Spec A'),
  product(2, 'Laptops', 'Spec B'),
  product(3, 'Monitors', 'Spec B'),
]

describe('products module getters', () => {
  it('lists unique types and specifications', () => {
    const store = makeStore()
    store.commit('products/setItems', sample)
    expect(store.getters['products/types']).toEqual(['Monitors', 'Laptops'])
    expect(store.getters['products/specifications']).toEqual(['Spec A', 'Spec B'])
  })

  it('filters by type', () => {
    const store = makeStore()
    store.commit('products/setItems', sample)
    store.commit('products/setTypeFilter', 'Monitors')
    expect(store.getters['products/filtered'].map((p: Product) => p.id)).toEqual([1, 3])
  })

  it('combines type and specification filters', () => {
    const store = makeStore()
    store.commit('products/setItems', sample)
    store.commit('products/setTypeFilter', 'Monitors')
    store.commit('products/setSpecFilter', 'Spec B')
    expect(store.getters['products/filtered'].map((p: Product) => p.id)).toEqual([3])
  })

  it('returns all items when no filter is set', () => {
    const store = makeStore()
    store.commit('products/setItems', sample)
    expect((store.state as unknown as { products: ProductsState }).products.typeFilter).toBeNull()
    expect(store.getters['products/filtered']).toHaveLength(3)
  })
})
