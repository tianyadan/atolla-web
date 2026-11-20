import { useState } from 'react'
import { DemoFrame, PlayButton, Seg } from './shared'
import { useInView, useStepper, useZh } from './hooks'

type NodeId = 'phone' | 'relay' | 'desktop' | 'backend' | 'db' | 'engines' | 'workspace'
type Flow = 'run' | 'remote' | 'approve'
type LinkId = 'phone-relay' | 'relay-backend' | 'desktop-backend' | 'backend-db' | 'backend-engines' | 'engines-workspace'

const NODES: Record<NodeId, { zh: [string, string]; en: [string, string]; icon: string }> = {
  phone: { zh: ['移动端', 'iOS App · 灵动岛'], en: ['Mobile', 'iOS app · Live Activity'], icon: 'phone' },
  relay: { zh: ['自托管中继', 'Node.js · SQLite'], en: ['Self-hosted relay', 'Node.js · SQLite'], icon: 'server' },
  desktop: { zh: ['桌面端界面', 'Electron · React'], en: ['Desktop UI', 'Electron · React'], icon: 'window' },
  backend: { zh: ['Atolla 后端', 'Go · Gin · 权限网关'], en: ['Atolla backend', 'Go · Gin · gateway'], icon: 'core' },
  db: { zh: ['平台数据', 'SQLite（默认）/ MySQL'], en: ['Platform data', 'SQLite (default) / MySQL'], icon: 'db' },
  engines: { zh: ['本机引擎', 'claude · codex · agent'], en: ['Local engines', 'claude · codex · agent'], icon: 'cpu' },
  workspace: { zh: ['工作区', '授权目录 · 本机文件'], en: ['Workspace', 'Scoped folders · local files'], icon: 'folder' },
}

const DETAIL: Record<NodeId, { zh: string[]; en: string[] }> = {
  phone: {
    zh: ['通过中继查看数字员工、对话与任务状态，可发送任务、上传图片、处理待审批命令。', 'iOS 灵动岛按「报错 > 待审批 > 运行中 > 已完成」展示最高优先级状态。', '不运行任何引擎：电脑离线时只能看到最近的缓存镜像。'],
    en: ['Views agents, chats and task state through the relay; can send tasks, upload images and decide approvals.', 'The iOS Live Activity shows the top state: error > approval > running > done.', 'Runs no engine: when the computer is offline it only shows the last cached mirror.'],
  },
  relay: {
    zh: ['部署在你自己的 Linux 服务器上（systemd 托管，默认端口 3080）。', '按 instance_id 保存缓存镜像，并维护一个「指令信箱」：pending → leased → done。', '服务器永不主动连回电脑；只接受已注册的 action，未知指令一律拒绝。'],
    en: ['Runs on your own Linux server (systemd, default port 3080).', 'Keeps a cache mirror per instance_id plus a command mailbox: pending → leased → done.', 'Never dials into your computer; only registered actions are accepted.'],
  },
  desktop: {
    zh: ['Electron 桌面版自动拉起内置 Go 后端，并复用同一套 React 工作台。', '流式对话、员工管理、技能商店、审批卡片、设置都在这里完成。', '当前提供 macOS Apple 芯片版本。'],
    en: ['The Electron app starts the bundled Go backend and reuses the React workspace.', 'Streaming chat, agent management, skills, approvals and settings live here.', 'Currently shipped for macOS on Apple silicon.'],
  },
  backend: {
    zh: ['agent 适配器把三种 CLI 输出归一为统一事件，通过 SSE 推给界面。', '权限网关（Hard Deny → 员工策略 → 只读规则 → 会话授权 → JEV）决定 ALLOW / DENY / REVIEW。', 'RemoteBridge 负责注册、心跳、长轮询领取指令和推送镜像。'],
    en: ['Engine adapters normalize three CLIs into one event stream, pushed over SSE.', 'The permission gateway (Hard Deny → policy → read-only → session grant → JEV) returns ALLOW / DENY / REVIEW.', 'RemoteBridge registers, heartbeats, long-polls for commands and pushes mirrors.'],
  },
  db: {
    zh: ['默认 SQLite，免 Docker；需要时可在设置页验证并迁移到 MySQL。', '保存员工、对话、消息、审批、任务队列与命令审计。', '桌面版数据库位于 ~/Library/Application Support/Atolla/data/atolla.db。'],
    en: ['SQLite by default, no Docker; migrate to MySQL from settings when needed.', 'Stores agents, conversations, messages, approvals, the queue and audits.', 'Desktop DB: ~/Library/Application Support/Atolla/data/atolla.db.'],
  },
  engines: {
    zh: ['Atolla 不内置模型，调用你电脑上已登录的 Claude Code、Codex CLI、Cursor Agent。', '每位数字员工绑定一种引擎，引擎原生 Session 通过 engine_session_id 续接。', '订阅与额度属于你自己的账号，Atolla 只读取用量用于展示。'],
    en: ['Atolla ships no model; it drives the Claude Code, Codex CLI and Cursor Agent you are already signed in to.', 'Each agent binds one engine; native sessions resume via engine_session_id.', 'Subscriptions stay in your own accounts; Atolla only reads usage for display.'],
  },
  workspace: {
    zh: ['引擎进程以员工的工作区作为 cwd，在你授权的目录中读写。', '开启「限制工作区」时，路径会规范化（处理 .. 与符号链接）后再做越界检查。', '文件始终留在本机，不会同步到中继。'],
    en: ['Engines run with the agent workspace as cwd and work inside folders you allow.', 'With workspace restriction on, paths are normalized (.. and symlinks) before the bounds check.', 'Files stay on your machine and are never synced to the relay.'],
  },
}

const FLOWS: Record<Flow, { links: Partial<Record<LinkId, 'fwd' | 'back' | 'both'>>; nodes: NodeId[]; zh: string[]; en: string[] }> = {
  run: {
    links: { 'desktop-backend': 'fwd', 'backend-engines': 'both', 'engines-workspace': 'both', 'backend-db': 'fwd' },
    nodes: ['desktop', 'backend', 'engines', 'workspace', 'db'],
    zh: ['你在桌面端给员工派发任务', '后端组装提示词与工作区，拉起本机引擎', '引擎在授权工作区里读写文件', '输出被归一为事件，经 SSE 流回界面并落库'],
    en: ['You hand a task to an agent on the desktop', 'The backend builds the prompt and starts the local engine', 'The engine reads and writes inside the scoped workspace', 'Output becomes unified events, streamed over SSE and persisted'],
  },
  remote: {
    links: { 'phone-relay': 'fwd', 'relay-backend': 'back', 'backend-engines': 'both', 'backend-db': 'fwd' },
    nodes: ['phone', 'relay', 'backend', 'engines', 'db'],
    zh: ['手机在中继上下发任务，进入指令信箱', '电脑通过出站长轮询领取指令（服务器不连回电脑）', '电脑本地执行，复用同一套队列与权限网关', '结果以镜像推回中继，手机按消息 ID 合并'],
    en: ['The phone drops a task into the relay mailbox', 'The computer picks it up via outbound long-poll (the relay never dials in)', 'It runs locally with the same queue and gateway', 'Results are mirrored back; the phone merges by message ID'],
  },
  approve: {
    links: { 'backend-engines': 'back', 'relay-backend': 'fwd', 'phone-relay': 'both', 'desktop-backend': 'back' },
    nodes: ['engines', 'backend', 'relay', 'phone', 'desktop'],
    zh: ['引擎准备执行一条有副作用的命令', '权限网关判定为 REVIEW，生成待审批记录', '桌面卡片、手机与灵动岛同时提示', '任一端做出决定（只能成功提交一次），引擎继续或收到拒绝'],
    en: ['The engine is about to run a command with side effects', 'The gateway returns REVIEW and creates a pending approval', 'Desktop card, phone and Live Activity all prompt you', 'Any one device decides (exactly once); the engine continues or is refused'],
  },
}

export default function ArchitectureDemo() {
  const zh = useZh()
  const L = zh ? 'zh' : 'en'
  const [flow, setFlow] = useState<Flow>('run')
  const [selected, setSelected] = useState<NodeId>('backend')
  const [playing, setPlaying] = useState(true)
  const [ref, inView] = useInView<HTMLDivElement>()
  const f = FLOWS[flow]
  const [step] = useStepper(f.zh.length, 2200, playing && inView)
  const activeNode = f.nodes[Math.min(step, f.nodes.length - 1)]

  const node = (id: NodeId) => {
    const n = NODES[id][L]
    const on = f.nodes.includes(id)
    return (
      <button
        type="button"
        className={`arch-node ${on ? 'is-on' : ''} ${selected === id ? 'is-selected' : ''} ${activeNode === id ? 'is-hot' : ''}`}
        onClick={() => setSelected(id)}
        aria-pressed={selected === id}
      >
        <span className="arch-node__icon" aria-hidden="true"><ArchIcon name={NODES[id].icon} /></span>
        <span className="arch-node__text">
          <strong>{n[0]}</strong>
          <small>{n[1]}</small>
        </span>
      </button>
    )
  }
  const link = (id: LinkId, orient: 'h' | 'v') => {
    const dir = f.links[id]
    return <span className={`arch-link arch-link--${orient} ${dir ? `is-on is-${dir}` : ''}`} aria-hidden="true"><i /><i /></span>
  }

  return (
    <DemoFrame
      title={zh ? '系统架构 · 数据流' : 'System architecture · data flow'}
      controls={
        <>
          <Seg
            label={zh ? '场景' : 'Scenario'}
            value={flow}
            onChange={setFlow}
            options={[
              { value: 'run', label: zh ? '本机执行' : 'Local run' },
              { value: 'remote', label: zh ? '手机下发' : 'From phone' },
              { value: 'approve', label: zh ? '命令审批' : 'Approval' },
            ]}
          />
          <PlayButton playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </>
      }
      caption={zh ? '点击任意节点查看它的职责；切换场景观察数据包的流向。' : 'Click any node to see its role; switch scenarios to follow the packets.'}
    >
      <div className="arch" ref={ref}>
        <div className="arch-col arch-col--edge">{node('phone')}</div>
        {link('phone-relay', 'h')}
        <div className="arch-col arch-col--edge">{node('relay')}</div>
        {link('relay-backend', 'h')}
        <div className="arch-col arch-col--core">
          <div className="arch-core-label">{zh ? '你的电脑' : 'Your computer'}</div>
          {node('desktop')}
          {link('desktop-backend', 'v')}
          {node('backend')}
          {link('backend-db', 'v')}
          {node('db')}
        </div>
        {link('backend-engines', 'h')}
        <div className="arch-col arch-col--right">
          {node('engines')}
          {link('engines-workspace', 'v')}
          {node('workspace')}
        </div>
      </div>

      <ol className="arch-steps">
        {f[L].map((s, i) => (
          <li key={s} className={i === step ? 'is-on' : i < step ? 'is-done' : ''}>
            <span>{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <div className="arch-detail" key={selected + L}>
        <p className="arch-detail__title">
          {NODES[selected][L][0]} <small>{NODES[selected][L][1]}</small>
        </p>
        <ul>
          {DETAIL[selected][L].map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </DemoFrame>
  )
}

function ArchIcon({ name }: { name: string }) {
  const p = { stroke: 'currentColor', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'phone':
      return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="5.5" y="2" width="9" height="16" rx="2.2" {...p} /><path d="M8.5 4.2h3" {...p} /></svg>
    case 'server':
      return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="3" y="3.5" width="14" height="5" rx="1.4" {...p} /><rect x="3" y="11.5" width="14" height="5" rx="1.4" {...p} /><path d="M6 6h.01M6 14h.01" {...p} strokeWidth={2.2} /></svg>
    case 'window':
      return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="2.5" y="3.5" width="15" height="11" rx="1.6" {...p} /><path d="M7 17.5h6M10 14.5v3" {...p} /></svg>
    case 'core':
      return <svg width="18" height="18" viewBox="0 0 20 20"><path d="M10 2.5 16.5 6v8L10 17.5 3.5 14V6z" {...p} /><path d="M10 10v7.5M10 10l6.5-4M10 10 3.5 6" {...p} /></svg>
    case 'db':
      return <svg width="18" height="18" viewBox="0 0 20 20"><ellipse cx="10" cy="5" rx="6" ry="2.3" {...p} /><path d="M4 5v10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3V5M4 10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3" {...p} /></svg>
    case 'cpu':
      return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="1.6" {...p} /><path d="M8 2.5v2.5M12 2.5v2.5M8 15v2.5M12 15v2.5M2.5 8H5M2.5 12H5M15 8h2.5M15 12h2.5" {...p} /></svg>
    default:
      return <svg width="18" height="18" viewBox="0 0 20 20"><path d="M2.5 5.5a1.5 1.5 0 0 1 1.5-1.5h3.6l1.6 2h6.8a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5z" {...p} /></svg>
  }
}
