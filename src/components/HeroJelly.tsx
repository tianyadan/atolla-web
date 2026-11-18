import { useEffect, useRef, useState } from 'react'
import JellyAvatar from '../jelly/JellyAvatar'
import { prefersReducedMotion } from '../jelly/jellySprite'

type HeroJellyProps = {
  size?: number
}

/**
 * 首屏像素水母：缓慢漂浮，鼠标靠近时轻微偏移（移动端不做 hover 依赖）。
 */
export default function HeroJelly({ size = 144 }: HeroJellyProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [reduced, setReduced] = useState(false)
  const [canHover, setCanHover] = useState(false)

  useEffect(() => {
    setReduced(prefersReducedMotion())
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(hoverMq.matches)
    update()
    hoverMq.addEventListener?.('change', update)
    return () => hoverMq.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!canHover || reduced) return undefined
    const el = wrapRef.current
    if (!el) return undefined

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const dist = Math.hypot(dx, dy)
      const radius = Math.max(rect.width, rect.height) * 1.4
      if (dist > radius) {
        setOffset({ x: 0, y: 0 })
        return
      }
      // 靠近时轻微躲开，幅度克制
      const strength = (1 - dist / radius) * 14
      setOffset({
        x: (dx / (dist || 1)) * -strength,
        y: (dy / (dist || 1)) * -strength,
      })
    }

    const onLeave = () => setOffset({ x: 0, y: 0 })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [canHover, reduced])

  return (
    <div
      ref={wrapRef}
      className="hero-jelly"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      }}
    >
      <div className="hero-jelly__glow" aria-hidden="true" />
      <JellyAvatar color="cyan" size={size} state="idle" aria-label="Atolla 水母团队" />
    </div>
  )
}
