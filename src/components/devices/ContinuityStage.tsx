import { useEffect, useRef, useState, type ReactNode } from 'react'
import './ContinuityStage.css'

export type ContinuityStageProps = {
  mac: ReactNode
  phone: ReactNode
  className?: string
}

/**
 * Apple Continuity 式双设备台：Mac 在左，iPhone 叠在右前角；
 * 进入视口时从两侧推入。
 */
export default function ContinuityStage({ mac, phone, className = '' }: ContinuityStageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true)
      },
      { threshold: 0.22 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`continuity ${inView ? 'is-in' : ''} ${className}`.trim()}
    >
      <div className="continuity__mac">{mac}</div>
      <div className="continuity__phone">{phone}</div>
    </div>
  )
}
