import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

type TiltSurfaceProps = {
  children: ReactNode
  className?: string
  maxTilt?: number
}

/**
 * 克制的指针倾斜表面（React Bits TiltedCard 思路的轻量版，适合文字卡片）。
 */
export default function TiltSurface({ children, className = '', maxTilt = 7 }: TiltSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)',
  })

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: none)').matches) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`,
      transition: 'transform 80ms linear',
    })
  }

  const onLeave = () => {
    setStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
    })
  }

  return (
    <div
      ref={ref}
      className={`tilt-surface ${className}`.trim()}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  )
}
