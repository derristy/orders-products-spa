import { describe, it, expect } from 'vitest'
import { totalsByCurrency, formatAmount } from './money'
import type { Product } from '@/types'

function makeProduct(usd: number, uah: number): Product {
  return {
    id: 1,
    serialNumber: 1,
    isNew: 1,
    photo: '',
    title: 't',
    type: 'Monitors',
    specification: 's',
    guarantee: { start: '2017-01-01 00:00:00', end: '2018-01-01 00:00:00' },
    price: [
      { value: usd, symbol: 'USD', isDefault: 0 },
      { value: uah, symbol: 'UAH', isDefault: 1 },
    ],
    order: 1,
    date: '2017-01-01 00:00:00',
  }
}

describe('totalsByCurrency', () => {
  it('sums prices per currency across products', () => {
    const totals = totalsByCurrency([makeProduct(100, 2600), makeProduct(50, 1400)])
    expect(totals).toEqual([
      { symbol: 'USD', value: 150 },
      { symbol: 'UAH', value: 4000 },
    ])
  })

  it('returns empty array for no products', () => {
    expect(totalsByCurrency([])).toEqual([])
  })
})

describe('formatAmount', () => {
  it('groups thousands with a space and keeps two decimals', () => {
    expect(formatAmount(250000.5)).toBe('250 000.50')
    expect(formatAmount(50.25)).toBe('50.25')
    expect(formatAmount(1000)).toBe('1 000.00')
  })
})
