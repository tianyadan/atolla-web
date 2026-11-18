import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { translate } from './dictionaries'
import { LOCALE_STORAGE_KEY, type Locale } from './types'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  fading: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  const lang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'zh'
  return lang.startsWith('zh') ? 'zh' : 'en'
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  document.title = translate(locale, 'meta.title')
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', translate(locale, 'meta.description'))
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.setAttribute('content', translate(locale, 'meta.title'))
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (ogDesc) ogDesc.setAttribute('content', translate(locale, 'meta.description'))
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof window === 'undefined' ? 'zh' : detectLocale(),
  )
  const [fading, setFading] = useState(false)

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    if (next === locale) return
    setFading(true)
    window.setTimeout(() => {
      setLocaleState(next)
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setFading(false), 180)
    }, 160)
  }, [locale])

  const t = useCallback((key: string) => translate(locale, key), [locale])

  const value = useMemo(
    () => ({ locale, setLocale, t, fading }),
    [locale, setLocale, t, fading],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
