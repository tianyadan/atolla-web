import { useEffect, useState, type RefObject } from 'react'

/** 计算元素在视口中的滚动进度 0→1（进入到离开） */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const view = window.innerHeight || 1
      const total = rect.height + view
      const raw = (view - rect.top) / total
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])

  return progress
}
