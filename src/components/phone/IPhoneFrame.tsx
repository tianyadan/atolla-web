import { useEffect, useState, type ReactNode } from 'react'
import './IPhoneFrame.css'

export type IPhoneFrameProps = {
  children: ReactNode
  /** 若传入则固定显示；默认用观众本地时间并每分钟更新 */
  time?: string
  className?: string
  label?: string
  /** Dynamic Island 展开为通知胶囊 */
  islandExpanded?: boolean
  islandTitle?: string
  islandSubtitle?: string
}

/** 格式化本地 HH:MM */
function formatLocalTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * 可复用 CSS 绘制的 iPhone 外壳（Dynamic Island + 状态栏）。
 * 屏幕内容由 children 注入，便于后续替换更多 mockup 场景。
 */
export default function IPhoneFrame({
  children,
  time,
  className = '',
  label = 'iPhone 应用预览',
  islandExpanded = false,
  islandTitle,
  islandSubtitle,
}: IPhoneFrameProps) {
  const [liveTime, setLiveTime] = useState(() => formatLocalTime())

  useEffect(() => {
    if (time) return undefined
    const tick = () => setLiveTime(formatLocalTime())
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [time])

  const displayTime = time ?? liveTime

  return (
    <figure className={`iphone ${className}`.trim()} aria-label={label}>
      <div className="iphone__shell">
        <div className="iphone__bezel">
          <div
            className={`iphone__island ${islandExpanded ? 'is-expanded' : ''}`}
            aria-hidden={!islandExpanded}
          >
            {islandExpanded ? (
              <div className="iphone__island-note">
                <img
                  src="/brand-jellyfish-white.png"
                  alt=""
                  width={16}
                  height={16}
                  className="iphone__island-logo"
                />
                <div className="iphone__island-copy">
                  <strong>{islandTitle ?? '全栈'}</strong>
                  <span>{islandSubtitle ?? '请求执行命令'}</span>
                </div>
              </div>
            ) : (
              <span className="iphone__island-cam" />
            )}
          </div>

          <div className="iphone__status" aria-hidden="true">
            <span className="iphone__time">{displayTime}</span>
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
