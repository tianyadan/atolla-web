import { useEffect, useState } from 'react'
import JellyAvatar from '../../jelly/JellyAvatar'
import { DemoFrame, ReplayButton, Seg } from './shared'
import { useInView, useZh } from './hooks'

type Tab = 'mention' | 'group' | 'flow'

const P = {
  pm: { zh: '林晓晴', en: 'Lin', roleZh: '产品经理', roleEn: 'PM', color: 'purple' },
  fe: { zh: '沈清禾', en: 'Shen', roleZh: '前端', roleEn: 'Frontend', color: 'sky' },
  go: { zh: '陆景行', en: 'Lu', roleZh: 'Go 后端', roleEn: 'Go backend', color: 'cyan' },
  ops: { zh: '韩予澈', en: 'Han', roleZh: '运维', roleEn: 'Ops', color: 'coral' },
} as const
type PId = keyof typeof P

/** 简单的时间轴：step 每 ms 前进，到 max 停住；重播靠 key 重新挂载 */
function useTimeline(max: number, ms: number, running: boolean) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!running || step >= max) return undefined
    const id = window.setTimeout(() => setStep((s) => s + 1), ms)
    return () => window.clearTimeout(id)
  }, [running, step, max, ms])
  return [step, setStep] as const
}

export default function CollabDemo() {
  const zh = useZh()
  const [tab, setTab] = useState<Tab>('group')
  const [run, setRun] = useState(0)
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <DemoFrame
      title={zh ? '多员工协作' : 'Multi-agent collaboration'}
      controls={
        <>
          <Seg
            label={zh ? '协作方式' : 'Mode'}
            value={tab}
            onChange={(v) => { setTab(v); setRun((r) => r + 1) }}
            options={[
              { value: 'mention', label: zh ? '@ 委托' : '@ mention' },
              { value: 'group', label: zh ? '群聊' : 'Group chat' },
              { value: 'flow', label: zh ? '流程编排' : 'Workflow' },
            ]}
          />
          <ReplayButton onClick={() => setRun((r) => r + 1)} />
        </>
      }
      caption={
        tab === 'mention'
          ? zh ? '@ 委托：被点名的员工各自用自己的引擎、工作区和权限并行执行，结果写回发起人的对话。' : '@ mention: each named agent runs in parallel with its own engine, workspace and permissions; results return to the caller.'
          : tab === 'group'
            ? zh ? '群聊：3–5 名员工共享一条时间线，群主给出议题与顺序，成员串行发言，避免互相抢写。' : 'Group chat: 3–5 agents share one timeline; the host sets the agenda and members speak in turn.'
            : zh ? '流程编排：节点引用现有员工，支持并行、合并与人工审核；驳回会从指定节点开启新一轮尝试。' : 'Workflow: nodes reference existing agents, with parallel, merge and human review; a rejection restarts from a chosen node.'
      }
    >
      <div ref={ref} className="cb">
        {tab === 'mention' && <Mention key={`m${run}`} zh={zh} running={inView} />}
        {tab === 'group' && <Group key={`g${run}`} zh={zh} running={inView} />}
        {tab === 'flow' && <Flow key={`f${run}`} zh={zh} running={inView} />}
      </div>
    </DemoFrame>
  )
}

function Avatar({ id, state = 'idle', size = 30 }: { id: PId; state?: 'idle' | 'coding' | 'ponder' | 'celebrate'; size?: number }) {
  return <JellyAvatar color={P[id].color} size={size} state={state} />
}

function Mention({ zh, running }: { zh: boolean; running: boolean }) {
  const [s] = useTimeline(6, 900, running)
  const branch = (id: PId, doneAt: number, text: { zh: string; en: string }) => (
    <div className={`cb-branch ${s >= 2 ? 'is-on' : ''} ${s >= doneAt ? 'is-done' : ''}`}>
      <Avatar id={id} state={s >= doneAt ? 'celebrate' : s >= 2 ? 'coding' : 'idle'} />
      <div className="cb-branch__body">
        <strong>{zh ? P[id].zh : P[id].en}<small> · {zh ? P[id].roleZh : P[id].roleEn}</small></strong>
        <div className="cb-bar"><i style={{ width: s >= doneAt ? '100%' : s >= 2 ? `${Math.min(90, (s - 1) * 30)}%` : '0%' }} /></div>
        {s >= doneAt && <p>{zh ? text.zh : text.en}</p>}
      </div>
    </div>
  )
  return (
    <div className="cb-mention">
      <div className="cb-input">
        <Avatar id="pm" size={24} />
        <span>
          <mark>@{zh ? P.fe.zh : P.fe.en}</mark> <mark>@{zh ? P.go.zh : P.go.en}</mark>{' '}
          {zh ? '帮我评审一下登录改版的方案' : 'please review the new login flow'}
        </span>
        <span className={`cb-send ${s >= 1 ? 'is-sent' : ''}`}>{s >= 1 ? (zh ? '已分发' : 'Sent') : '↵'}</span>
      </div>
      <div className="cb-branches">
        {branch('fe', 4, { zh: '表单校验建议前置，错误提示需统一。', en: 'Validate earlier; unify error copy.' })}
        {branch('go', 5, { zh: '接口需补充限流与失败锁定。', en: 'Add rate limiting and lockout to the API.' })}
      </div>
      <div className={`cb-merge ${s >= 6 ? 'is-on' : ''}`}>
        {zh ? '2 条意见已写回林晓晴的对话，她继续汇总' : '2 replies written back to Lin’s chat for summary'}
      </div>
    </div>
  )
}

const GROUP_SCRIPT: Array<{ who: PId; zh: string; en: string }> = [
  { who: 'pm', zh: '议题：发布前检查。顺序：沈清禾 → 陆景行 → 韩予澈。', en: 'Agenda: pre-release check. Order: Shen → Lu → Han.' },
  { who: 'fe', zh: '前端构建通过，移动端布局已回归。', en: 'Frontend build passes; mobile layout re-checked.' },
  { who: 'go', zh: '接口测试全部通过，迁移脚本已就绪。', en: 'API tests pass; migration script ready.' },
  { who: 'ops', zh: '健康检查与回滚方案准备完毕。', en: 'Health checks and rollback plan ready.' },
  { who: 'pm', zh: '结论：可以发布。我来整理发布说明。', en: 'Conclusion: ship it. I’ll draft the notes.' },
]

function Group({ zh, running }: { zh: boolean; running: boolean }) {
  const [s] = useTimeline(GROUP_SCRIPT.length, 1500, running)
  const speaking = s < GROUP_SCRIPT.length ? GROUP_SCRIPT[s].who : null
  const members: PId[] = ['pm', 'fe', 'go', 'ops']
  return (
    <div className="cb-group">
      <div className="cb-members">
        {members.map((id) => (
          <div key={id} className={`cb-member ${speaking === id ? 'is-speaking' : ''}`}>
            <Avatar id={id} size={34} state={speaking === id ? 'coding' : 'idle'} />
            <span>{zh ? P[id].zh : P[id].en}</span>
            {id === 'pm' && <em>{zh ? '群主' : 'Host'}</em>}
          </div>
        ))}
      </div>
      <div className="cb-chat">
        {GROUP_SCRIPT.slice(0, s).map((m, i) => (
          <div key={i} className="cb-msg">
            <Avatar id={m.who} size={24} />
            <div>
              <span className="cb-msg__who">{zh ? P[m.who].zh : P[m.who].en}</span>
              <p>{zh ? m.zh : m.en}</p>
            </div>
          </div>
        ))}
        {speaking && (
          <div className="cb-msg cb-msg--typing">
            <Avatar id={speaking} size={24} state="ponder" />
            <span className="cb-typing" aria-hidden="true"><i /><i /><i /></span>
          </div>
        )}
      </div>
    </div>
  )
}

type FNode = { id: string; zh: string; en: string; kind: 'start' | 'agent' | 'review' | 'end' | 'gate'; who?: PId }
const FLOW_NODES: FNode[][] = [
  [{ id: 'start', zh: '开始', en: 'Start', kind: 'start' }],
  [{ id: 'pm', zh: '需求拆解', en: 'Spec', kind: 'agent', who: 'pm' }],
  [
    { id: 'fe', zh: '前端实现', en: 'Frontend', kind: 'agent', who: 'fe' },
    { id: 'go', zh: '后端实现', en: 'Backend', kind: 'agent', who: 'go' },
  ],
  [{ id: 'merge', zh: '合并', en: 'Merge', kind: 'gate' }],
  [{ id: 'review', zh: '人工审核', en: 'Human review', kind: 'review' }],
  [{ id: 'end', zh: '结束', en: 'End', kind: 'end' }],
]

function Flow({ zh, running }: { zh: boolean; running: boolean }) {
  // 列索引推进；到人工审核（4）时暂停等待用户
  const [col, setCol] = useTimeline(4, 1100, running)
  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [attempt, setAttempt] = useState(1)
  const reached = decision === 'approved' ? 5 : col
  const status = (c: number) => (c < reached ? 'done' : c === reached ? 'run' : 'idle')

  const approve = () => setDecision('approved')
  const reject = () => {
    setDecision('rejected')
    window.setTimeout(() => {
      setAttempt((a) => a + 1)
      setDecision('pending')
      setCol(2)
    }, 700)
  }

  return (
    <div className="cb-flow">
      <div className="cb-dag">
        {FLOW_NODES.map((colNodes, c) => (
          <div key={c} className="cb-dag__col">
            {colNodes.map((n) => (
              <div key={n.id} className={`cb-node cb-node--${n.kind} is-${status(c)}`}>
                {n.who ? <Avatar id={n.who} size={22} state={status(c) === 'run' ? 'coding' : 'idle'} /> : <span className="cb-node__dot" />}
                <span>{zh ? n.zh : n.en}</span>
                {n.id === 'fe' || n.id === 'go' ? attempt > 1 && <em>#{attempt}</em> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="cb-flow__foot">
        {reached === 4 && decision === 'pending' && (
          <>
            <span>{zh ? 'Run 进入 waiting，等待你的审核' : 'Run is waiting for your review'}</span>
            <button type="button" className="dm-btn" onClick={reject}>{zh ? '驳回 → 回到实现' : 'Reject → back to build'}</button>
            <button type="button" className="dm-btn dm-btn--primary" onClick={approve}>{zh ? '通过' : 'Approve'}</button>
          </>
        )}
        {decision === 'rejected' && <span>{zh ? '已驳回：从实现节点开启新一轮尝试…' : 'Rejected: starting a new attempt from build…'}</span>}
        {decision === 'approved' && <span className="cb-ok">{zh ? '✓ Run 成功，节点产出已写入员工记忆' : '✓ Run succeeded; node outputs saved to agent memory'}</span>}
        {reached < 4 && <span>{zh ? '并行分支同时执行，合并节点等待全部成功' : 'Parallel branches run together; merge waits for all'}</span>}
      </div>
    </div>
  )
}
