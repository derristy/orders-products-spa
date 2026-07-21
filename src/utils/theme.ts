export interface Accent {
  name: string
  primary: string
  dark: string
}

// Selectable accent colors (primary + a darker shade for hovers/active states).
export const ACCENTS: Accent[] = [
  { name: 'green', primary: '#8bc53f', dark: '#7cb518' },
  { name: 'blue', primary: '#3f8bc5', dark: '#2f6fa0' },
  { name: 'violet', primary: '#8b5cf6', dark: '#6d3fd6' },
  { name: 'orange', primary: '#f5972f', dark: '#d67a15' },
  { name: 'red', primary: '#e94b4b', dark: '#c93636' },
]

const KEY = 'op-accent'
const DEFAULT = ACCENTS[0]

function apply(accent: Accent) {
  const root = document.documentElement
  root.style.setProperty('--c-primary', accent.primary)
  root.style.setProperty('--c-primary-dark', accent.dark)
}

export function currentAccentName(): string {
  try {
    return localStorage.getItem(KEY) || DEFAULT.name
  } catch {
    return DEFAULT.name
  }
}

export function setAccent(name: string) {
  const accent = ACCENTS.find((a) => a.name === name) ?? DEFAULT
  apply(accent)
  try {
    localStorage.setItem(KEY, accent.name)
  } catch {
    /* ignore */
  }
}

/** Applies the persisted accent on app start. */
export function initAccent() {
  setAccent(currentAccentName())
}
