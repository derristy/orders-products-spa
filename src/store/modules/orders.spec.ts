import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import { orders } from './orders'
import type { Order } from '@/types'

function order(id: number): Order {
  return { id, title: `o${id}`, date: '2017-01-01 00:00:00', description: '', products: [] }
}

function makeStore() {
  return createStore({ modules: { orders } })
}

describe('orders module', () => {
  it('setActive toggles the active order (second click closes it)', () => {
    const store = makeStore()
    store.commit('orders/setItems', [order(1), order(2)])
    store.commit('orders/setActive', 1)
    expect(store.getters['orders/activeOrder']?.id).toBe(1)
    store.commit('orders/setActive', 1)
    expect(store.getters['orders/activeOrder']).toBeNull()
  })

  it('removeOrder deletes item and clears active when it was active', () => {
    const store = makeStore()
    store.commit('orders/setItems', [order(1), order(2)])
    store.commit('orders/setActive', 2)
    store.commit('orders/removeOrder', 2)
    expect(store.getters['orders/count']).toBe(1)
    expect(store.getters['orders/activeOrder']).toBeNull()
  })
})
