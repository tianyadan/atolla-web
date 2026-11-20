import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import JellyAvatar from '../../jelly/JellyAvatar'
import { prefersReducedMotion } from '../../jelly/jellySprite'
import MacBookFrame from '../mac/MacBookFrame'
import './MacIsland.css'

/**
 * Mac 灵动岛演示：严格对应 Atolla-beta macos/AtollaIsland 的真实行为——
 * 收起态 = 刘海宽黑色主岛 + 右侧状态角标（水母/图标 + 事件数）；
 * 点击主岛弹簧展开（宽 +120、最多 3 行事件）；点击角标先并入再展开；
 * 优先级 报错 > 命令审批 > 运行中 > 已完成；无事件时只剩刘海。
 */

type Kind = 'idle' | 'running' | 'approval' | 'error' | 'completed'
type EventKind = Exclude<Kind, 'idle'>
type Phase = 'collapsed' | 'merging' | 'expanded'
type Row = { kind: EventKind; name: string; color: string; sub: string; status: string }

const KINDS: Kind[] = ['idle', 'running', 'approval', 'error', 'completed']
const MERGE_MS = 300

type Step = { kind: Kind; phase: Phase; ms: number }
const SCRIPT: Step[] = KINDS.flatMap((kind): Step[] =>
  kind === 'idle'
    ? [{ kind, phase: 'collapsed', ms: 2200 }]
    : [
        { kind, phase: 'collapsed', ms: 1500 },
        { kind, phase: 'merging', ms: MERGE_MS },
        { kind, phase: 'expanded', ms: 3400 },
      ],
)

function dur(sec: number, zh: boolean) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m === 0) return zh ? `${s}秒` : `${s}s`
  return zh ? `${m}分${String(s).padStart(2, '0')}秒` : `${m}m ${String(s).padStart(2, '0')}s`
}

function rowsFor(kind: Kind, zh: boolean, tick: number): Row[] {
  const shen = zh ? '沈清禾' : 'Shen Qinghe'
  const lu = zh ? '陆明远' : 'Lu Mingyuan'
  const han = zh ? '韩雨' : 'Han Yu'
  const fe = zh ? '前端组' : 'Frontend'
  const be = zh ? '后端组' : 'Backend'
  const qa = zh ? '测试组' : 'QA'
  const running = zh ? '运行中' : 'Running'
  const luRow: Row = {
    kind: 'running',
    name: lu,
    color: 'purple',
    sub: `${be} · ${dur(48 + tick, zh)} · ${zh ? '运行中' : 'Running'}`,
    status: running,
  }
  switch (kind) {
    case 'idle':
      return []
    case 'running':
      return [
        {
          kind: 'running',
          name: shen,
          color: 'cyan',
          sub: `${fe} · ${dur(134 + tick, zh)} · ${zh ? '2/4 实现登录表单' : '2/4 Build login form'}`,
          status: '45%',
        },
        luRow,
      ]
    case 'approval':
      return [
        { kind: 'approval', name: shen, color: 'cyan', sub: `${fe} · npm install zod`, status: zh ? '待命令审批' : 'Needs approval' },
        luRow,
      ]
    case 'error':
      return [
        {
          kind: 'error',
          name: han,
          color: 'coral',
          sub: `${qa} · ${dur(65, zh)} · 14:20 · ${zh ? '测试未通过' : 'tests failed'}`,
          status: zh ? '任务报错' : 'Failed',
        },
        luRow,
      ]
    case 'completed':
      return [
        { kind: 'completed', name: shen, color: 'cyan', sub: `${fe} · ${dur(188, zh)} · 14:32`, status: zh ? '任务完成' : 'Done' },
        luRow,
      ]
  }
}

function StatusSymbol({ kind, size }: { kind: EventKind; size: number }) {
  if (kind === 'running') return null
  const path =
    kind === 'error' ? (
      <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />
    ) : kind === 'approval' ? (
      <>
        <path d="M12 7v6.2" />
        <path d="M12 16.6h.01" />
      </>
    ) : (
      <path d="M7.6 12.4l3 3 5.8-6.6" />
    )
  return (
    <svg className={`mi-sym mi-sym--${kind}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" />
      <g fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {path}
      </g>
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg width="13" height="15" viewBox="0 0 17 20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM11.6 3c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"
      />
    </svg>
  )
}

const CODE: [string, string][][] = [
  [['k', 'import'], ['p', ' { useState } '], ['k', 'from'], ['s', " 'react'"]],
  [['k', 'import'], ['p', ' { z } '], ['k', 'from'], ['s', " 'zod'"]],
  [],
  [['k', 'const'], ['p', ' schema = z.'], ['f', 'object'], ['p', '({']],
  [['p', '  email: z.'], ['f', 'string'], ['p', '().'], ['f', 'email'], ['p', '(),']],
  [['p', '  password: z.'], ['f', 'string'], ['p', '().'], ['f', 'min'], ['p', '('], ['n', '8'], ['p', '),']],
  [['p', '})']],
  [],
  [['k', 'export function'], ['f', ' LoginForm'], ['p', '() {']],
  [['k', '  const'], ['p', ' [email, setEmail] = '], ['f', 'useState'], ['p', '('], ['s', "''"], ['p', ')']],
  [['k', '  const'], ['p', ' [error, setError] = '], ['f', 'useState'], ['p', '<'], ['t', 'string'], ['p', '>()']],
  [],
  [['k', '  return'], ['p', ' (']],
  [['p', '    <'], ['t', 'form'], ['a', ' className'], ['p', '='], ['s', '"login"'], ['p', '>']],
  [['p', '      <'], ['t', 'Field'], ['a', ' label'], ['p', '='], ['s', '"Email"'], ['p', ' />']],
  [['p', '      <'], ['t', 'Button'], ['a', ' type'], ['p', '='], ['s', '"submit"'], ['p', '>…</'], ['t', 'Button'], ['p', '>']],
  [['p', '    </'], ['t', 'form'], ['p', '>']],
  [['p', '  )']],
  [['p', '}']],
]

function Desktop({ compact, zh }: { compact: boolean; zh: boolean }) {
  const menus = zh ? ['文件', '编辑', '选择', '查看', '前往', '运行'] : ['File', 'Edit', 'Selection', 'View', 'Go', 'Run']
  return (
    <div className="mi-desk" aria-hidden="true">
      <div className="mi-menubar">
        <div className="mi-menubar__left">
          <AppleLogo />
          <b>Code</b>
          {!compact && menus.map((m) => <span key={m}>{m}</span>)}
        </div>
        <div className="mi-menubar__right">
          {!compact && (
            <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
              <path d="M8 11.2l2-2.4a3 3 0 00-4 0zM3.4 5.8l1.4 1.6a4.8 4.8 0 016.4 0l1.4-1.6a7 7 0 00-9.2 0zM.6 3.1L2 4.7a9 9 0 0112 0l1.4-1.6a11 11 0 00-14.8 0z" fill="currentColor" />
            </svg>
          )}
          <span className="mi-batt"><i /></span>
          <span className="mi-clock">{compact ? '14:32' : zh ? '周五 14:32' : 'Fri 2:32 PM'}</span>
        </div>
      </div>
      <div className="mi-window">
        <div className="mi-window__bar">
          <span className="mi-dots"><i /><i /><i /></span>
          <span className="mi-window__title">LoginForm.tsx — atolla-app</span>
        </div>
        <div className="mi-window__body">
          {!compact && (
            <div className="mi-side">
              <small>{zh ? '资源管理器' : 'EXPLORER'}</small>
              {['src', '  components', '    LoginForm.tsx', '    Field.tsx', '  api.ts', 'package.json'].map((f) => (
                <span key={f} className={f.includes('LoginForm') ? 'is-on' : ''} style={{ paddingLeft: `${(f.length - f.trimStart().length) * 4 + 10}px` }}>
                  {f.trim()}
                </span>
              ))}
            </div>
          )}
          <div className="mi-code">
            {(compact ? CODE.slice(0, 9) : CODE).map((line, i) => (
              <div key={i} className="mi-code__line">
                <em>{i + 1}</em>
                {line.map(([c, txt], j) => (
                  <span key={j} className={`c-${c}`}>
                    {txt}
                  </span>
                ))}
                {i === 10 && <span className="mi-caret" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Island({
  kind,
  phase,
  rows,
  zh,
  onToggle,
}: {
  kind: Kind
  phase: Phase
  rows: Row[]
  zh: boolean
  onToggle: () => void
}) {
  const expanded = phase === 'expanded'
  const top = rows[0]
  const listH = rows.length ? rows.length * 40 + 8 : 58
  return (
    <div className={`mi-island-wrap is-${phase} is-${kind}`}>
      <button
        type="button"
        className="mi-island"
        style={{ height: expanded ? 29 + listH : undefined }}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={zh ? 'Atolla 灵动岛' : 'Atolla island'}
      >
        <span className="mi-flare mi-flare--l" />
        <span className="mi-flare mi-flare--r" />
        <span className="mi-island__clip">
        <span className="mi-island__content">
          <span className="mi-island__head">
            <span className="mi-x">×</span>
          </span>
          <span className="mi-island__list">
            {rows.length === 0 ? (
              <span className="mi-empty">
                <span className="mi-empty__icon">
                  <i />
                  <i />
                  <i />
                </span>
                {zh ? '暂无数字人事件' : 'No agent events'}
              </span>
            ) : (
              rows.map((r, i) => (
                <span className="mi-row" key={`${r.kind}-${i}`} style={{ transitionDelay: expanded ? `${180 + i * 70}ms` : '0ms' }}>
                  <span className="mi-row__icon">
                    {r.kind === 'running' ? <JellyAvatar color={r.color} size={22} state="working" /> : <StatusSymbol kind={r.kind} size={22} />}
                  </span>
                  <span className="mi-row__text">
                    <b>{r.name}</b>
                    <small>{r.sub}</small>
                  </span>
                  <span className={`mi-row__status mi-c--${r.kind}`}>{r.status}</span>
                </span>
              ))
            )}
          </span>
        </span>
        </span>
      </button>
      {top && (
        <span className={`mi-badge mi-c--${top.kind}`} aria-hidden="true">
          {top.kind === 'running' ? <JellyAvatar color={top.color} size={12} state="working" /> : <StatusSymbol kind={top.kind} size={11} />}
          <em>{rows.length}</em>
        </span>
      )}
    </div>
  )
}

export default function MacIslandSection() {
  const { t, locale } = useI18n()
  const zh = locale === 'zh'
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useState(false)
  const [closeScale, setCloseScale] = useState(1)
  const [inView, setInView] = useState(false)
  const [reduced] = useState(() => prefersReducedMotion())
  const [stepIdx, setStepIdx] = useState(0)
  const [manual, setManual] = useState<{ kind: Kind; phase: Phase } | null>(() =>
    prefersReducedMotion() ? { kind: 'running', phase: 'expanded' } : null,
  )
  const [tick, setTick] = useState(0)

  const step = SCRIPT[stepIdx]
  const kind = manual?.kind ?? step.kind
  const phase = manual?.phase ?? step.phase
  const rows = rowsFor(kind, zh, tick)

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const update = () => {
      const w = el.clientWidth
      setCompact(w < 640)
      setCloseScale(Math.min(1.25, (Math.min(w, 491) - 16) / 380))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 自动演示：按脚本推进
  useEffect(() => {
    if (manual || !inView || reduced) return undefined
    const id = window.setTimeout(() => setStepIdx((i) => (i + 1) % SCRIPT.length), SCRIPT[stepIdx].ms)
    return () => window.clearTimeout(id)
  }, [stepIdx, manual, inView, reduced])

  // 手动：并入动画结束后展开；静置一段时间后恢复自动
  useEffect(() => {
    if (!manual) return undefined
    if (manual.phase === 'merging') {
      const id = window.setTimeout(() => setManual((m) => (m ? { ...m, phase: 'expanded' } : m)), MERGE_MS)
      return () => window.clearTimeout(id)
    }
    if (reduced) return undefined
    const resume = window.setTimeout(() => {
      const next = (KINDS.indexOf(manual.kind) + 1) % KINDS.length
      setStepIdx(SCRIPT.findIndex((s) => s.kind === KINDS[next]))
      setManual(null)
    }, 9000)
    return () => window.clearTimeout(resume)
  }, [manual, reduced])

  // 运行时长每秒递增（与真实岛 1s TimelineView 一致）
  useEffect(() => {
    if (!inView || reduced) return undefined
    const id = window.setInterval(() => setTick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  const pick = (k: Kind) => setManual({ kind: k, phase: k === 'idle' ? 'collapsed' : 'merging' })
  const toggle = () => {
    if (phase === 'expanded') setManual({ kind, phase: 'collapsed' })
    else setManual({ kind, phase: 'expanded' })
  }

  const island = <Island kind={kind} phase={phase} rows={rows} zh={zh} onToggle={toggle} />
  const points = [1, 2, 3].map((n) => ({ title: t(`island.point${n}.title`), body: t(`island.point${n}.body`) }))

  return (
    <div className="mac-island" ref={rootRef}>
      <div className="mac-island__stage" ref={stageRef}>
        {compact ? (
          <div className="mi-close" style={{ width: 380 * closeScale + 16, height: 300 * closeScale + 16 }}>
            <div className="mi-close__canvas" style={{ transform: `scale(${closeScale})` }}>
              <Desktop compact zh={zh} />
              {island}
            </div>
          </div>
        ) : (
          <MacBookFrame className="macbook--island" label={t('island.frameLabel')}>
            <div className="mi-full">
              <Desktop compact={false} zh={zh} />
              <div className="mi-full__island">{island}</div>
            </div>
          </MacBookFrame>
        )}
      </div>

      <div className="mac-island__controls">
        <div className="mi-pills" role="group" aria-label={t('island.pillsLabel')}>
          {KINDS.map((k) => (
            <button key={k} type="button" className={`mi-pill ${k === kind ? 'is-on' : ''}`} aria-pressed={k === kind} onClick={() => pick(k)}>
              <span className={`mi-dot mi-c--${k}`} />
              {t(`island.state.${k}`)}
            </button>
          ))}
        </div>
        <p className="mi-caption">{t(`island.caption.${kind}`)}</p>
      </div>

      <ol className="mi-points">
        {points.map((p, i) => (
          <li key={i}>
            <span className="mi-points__num">{i + 1}</span>
            <div>
              <strong>{p.title}</strong>
              <p>{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mi-meta">{t('island.meta')}</p>
    </div>
  )
}
