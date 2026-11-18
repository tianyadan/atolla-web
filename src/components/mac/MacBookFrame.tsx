import type { ReactNode } from 'react'
import './MacBookFrame.css'

export type MacBookFrameProps = {
  children: ReactNode
  className?: string
  label?: string
  /** 在屏幕层上方叠加内容（如系统通知横幅） */
  overlay?: ReactNode
}

/**
 * 纯 CSS 绘制的 MacBook：黑边框、顶部刘海摄像头、铝色底座与开盖凹槽。
 */
export default function MacBookFrame({
  children,
  className = '',
  label = 'Atolla macOS 应用预览',
  overlay,
}: MacBookFrameProps) {
  return (
    <figure className={`macbook ${className}`.trim()} aria-label={label}>
      <div className="macbook__lid">
        <div className="macbook__bezel">
          <div className="macbook__notch" aria-hidden="true">
            <span className="macbook__camera" />
            <span className="macbook__camera-led" />
          </div>
          <div className="macbook__screen">
            {children}
            {overlay ? <div className="macbook__overlay">{overlay}</div> : null}
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
