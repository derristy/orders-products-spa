import { createI18n } from 'vue-i18n'
import ru from './locales/ru'
import uk from './locales/uk'
import kk from './locales/kk'
import en from './locales/en'
import type { LocaleCode } from './dateNames'

export const SUPPORTED_LOCALES: { code: LocaleCode; label: string }[] = [
  { code: 'ru', label: 'Рус' },
  { code: 'uk', label: 'Укр' },
  { code: 'kk', label: 'Қаз' },
  { code: 'en', label: 'Eng' },
]

const STORAGE_KEY = 'op-locale'

function initialLocale(): LocaleCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as LocaleCode | null
    if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) return saved
  } catch {
    /* ignore */
  }
  return 'ru'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true, // enables $t/$tc in templates
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { ru, uk, kk, en },
})

/** Switches the active locale and persists it to Web Storage. */
export function setLocale(code: LocaleCode) {
  i18n.global.locale.value = code
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* ignore */
  }
  document.documentElement.setAttribute('lang', code)
}

export function currentLocale(): LocaleCode {
  return i18n.global.locale.value as LocaleCode
}

export default i18n
