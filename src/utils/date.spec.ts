import { describe, it, expect } from 'vitest'
import { formatShort, formatLong } from './date'

describe('date formatting', () => {
  it('formatShort returns "DD / MM"', () => {
    expect(formatShort('2017-06-29 12:09:33')).toBe('29 / 06')
    expect(formatShort('2017-01-05 12:00:00')).toBe('05 / 01')
  })

  it('formatLong returns "DD / Мес / YYYY" with Russian month', () => {
    expect(formatLong('2017-06-29 12:09:33')).toBe('29 / Июн / 2017')
    expect(formatLong('2025-08-06 12:00:00')).toBe('06 / Авг / 2025')
  })

  it('accepts a Date instance', () => {
    expect(formatLong(new Date(2017, 3, 6, 12))).toBe('06 / Апр / 2017')
  })
})
