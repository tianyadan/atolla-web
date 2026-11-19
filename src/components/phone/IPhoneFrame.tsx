import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './IPhoneFrame.css'

/** 固定设计画布：所有屏幕内容按此尺寸排版，外层等比缩放 */
export const IPHONE_CANVAS_W = 390
export const IPHONE_CANVAS_H = 844

export type IPhoneFrameProps = {
  children: ReactNode
  /** 若传入则固定显示；默认用观众本地时间 */
  time?: string
  className?: string
  label?: string
  /** Dynamic Island 展开为通知胶囊 */
  islandExpanded?: boolean
  islandTitle?: string
  islandSubtitle?: string
  /** 自定义展开内容（如可交互的授权 Live Activity），传入时替代默认横幅 */
  islandContent?: ReactNode
  /** 展开尺寸：banner 为通知胶囊，large 为可交互的大卡片 */
  islandSize?: 'banner' | 'large'
  /** dark：状态栏白字、与深色壁纸同底色（状态栏浮在内容上） */
  tone?: 'light' | 'dark'
}

function formatLocalTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * 共享 iPhone 外壳：外壳锁定 390/844 比例，内部固定画布经 ResizeObserver 等比 scale。
 * 禁止被 flex/grid 单轴压扁。
 */
export default function IPhoneFrame({
  children,
  time,
  className = '',
  label = 'iPhone 应用预览',
  islandExpanded = false,
  islandTitle,
  islandSubtitle,
  islandContent,
  islandSize = 'banner',
  tone = 'light',
}: IPhoneFrameProps) {
  const [liveTime, setLiveTime] = useState(() => formatLocalTime())
  const [scale, setScale] = useState(1)
  const bodyRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (time) return undefined
    const tick = () => setLiveTime(formatLocalTime())
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [time])

  useEffect(() => {
    const el = bodyRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined

    const update = () => {
      const w = el.clientWidth
      if (w <= 0) return
      setScale(w / IPHONE_CANVAS_W)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const displayTime = time ?? liveTime

  return (
    <figure
      ref={bodyRef}
      className={`iphone ${tone === 'dark' ? 'iphone--dark' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      aria-label={label}
      style={
        {
          '--iphone-scale': String(scale),
          aspectRatio: `${IPHONE_CANVAS_W} / ${IPHONE_CANVAS_H}`,
        } as CSSProperties
      }
    >
      <div
        className="iphone__canvas"
        style={{
          width: IPHONE_CANVAS_W,
          height: IPHONE_CANVAS_H,
          transform: `scale(${scale})`,
        }}
      >
        <div className="iphone__shell">
          <div className="iphone__bezel">
            <div
              className={`iphone__island ${islandExpanded ? 'is-expanded' : ''} ${
                islandExpanded && islandSize === 'large' ? 'is-large' : ''
              }`}
              aria-hidden={!islandExpanded}
            >
              {islandExpanded && islandContent ? (
                islandContent
              ) : islandExpanded ? (
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
                  <em>61</em>
                </span>
              </div>
            </div>

            <div className="iphone__screen">{children}</div>

            <div className="iphone__home" aria-hidden="true" />
          </div>
        </div>
      </div>
    </figure>
  )
}
