import { useEffect, useState } from 'react'
import JellyAvatar from '../../jelly/JellyAvatar'
import { DemoFrame, ReplayButton, Seg } from './shared'
import { useInView, useZh } from './hooks'

type Scenario = 'review' | 'deny' | 'granted'
type Gate = 'hard' | 'policy' | 'readonly' | 'session' | 'jev'
type Verdict = 'pass' | 'skip' | 'stop' | 'allow' | 'review' | 'idle'
type Decision = 'none' | 'deny' | 'once' | 'session'

const GATES: Array<{ id: Gate; zh: string; en: string }> = [
  { id: 'hard', zh: 'Hard Deny', en: 'Hard Deny' },
  { id: 'policy', zh: '员工权限', en: 'Agent policy' },
  { id: 'readonly', zh: '安全只读', en: 'Safe read-only' },
  { id: 'session', zh: '会话授权', en: 'Session grant' },
  { id: 'jev', zh: 'JEV 审核', en: 'JEV review' },
]

const SC: Record<Scenario, { cmd: string; verdicts: Verdict[] }> = {
  review: { cmd: 'npm install zod', verdicts: ['pass', 'pass', 'skip', 'skip', 'review'] },
  deny: { cmd: 'sudo shutdown -h now', verdicts: ['stop', 'idle', 'idle', 'idle', 'idle'] },
  granted: { cmd: 'npm install zod', verdicts: ['pass', 'pass', 'skip', 'allow', 'idle'] },
}

export default function ApprovalDemo() {
  const zh = useZh()
  const [sc, setSc] = useState<Scenario>('review')
  const [run, setRun] = useState(0)
  return (
    <DemoFrame
      title={zh ? '远程命令审批' : 'Remote command approval'}
      controls={
        <>
          <Seg
            label={zh ? '场景' : 'Scenario'}
            value={sc}
            onChange={setSc}
            options={[
              { value: 'review', label: zh ? '需要审批' : 'Needs review' },
              { value: 'deny', label: zh ? '命中底线' : 'Hard Deny' },
              { value: 'granted', label: zh ? '已会话授权' : 'Session grant' },
            ]}
          />
          <ReplayButton onClick={() => setRun((r) => r + 1)} />
        </>
      }
      caption={
        zh
          ? '有副作用的动作逐层经过权限网关；无法安全自动决定时进入人工审批。你可以在电脑、手机或灵动岛上处理，同一条审批只会成功提交一次。'
          : 'Actions with side effects pass the gateway stage by stage; anything that cannot be decided safely goes to you — on the computer, phone or Live Activity, decided exactly once.'
      }
    >
      <ApprovalStage key={`${sc}-${run}`} sc={sc} zh={zh} />
    </DemoFrame>
  )
}

function ApprovalStage({ sc, zh }: { sc: Scenario; zh: boolean }) {
  const [gate, setGate] = useState(-1)
  const [decision, setDecision] = useState<Decision>('none')
  const [ref, inView] = useInView<HTMLDivElement>()
  const verdicts = SC[sc].verdicts
  const lastGate = verdicts.findIndex((v) => v === 'stop' || v === 'allow' || v === 'review')

  useEffect(() => {
    if (!inView || gate >= lastGate) return undefined
    const id = window.setTimeout(() => setGate((g) => g + 1), gate < 0 ? 1200 : 650)
    return () => window.clearTimeout(id)
  }, [gate, lastGate, inView])

  const settled = gate >= lastGate
  const final: 'allow' | 'deny' | 'review' | 'running' = !settled
    ? 'running'
    : verdicts[lastGate] === 'stop'
      ? 'deny'
      : verdicts[lastGate] === 'allow'
        ? 'allow'
        : decision === 'none'
          ? 'review'
          : decision === 'deny'
            ? 'deny'
            : 'allow'

  const islandOpen = settled && sc === 'review' && decision === 'none'
  const cmd = SC[sc].cmd

  const termLines: Array<{ cls: string; text: string }> = [
    { cls: 'dim', text: zh ? '沈清禾 · 前端 · Codex' : 'Shen · Frontend · Codex' },
    { cls: '', text: zh ? '› 给登录表单加上类型校验' : '› add schema validation to the login form' },
    { cls: 'ok', text: zh ? '✓ 读取 src/Login.tsx' : '✓ read src/Login.tsx' },
    { cls: 'cmd', text: `$ ${cmd}` },
  ]
  if (final === 'running') termLines.push({ cls: 'dim', text: zh ? '… 权限网关判定中' : '… gateway evaluating' })
  if (final === 'review') termLines.push({ cls: 'warn', text: zh ? '⏸ 等待审批（REVIEW）' : '⏸ waiting for approval (REVIEW)' })
  if (final === 'allow')
    termLines.push(
      { cls: 'ok', text: sc === 'granted' ? (zh ? '✓ 命中本会话的精确授权，直接放行' : '✓ matches this session’s exact grant') : decision === 'session' ? (zh ? '✓ 已允许，并记住本会话的这条命令' : '✓ allowed and remembered for this session') : zh ? '✓ 本次允许' : '✓ allowed once' },
      { cls: '', text: 'added 1 package in 2s' },
      { cls: 'ok', text: zh ? '✓ 任务继续执行' : '✓ task continues' },
    )
  if (final === 'deny')
    termLines.push(
      { cls: 'err', text: sc === 'deny' ? (zh ? '✕ 命中 Hard Deny，立即拒绝，任何授权都无法覆盖' : '✕ Hard Deny: refused, nothing can override it') : zh ? '✕ 你拒绝了这条命令，引擎收到拒绝结果' : '✕ you denied it; the engine receives the refusal' },
    )

  const audit = settled && final !== 'review'

  return (
      <div className="ap" ref={ref}>
        <div className="ap-gates" role="list">
          {GATES.map((g, i) => {
            const v = i <= gate ? verdicts[i] : 'idle'
            return (
              <div role="listitem" key={g.id} className={`ap-gate is-${v} ${i === gate + 1 && !settled ? 'is-next' : ''}`}>
                <span className="ap-gate__icon" aria-hidden="true">
                  {v === 'pass' ? '✓' : v === 'skip' ? '–' : v === 'stop' ? '✕' : v === 'allow' ? '✓' : v === 'review' ? '?' : i + 1}
                </span>
                <span className="ap-gate__name">{zh ? g.zh : g.en}</span>
                <small>
                  {v === 'pass' ? (zh ? '通过' : 'pass') : v === 'skip' ? (zh ? '不适用' : 'n/a') : v === 'stop' ? 'DENY' : v === 'allow' ? 'ALLOW' : v === 'review' ? 'REVIEW' : ''}
                </small>
              </div>
            )
          })}
        </div>

        <div className="ap-stage">
          <div className="ap-term">
            <div className="ap-term__bar">
              <span className="eh-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>Atolla — {zh ? '对话' : 'chat'}</span>
              <JellyAvatar color="sky" size={18} state={final === 'review' ? 'alert' : final === 'deny' ? 'error' : final === 'allow' ? 'celebrate' : 'coding'} />
            </div>
            <div className="ap-term__body">
              {termLines.map((l, i) => (
                <p key={`${l.text}-${i}`} className={`ap-line ap-line--${l.cls}`}>{l.text}</p>
              ))}
            </div>
          </div>

          <div className="ap-phone">
            <div className={`ap-island ${islandOpen ? 'is-open' : ''}`}>
              {islandOpen ? (
                <div className="ap-island__body">
                  <div className="ap-island__head">
                    <JellyAvatar color="sky" size={20} state="alert" />
                    <span>{zh ? '沈清禾 请求执行' : 'Shen requests'}</span>
                    <em>{zh ? '待审批' : 'Approval'}</em>
                  </div>
                  <code>{cmd}</code>
                  <div className="ap-island__btns">
                    <button type="button" className="ap-b ap-b--deny" onClick={() => setDecision('deny')}>{zh ? '拒绝' : 'Deny'}</button>
                    <button type="button" className="ap-b" onClick={() => setDecision('once')}>{zh ? '仅本次' : 'Once'}</button>
                    <button type="button" className="ap-b ap-b--ok" onClick={() => setDecision('session')}>{zh ? '本会话允许' : 'This session'}</button>
                  </div>
                </div>
              ) : (
                <span className={`ap-island__pill ap-island__pill--${final}`}>
                  {final === 'running' ? (zh ? '运行中' : 'Running') : final === 'allow' ? (zh ? '已放行' : 'Allowed') : final === 'deny' ? (zh ? '已拒绝' : 'Denied') : ''}
                </span>
              )}
            </div>
            <div className="ap-phone__screen">
              <span className="ap-phone__time">9:41</span>
              <p>{zh ? '点击灵动岛中的按钮来审批 →' : 'Decide right from the island →'}</p>
            </div>
          </div>
        </div>

        <div className={`ap-audit ${audit ? 'is-on' : ''}`}>
          <span>command_audits</span>
          <code>{cmd}</code>
          <b className={`ap-audit__v ap-audit__v--${final}`}>{final === 'allow' ? 'ALLOW' : final === 'deny' ? 'DENY' : '—'}</b>
          <small>
            {sc === 'deny'
              ? zh ? '决定者：Hard Deny' : 'by Hard Deny'
              : sc === 'granted'
                ? zh ? '决定者：会话授权' : 'by session grant'
                : decision === 'none'
                  ? ''
                  : zh ? `决定者：你（${decision === 'deny' ? '拒绝' : decision === 'once' ? '仅本次' : '本会话'}）` : `by you (${decision})`}
          </small>
        </div>
      </div>
  )
}
