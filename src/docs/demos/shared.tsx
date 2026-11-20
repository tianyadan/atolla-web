import { type ReactNode } from 'react'
import { ENGINE_META, type EngineId } from './hooks'
import { useI18n } from '../../i18n/I18nProvider'

/** 演示卡片外壳：标题栏 + 控制区 + 画布 + 说明 */
export function DemoFrame({
  title,
  caption,
  controls,
  children,
  className = '',
}: {
  title: string
  caption?: ReactNode
  controls?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={`dm ${className}`}>
      <div className="dm__head">
        <span className="dm__badge">
          <span className="dm__pulse" aria-hidden="true" />
          {title}
        </span>
        {controls && <div className="dm__controls">{controls}</div>}
      </div>
      <div className="dm__canvas">{children}</div>
      {caption && <figcaption className="dm__caption">{caption}</figcaption>}
    </figure>
  )
}

export function Seg<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="dm-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          type="button"
          role="radio"
          aria-checked={value === o.value}
          key={o.value}
          className={value === o.value ? 'is-on' : undefined}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function PlayButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const { locale } = useI18n()
  const label = playing ? (locale === 'zh' ? '暂停' : 'Pause') : locale === 'zh' ? '播放' : 'Play'
  return (
    <button type="button" className="dm-btn dm-btn--icon" onClick={onToggle} aria-label={label} title={label}>
      {playing ? (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="2.5" y="2" width="2.4" height="8" rx="0.6" fill="currentColor" />
          <rect x="7.1" y="2" width="2.4" height="8" rx="0.6" fill="currentColor" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3.5 2.2v7.6L9.6 6z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}

export function ReplayButton({ onClick }: { onClick: () => void }) {
  const { locale } = useI18n()
  const label = locale === 'zh' ? '重播' : 'Replay'
  return (
    <button type="button" className="dm-btn" onClick={onClick}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2.2 6a3.8 3.8 0 1 0 1.1-2.7M2.2 1.8v1.9h1.9" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  )
}

export function EngineMark({ id, size = 18 }: { id: EngineId; size?: number }) {
  return (
    <span className="dm-engine" style={{ width: size, height: size }}>
      <img src={ENGINE_META[id].logo} alt="" width={size * 0.62} height={size * 0.62} />
    </span>
  )
}

