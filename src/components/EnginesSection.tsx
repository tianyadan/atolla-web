import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import JellyAvatar from '../jelly/JellyAvatar'
import MacBookFrame from './mac/MacBookFrame'
import './EnginesSection.css'

type EngineId = 'codex' | 'claude' | 'cursor'

const TERMINALS: { id: EngineId; title: string; x: number; y: number; lines: string[] }[] = [
  { id: 'codex', title: 'codex — zsh', x: 30, y: 120, lines: ['$ codex', '› Working on api/routes.ts …', '✕ Session expired, please log in again'] },
  { id: 'claude', title: 'claude — zsh', x: 270, y: 250, lines: ['$ claude', '› Reading project files …', '⚠ Context lost after switching window'] },
  { id: 'cursor', title: 'cursor-agent — zsh', x: 510, y: 150, lines: ['$ cursor-agent', '› Which account? (1) work (2) personal', '› Waiting for input …'] },
]

const AGENTS: { name: string; color: string; engine: EngineId; skills: string[] }[] = [
  { name: 'agents.fe', color: 'blue', engine: 'claude', skills: ['React', 'Figma'] },
  { name: 'agents.fs', color: 'red', engine: 'codex', skills: ['API', 'SQL'] },
  { name: 'agents.pm', color: 'green', engine: 'cursor', skills: ['PRD', 'Review'] },
]

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

function useStickyProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setP(total > 0 ? clamp(-r.top / total) : 1)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [ref])
  return p
}

/** 三个终端来回切换 → 滚动汇入 Atolla 一个窗口 */
function EngineStage() {
  const { t } = useI18n()
  const trackRef = useRef<HTMLDivElement>(null)
  const p = useStickyProgress(trackRef)
  const [front, setFront] = useState(0)

  // 第一阶段：终端轮流跳到最前，表现“来回切换”
  useEffect(() => {
    if (p > 0.4) return undefined
    const id = window.setInterval(() => setFront((f) => (f + 1) % 3), 900)
    return () => window.clearInterval(id)
  }, [p > 0.4]) // eslint-disable-line react-hooks/exhaustive-deps

  const merge = ease(range(p, 0.2, 0.5))
  const reveal = ease(range(p, 0.35, 0.65))
  const caption = p < 0.38 ? t('engines.stage.before') : t('engines.stage.after')

  return (
    <div className="engine-stage" ref={trackRef}>
      <div className="engine-stage__sticky">
        <MacBookFrame className="engine-stage__mac" label={t('engines.stage.aria')}>
          <div className="eng-desk">
            {TERMINALS.map((term, i) => {
              const cx = 460 - 190
              const cy = 215
              const x = term.x + (cx - term.x) * merge
              const y = term.y + (cy - term.y) * merge
              const isFront = merge === 0 && front === i
              return (
                <div
                  key={term.id}
                  className={`eng-term ${isFront ? 'is-front' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${1 - merge * 0.55})`,
                    opacity: 1 - merge,
                    zIndex: isFront ? 5 : 2 + i,
                  }}
                >
                  <div className="eng-term__bar">
                    <i /><i /><i />
                    <img src={`/engine-logos/${term.id}.svg`} alt="" width={12} height={12} />
                    <span>{term.title}</span>
                  </div>
                  <div className="eng-term__body">
                    {term.lines.map((l, j) => (
                      <p key={j} className={l.startsWith('✕') || l.startsWith('⚠') ? 'is-err' : undefined}>{l}</p>
                    ))}
                  </div>
                </div>
              )
            })}

            <div
              className="eng-atolla"
              style={{ opacity: reveal, transform: `translate(-50%, -50%) scale(${0.82 + reveal * 0.18})` }}
            >
              <div className="eng-atolla__bar">
                <i /><i /><i />
                <span>Atolla</span>
              </div>
              <div className="eng-atolla__body">
                <p className="eng-atolla__label">{t('engines.stage.agents')}</p>
                {AGENTS.map((a, i) => (
                  <div className="eng-agent" key={a.name} style={{ opacity: range(reveal, 0.3 + i * 0.2, 0.6 + i * 0.2) }}>
                    <JellyAvatar color={a.color} size={30} state="idle" />
                    <div className="eng-agent__main">
                      <strong>{t(a.name)}</strong>
                      <span>
                        {a.skills.map((s) => (
                          <em key={s}>{s}</em>
                        ))}
                      </span>
                    </div>
                    <span className="eng-agent__engine">
                      <img src={`/engine-logos/${a.engine}.svg`} alt="" width={14} height={14} />
                      {a.engine === 'codex' ? 'Codex' : a.engine === 'claude' ? 'Claude' : 'Cursor'}
                    </span>
                  </div>
                ))}
                <div className="eng-atolla__store">
                  <span>＋</span> {t('engines.stage.store')}
                </div>
              </div>
            </div>
          </div>
        </MacBookFrame>
        <p className="engine-stage__caption">{caption}</p>
      </div>
    </div>
  )
}

export default function EnginesSection() {
  const { t } = useI18n()
  const points = [1, 2, 3].map((n) => ({ title: t(`engines.p${n}.title`), body: t(`engines.p${n}.body`) }))
  return (
    <div className="engines">
      <EngineStage />
      <ul className="engines__points">
        {points.map((pt) => (
          <li key={pt.title}>
            <strong>{pt.title}</strong>
            <p>{pt.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
