import { useState } from 'react'
import { DemoFrame, EngineMark, PlayButton, Seg } from './shared'
import { ENGINE_META, useInView, useStepper, useZh, type EngineId } from './hooks'

type Mode = 'before' | 'after'
type Kind = 'text' | 'tool' | 'command' | 'usage' | 'plan'

const FORMAT: Record<EngineId, string> = {
  claude: 'stream-json + hooks',
  codex: 'exec --json + resume',
  cursor: 'agent JSON + resume',
}

const EVENTS: Array<{ engine: EngineId; kind: Kind; agent: { zh: string; en: string }; zh: string; en: string }> = [
  { engine: 'claude', kind: 'plan', agent: { zh: '林晓晴 · 产品', en: 'Lin · PM' }, zh: '任务规划：3 个步骤', en: 'Task plan: 3 steps' },
  { engine: 'codex', kind: 'text', agent: { zh: '陆景行 · Go 后端', en: 'Lu · Go backend' }, zh: '正在阅读 handler/auth.go …', en: 'Reading handler/auth.go …' },
  { engine: 'cursor', kind: 'tool', agent: { zh: '沈清禾 · 前端', en: 'Shen · Frontend' }, zh: '编辑 src/Login.tsx', en: 'Edit src/Login.tsx' },
  { engine: 'codex', kind: 'command', agent: { zh: '陆景行 · Go 后端', en: 'Lu · Go backend' }, zh: 'go test ./... 已授权', en: 'go test ./... approved' },
  { engine: 'claude', kind: 'text', agent: { zh: '林晓晴 · 产品', en: 'Lin · PM' }, zh: '验收标准已更新到需求文档', en: 'Acceptance criteria updated' },
  { engine: 'cursor', kind: 'usage', agent: { zh: '沈清禾 · 前端', en: 'Shen · Frontend' }, zh: '上下文用量 38%', en: 'Context usage 38%' },
]

const KIND_LABEL: Record<Kind, { zh: string; en: string }> = {
  text: { zh: '文本', en: 'text' },
  tool: { zh: '工具', en: 'tool' },
  command: { zh: '命令', en: 'command' },
  usage: { zh: '用量', en: 'usage' },
  plan: { zh: '规划', en: 'plan' },
}

const ORDER: EngineId[] = ['claude', 'codex', 'cursor']

export default function EngineHubDemo() {
  const zh = useZh()
  const [mode, setMode] = useState<Mode>('after')
  const [playing, setPlaying] = useState(true)
  const [ref, inView] = useInView<HTMLDivElement>()
  const [t] = useStepper(1_000_000, mode === 'after' ? 1400 : 1700, playing && inView)

  return (
    <DemoFrame
      title={zh ? '多引擎 → 统一入口' : 'Many engines → one entry'}
      controls={
        <>
          <Seg
            label={zh ? '对比' : 'Compare'}
            value={mode}
            onChange={setMode}
            options={[
              { value: 'before', label: zh ? '以前：来回切' : 'Before' },
              { value: 'after', label: zh ? 'Atolla：一个入口' : 'With Atolla' },
            ]}
          />
          <PlayButton playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </>
      }
      caption={
        zh
          ? '三种 CLI 的输出格式各不相同；Atolla 的适配器把它们归一为文本、工具、命令、用量与规划事件，进入同一条时间线。'
          : 'Each CLI speaks its own format; Atolla adapters normalize them into text, tool, command, usage and plan events on one timeline.'
      }
    >
      <div ref={ref}>{mode === 'before' ? <Before t={t} zh={zh} /> : <After t={t} zh={zh} />}</div>
    </DemoFrame>
  )
}

function Before({ t, zh }: { t: number; zh: boolean }) {
  const focus = ORDER[t % 3]
  return (
    <div className="eh-before">
      <div className="eh-stack">
        {ORDER.map((id, i) => (
          <div key={id} className={`eh-term ${focus === id ? 'is-focus' : ''}`} style={{ ['--i' as string]: i }}>
            <div className="eh-term__bar">
              <span className="eh-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>{ENGINE_META[id].bin} — ~/project</span>
            </div>
            <div className="eh-term__body">
              <p className="eh-dim">$ {ENGINE_META[id].bin}</p>
              <p>{zh ? '> 上次聊到哪了？' : '> where were we?'}</p>
              <p className="eh-warn">{zh ? '新会话 · 不认识其他窗口的上下文' : 'new session · no context from other windows'}</p>
            </div>
          </div>
        ))}
      </div>
      <ul className="eh-pains">
        <li><b>{t}</b>{zh ? ' 次窗口切换' : ' window switches'}</li>
        <li>{zh ? '三套登录、三份额度、三种输出格式' : 'Three logins, three quotas, three formats'}</li>
        <li>{zh ? '谁在跑、谁在等授权，只能逐个窗口去看' : 'Who is running or waiting? Check every window'}</li>
      </ul>
    </div>
  )
}

function After({ t, zh }: { t: number; zh: boolean }) {
  const shown = Array.from({ length: Math.min(t + 1, 5) }, (_, k) => {
    const idx = t - k
    return { ...EVENTS[((idx % EVENTS.length) + EVENTS.length) % EVENTS.length], key: idx }
  })
  const hot = shown[0]?.engine
  return (
    <div className="eh-after">
      <div className="eh-lanes">
        {ORDER.map((id) => (
          <div key={id} className={`eh-lane ${hot === id ? 'is-hot' : ''}`}>
            <EngineMark id={id} size={26} />
            <div className="eh-lane__text">
              <strong>{ENGINE_META[id].name}</strong>
              <code>{FORMAT[id]}</code>
            </div>
            <span className="eh-lane__wire" aria-hidden="true"><i /></span>
          </div>
        ))}
      </div>
      <div className="eh-adapter">
        <span className="eh-adapter__title">{zh ? 'Atolla 适配层' : 'Atolla adapters'}</span>
        <code>AskEvent</code>
        <span className="eh-adapter__sub">SSE →</span>
      </div>
      <div className="eh-timeline" aria-live="polite">
        <div className="eh-timeline__head">{zh ? '统一时间线' : 'Unified timeline'}</div>
        {shown.map((e, i) => (
          <div key={e.key} className={`eh-event ${i === 0 ? 'is-new' : ''}`}>
            <EngineMark id={e.engine} size={20} />
            <div className="eh-event__body">
              <span className="eh-event__agent">{zh ? e.agent.zh : e.agent.en}</span>
              <span className="eh-event__text">{zh ? e.zh : e.en}</span>
            </div>
            <span className={`eh-kind eh-kind--${e.kind}`}>{zh ? KIND_LABEL[e.kind].zh : KIND_LABEL[e.kind].en}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
