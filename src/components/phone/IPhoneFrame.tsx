import type { ReactNode } from 'react'
import './IPhoneFrame.css'

export type IPhoneFrameProps = {
  children: ReactNode
  /** 状态栏时间 */
  time?: string
  className?: string
  /** 无障碍标签 */
  label?: string
}

/**
 * 可复用 CSS 绘制的 iPhone 外壳（Dynamic Island + 状态栏）。
 * 屏幕内容由 children 注入，便于后续替换更多 mockup 场景。
 */
export default function IPhoneFrame({
  children,
  time = '21:37',
  className = '',
  label = 'iPhone 应用预览',
}: IPhoneFrameProps) {
  return (
    <figure className={`iphone ${className}`.trim()} aria-label={label}>
      <div className="iphone__shell">
        <div className="iphone__bezel">
          <div className="iphone__island" aria-hidden="true">
            <span className="iphone__island-cam" />
          </div>

          <div className="iphone__status" aria-hidden="true">
            <span className="iphone__time">{time}</span>
            <div className="iphone__status-right">
              <span className="iphone__signal" />
              <span className="iphone__network">5G</span>
              <span className="iphone__battery">
                <i />
                61
              </span>
            </div>
          </div>

          <div className="iphone__screen">{children}</div>

          <div className="iphone__home" aria-hidden="true" />
        </div>
      </div>
    </figure>
  )
}
