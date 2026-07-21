import { currentLocale } from '@/i18n'
import { dateNames } from '@/i18n/dateNames'

const pad = (n: number) => String(n).padStart(2, '0')

function months(): string[] {
  return dateNames[currentLocale()].months
}

/** Parses the dataset's 'YYYY-MM-DD HH:mm:ss' string into a Date. */
export function parseDate(input: string | Date): Date {
  if (input instanceof Date) return input
  // Replace space with 'T' for reliable cross-browser parsing.
  return new Date(input.replace(' ', 'T'))
}

/** Short numeric format: "DD / MM" (locale-independent). */
export function formatShort(input: string | Date): string {
  const d = parseDate(input)
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)}`
}

/** Long format with localized month: "DD / Mon / YYYY". */
export function formatLong(input: string | Date): string {
  const d = parseDate(input)
  return `${pad(d.getDate())} / ${months()[d.getMonth()]} / ${d.getFullYear()}`
}
