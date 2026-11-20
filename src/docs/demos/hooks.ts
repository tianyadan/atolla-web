import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'

/** 元素进入视口才计时，离开就暂停，省电 */
export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, inView] as const
}

/** 步进器：每 ms 前进一步，循环 total 步 */
export function useStepper(total: number, ms: number, running: boolean, loop = true) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!running) return undefined
    const id = window.setInterval(() => {
      setStep((s) => (s + 1 >= total ? (loop ? 0 : s) : s + 1))
    }, ms)
    return () => window.clearInterval(id)
  }, [running, ms, total, loop])
  return [step, setStep] as const
}

export const ENGINE_META = {
  claude: { name: 'Claude', bin: 'claude', logo: '/engine-logos/claude.svg', color: '#d97757' },
  codex: { name: 'Codex', bin: 'codex', logo: '/engine-logos/codex.svg', color: '#10a37f' },
  cursor: { name: 'Cursor', bin: 'agent', logo: '/engine-logos/cursor.svg', color: '#6b7280' },
} as const

export type EngineId = keyof typeof ENGINE_META

export function useZh() {
  return useI18n().locale === 'zh'
}
