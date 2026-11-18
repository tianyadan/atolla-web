import { useRef, type ReactNode } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

type ParallaxSectionProps = {
  id?: string
  className?: string
  children: ReactNode
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * 区块级滚动视差：内容随滚动轻微上浮/缩放，保持克制。
 */
export default function ParallaxSection({
  id,
  className = '',
  children,
  ...aria
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const progress = useScrollProgress(ref)
  const shift = (0.5 - progress) * 28
  const scale = 0.985 + Math.min(progress, 1 - progress) * 0.04

  return (
    <section
      ref={ref}
      id={id}
      className={`section parallax-section ${className}`.trim()}
      style={{
        ['--parallax-y' as string]: `${shift.toFixed(2)}px`,
        ['--parallax-scale' as string]: scale.toFixed(4),
      }}
      {...aria}
    >
      <div className="parallax-section__inner">{children}</div>
    </section>
  )
}
