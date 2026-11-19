import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { IPHONE_CANVAS_H, IPHONE_CANVAS_W } from '../phone/IPhoneFrame'
import './ContinuityStage.css'

export type ContinuityStageProps = {
  mac: ReactNode
  phone: ReactNode
  className?: string
}

/**
 * Apple Continuity 式双设备台：
 * 桌面 — iPhone 高度约等于 Mac 屏幕高度的 80%，右下角叠放并外露约 1/3 宽度；
 * 窄屏 — 垂直堆叠。
 */
export default function ContinuityStage({ mac, phone, className = '' }: ContinuityStageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const macWrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [phoneSize, setPhoneSize] = useState({ w: 280, h: 280 * (IPHONE_CANVAS_H / IPHONE_CANVAS_W) })

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true)
      },
      { threshold: 0.18 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const root = macWrapRef.current
    if (!root || typeof ResizeObserver === 'undefined') return undefined

    const measure = () => {
      const screen =
        root.querySelector('.macbook__bezel') ??
        root.querySelector('.macbook__screen') ??
        root.querySelector('.macbook')
      if (!screen) return
      const screenH = screen.getBoundingClientRect().height
      const stageW = ref.current?.clientWidth ?? window.innerWidth
      const stacked = stageW < 900

      let h: number
      let w: number
      if (stacked) {
        w = Math.min(window.innerWidth * 0.7, 300)
        h = w * (IPHONE_CANVAS_H / IPHONE_CANVAS_W)
      } else {
        // 桌面：高度 ≈ Mac 屏幕 80%，整体等比；外露约 1/3 宽度
        h = screenH * 0.8
        w = h * (IPHONE_CANVAS_W / IPHONE_CANVAS_H)
        // 仅当舞台过窄时收一档，避免盖住 Mac 授权卡
        const maxW = stageW * 0.4
        if (w > maxW) {
          w = maxW
          h = w * (IPHONE_CANVAS_H / IPHONE_CANVAS_W)
        }
      }
      setPhoneSize({ w, h })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    if (ref.current) ro.observe(ref.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const phoneStyle = {
    '--continuity-phone-w': `${phoneSize.w}px`,
    '--continuity-phone-h': `${phoneSize.h}px`,
    width: phoneSize.w,
    height: phoneSize.h,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={`continuity ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={
        {
          '--continuity-phone-w': `${phoneSize.w}px`,
          '--continuity-phone-h': `${phoneSize.h}px`,
        } as CSSProperties
      }
    >
      <div className="continuity__mac" ref={macWrapRef}>
        {mac}
      </div>
      <div className="continuity__phone" style={phoneStyle}>
        {phone}
      </div>
    </div>
  )
}
