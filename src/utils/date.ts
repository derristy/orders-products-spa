const MONTHS_SHORT = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
]

const pad = (n: number) => String(n).padStart(2, '0')

/** Parses the dataset's 'YYYY-MM-DD HH:mm:ss' string into a Date. */
export function parseDate(input: string | Date): Date {
  if (input instanceof Date) return input
  // Replace space with 'T' for reliable cross-browser parsing.
  return new Date(input.replace(' ', 'T'))
}

/** Short numeric format: "DD / MM". */
export function formatShort(input: string | Date): string {
  const d = parseDate(input)
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)}`
}

/** Long format with Russian month: "DD / Мес / YYYY". */
export function formatLong(input: string | Date): string {
  const d = parseDate(input)
  return `${pad(d.getDate())} / ${MONTHS_SHORT[d.getMonth()]} / ${d.getFullYear()}`
}
