import { useEffect, useRef, useState, type ReactNode } from 'react'
import './MacBookFrame.css'

export type MacBookFrameProps = {
  children: ReactNode
  className?: string
  label?: string
  /** 在屏幕层上方叠加内容（如系统通知横幅） */
  overlay?: ReactNode
}

/** 固定设计画布宽度：屏幕内容按此宽度排版，再整体等比缩放（与桌面最大尺寸一致） */
export const MAC_CANVAS_W = 920

/**
 * 纯 CSS 绘制的 MacBook：黑边框、顶部刘海摄像头、铝色底座与开盖凹槽。
 */
export default function MacBookFrame({
  children,
  className = '',
  label = 'Atolla macOS 应用预览',
  overlay,
}: MacBookFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 1, h: 0 })

  useEffect(() => {
    const el = screenRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (w <= 0 || h <= 0) return
      const scale = w / MAC_CANVAS_W
      setBox({ scale, h: h / scale })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <figure className={`macbook ${className}`.trim()} aria-label={label}>
      <div className="macbook__lid">
        <div className="macbook__bezel">
          <div className="macbook__notch" aria-hidden="true">
            <span className="macbook__camera" />
            <span className="macbook__camera-led" />
          </div>
          <div className="macbook__screen" ref={screenRef}>
            <div
              className="macbook__canvas"
              style={{
                width: MAC_CANVAS_W,
                height: box.h || undefined,
                transform: `scale(${box.scale})`,
              }}
            >
              {children}
              {overlay ? <div className="macbook__overlay">{overlay}</div> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="macbook__hinge" aria-hidden="true" />
      <div className="macbook__base" aria-hidden="true">
        <div className="macbook__base-front">
          <span className="macbook__indent" />
        </div>
      </div>
    </figure>
  )
}
