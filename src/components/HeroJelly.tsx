import { useEffect, useRef, useState } from 'react'
import JellyAvatar from '../jelly/JellyAvatar'
import { prefersReducedMotion, type JellyState } from '../jelly/jellySprite'
import { useScrollProgress } from '../hooks/useScrollProgress'

type HeroJellyProps = {
  size?: number
}

/**
 * 首屏像素水母：漂浮 + 指针反应 + 随滚动轻微视差/状态变化。
 */
export default function HeroJelly({ size = 144 }: HeroJellyProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [reduced, setReduced] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const [state, setState] = useState<JellyState>('idle')
  const progress = useScrollProgress(wrapRef)

  useEffect(() => {
    setReduced(prefersReducedMotion())
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(hoverMq.matches)
    update()
    hoverMq.addEventListener?.('change', update)
    return () => hoverMq.removeEventListener?.('change', update)
  }, [])

  // 滚动时切换到思考态，体现「对滚动有反应」
  useEffect(() => {
    if (reduced) return
    if (progress > 0.55) setState('ponder')
    else if (progress > 0.28) setState('typing')
    else setState('idle')
  }, [progress, reduced])

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
      const radius = Math.max(rect.width, rect.height) * 1.55
      if (dist > radius) {
        setOffset({ x: 0, y: 0 })
        return
      }
      const strength = (1 - dist / radius) * 18
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

  const parallaxY = reduced ? 0 : (progress - 0.35) * -36

  return (
    <div
      ref={wrapRef}
      className="hero-jelly"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y + parallaxY}px, 0)`,
      }}
    >
      <div className="hero-jelly__glow" aria-hidden="true" />
      <JellyAvatar color="cyan" size={size} state={state} aria-label="Atolla 水母团队" />
    </div>
  )
}
