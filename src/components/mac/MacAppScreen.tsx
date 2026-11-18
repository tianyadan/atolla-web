import { useEffect, useMemo, useRef, useState } from 'react'
import JellyAvatar from '../../jelly/JellyAvatar'
import type { JellyState } from '../../jelly/jellySprite'
import {
  AUTH_COMMAND,
  MAC_CHATS,
  pickMacReply,
  type AuthPhase,
  type MacChatItem,
} from './macChats'
import './MacAppScreen.css'

export type MacAppScreenProps = {
  /** 授权演示：idle / pending / approved / denied */
  authPhase?: AuthPhase
  onAllow?: () => void
  onDeny?: () => void
  /** 覆盖头像状态（授权演示时） */
  jellyState?: JellyState
  className?: string
}

type FeedItem =
  | { kind: 'agent-intro'; id: string }
  | { kind: 'user'; id: string; text: string; withThumb?: boolean }
  | { kind: 'agent'; id: string; text: string; elapsed: string }
  | { kind: 'working'; id: string }
  | { kind: 'auth'; id: string }
  | { kind: 'command-done'; id: string }

/**
 * Atolla macOS 桌面应用界面：侧栏会话、主会话区、可交互输入。
 */
export default function MacAppScreen({
  authPhase = 'idle',
  onAllow,
  onDeny,
  jellyState,
  className = '',
}: MacAppScreenProps) {
  const [chatId, setChatId] = useState(MAC_CHATS[0].id)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(true)
  const [elapsed, setElapsed] = useState(18)
  const [feed, setFeed] = useState<FeedItem[]>(() => baseFeed())
  const feedRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  const chat = useMemo(
    () => MAC_CHATS.find((c) => c.id === chatId) ?? MAC_CHATS[0],
    [chatId],
  )

  const avatarState: JellyState =
    jellyState ?? (authPhase !== 'idle' ? (authPhase === 'pending' ? 'alert' : authPhase === 'approved' ? 'coding' : authPhase === 'denied' ? 'error' : 'idle') : busy ? 'typing' : 'idle')

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      const el = feedRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [feed, authPhase])

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  useEffect(() => {
    if (authPhase === 'pending') {
      setFeed((prev) => {
        if (prev.some((i) => i.kind === 'auth')) return prev
        return [
          ...prev.filter((i) => i.kind !== 'command-done' && i.kind !== 'working'),
          { kind: 'auth', id: `auth-${Date.now()}` },
        ]
      })
      setBusy(true)
    }
    if (authPhase === 'approved') {
      setFeed((prev) => {
        const withoutAuth = prev.filter((i) => i.kind !== 'auth' && i.kind !== 'working')
        if (withoutAuth.some((i) => i.kind === 'command-done')) return withoutAuth
        return [...withoutAuth, { kind: 'command-done', id: `done-${Date.now()}` }]
      })
      setBusy(true)
    }
    if (authPhase === 'denied') {
      setFeed((prev) => prev.filter((i) => i.kind !== 'auth'))
      setBusy(false)
    }
  }, [authPhase])

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  const selectChat = (item: MacChatItem) => {
    setChatId(item.id)
    setFeed(baseFeedFor(item))
    setBusy(item.status === '进行中')
    setElapsed(item.status === '进行中' ? 18 : 0)
    setDraft('')
  }

  const send = () => {
    const text = draft.trim()
    if (!text || authPhase === 'pending') return
    setDraft('')
    setFeed((prev) => [
      ...prev.filter((i) => i.kind !== 'working'),
      { kind: 'user', id: `u-${Date.now()}`, text },
    ])
    setBusy(true)
    const reply = pickMacReply(text)
    schedule(() => {
      setFeed((prev) => [
        ...prev,
        { kind: 'working', id: `w-${Date.now()}` },
      ])
    }, 220)
    schedule(() => {
      setFeed((prev) => [
        ...prev.filter((i) => i.kind !== 'working'),
        {
          kind: 'agent',
          id: `a-${Date.now()}`,
          text: reply,
          elapsed: `${Math.max(1, Math.floor(elapsed / 60))}m${String(elapsed % 60).padStart(2, '0')}s`,
        },
        ...(authPhase === 'approved' || authPhase === 'idle'
          ? ([{ kind: 'working', id: `w2-${Date.now()}` }] as FeedItem[])
          : []),
      ])
      setBusy(authPhase !== 'denied')
    }, 900)
  }

  const today = MAC_CHATS.filter((c) => c.group === 'today')
  const week = MAC_CHATS.filter((c) => c.group === 'week')

  return (
    <div className={`mac-app ${className}`.trim()}>
      <aside className="mac-app__sidebar">
        <header className="mac-app__side-top">
          <div className="mac-app__traffic" aria-hidden="true">
            <i className="is-close" />
            <i className="is-min" />
            <i className="is-max" />
          </div>
          <div className="mac-app__side-actions">
            <button type="button" className="mac-app__icon-btn" aria-label="新建">
              +
            </button>
            <button type="button" className="mac-app__icon-btn" aria-label="侧栏">
              <svg viewBox="0 0 18 18" width="14" height="14" aria-hidden="true">
                <rect x="2.5" y="3" width="13" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 3v12" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </header>

        <div className="mac-app__agents-head">
          <h2>Agents</h2>
        </div>

        <label className="mac-app__search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search agents or chats" />
        </label>

        <div className="mac-app__groups">
          <button type="button" className="mac-app__groups-btn">
            All groups
            <span aria-hidden="true">▾</span>
          </button>
          <button type="button" className="mac-app__icon-btn" aria-label="设置">
            <svg viewBox="0 0 18 18" width="14" height="14" aria-hidden="true">
              <circle cx="9" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M9 2.4v1.6M9 14v1.6M2.4 9h1.6M14 9h1.6M4.1 4.1l1.1 1.1M12.8 12.8l1.1 1.1M13.9 4.1l-1.1 1.1M5.2 12.8l-1.1 1.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mac-app__chats">
          <p className="mac-app__chat-label">Today</p>
          <ul>
            {today.map((item) => (
              <ChatRow
                key={item.id}
                item={item}
                selected={item.id === chatId}
                onSelect={() => selectChat(item)}
              />
            ))}
          </ul>
          <p className="mac-app__chat-label">Last 7 days</p>
          <ul>
            {week.map((item) => (
              <ChatRow
                key={item.id}
                item={item}
                selected={item.id === chatId}
                onSelect={() => selectChat(item)}
              />
            ))}
          </ul>
        </div>

        <footer className="mac-app__user">
          <span className="mac-app__user-avatar" aria-hidden="true">
            U
          </span>
          <span>用户</span>
          <span className="mac-app__user-more" aria-hidden="true">
            ⋯
          </span>
        </footer>
      </aside>

      <main className="mac-app__main">
        <header className="mac-app__main-head">
          <div className="mac-app__identity">
            <JellyAvatar color={chat.color} size={28} state={avatarState} />
            <strong>{chat.team}</strong>
            <span className="mac-app__pill mac-app__pill--engine">Codex</span>
            <span className={`mac-app__pill mac-app__pill--busy ${busy ? 'is-on' : ''}`}>
              {busy ? 'Busy' : 'Idle'}
            </span>
          </div>
          <div className="mac-app__usage">
            <span>Codex Usage</span>
            <div className="mac-app__usage-bar" aria-hidden="true">
              <i style={{ width: '68%' }} />
            </div>
            <time className="mac-app__timer">{formatElapsed(elapsed)}</time>
          </div>
          <div className="mac-app__main-actions">
            <button type="button" className="mac-app__icon-btn" aria-label="刷新">
              ↻
            </button>
            <button type="button" className="mac-app__icon-btn" aria-label="更多">
              ⋯
            </button>
          </div>
        </header>

        <div className="mac-app__feed" ref={feedRef}>
          {feed.map((item) => {
            if (item.kind === 'agent-intro') {
              return (
                <article key={item.id} className="mac-app__msg mac-app__msg--agent">
                  <div className="mac-app__msg-meta">
                    <JellyAvatar color={chat.color} size={22} state={avatarState} />
                    <span>已运行 4天3小时</span>
                  </div>
                  <p>
                    在 React 项目里，
                    <a href="#devices">Optimization.tsx</a>
                    {' '}
                    的轮询策略偏激进。建议提交：
                  </p>
                  <code className="mac-app__commit">
                    perf: reduce mobile polling and live activity energy usage
                  </code>
                </article>
              )
            }
            if (item.kind === 'user') {
              return (
                <div key={item.id} className="mac-app__msg mac-app__msg--user">
                  <span className="mac-app__me">我</span>
                  <div className="mac-app__bubble">
                    {item.withThumb ? <div className="mac-app__thumb" aria-hidden="true" /> : null}
                    <p>{item.text}</p>
                  </div>
                </div>
              )
            }
            if (item.kind === 'agent') {
              return (
                <article key={item.id} className="mac-app__msg mac-app__msg--agent">
                  <div className="mac-app__msg-meta">
                    <JellyAvatar color={chat.color} size={22} state={avatarState} />
                    <strong>{chat.team}</strong>
                    <button type="button" className="mac-app__copy">
                      复制
                    </button>
                    <time>{item.elapsed}</time>
                  </div>
                  <p>{item.text}</p>
                </article>
              )
            }
            if (item.kind === 'working') {
              return (
                <div key={item.id} className="mac-app__working">
                  <JellyAvatar color={chat.color} size={22} state={avatarState === 'idle' ? 'typing' : avatarState} />
                  <div>
                    <p>
                      compiling vibes
                      {' '}
                      <time>{formatElapsed(elapsed)}</time>
                    </p>
                    <p className="mac-app__starting">
                      <i />
                      Codex 正在开始…
                    </p>
                  </div>
                </div>
              )
            }
            if (item.kind === 'auth') {
              return (
                <div key={item.id} className="mac-app__auth-card" role="dialog" aria-label="命令授权">
                  <code className="mac-app__auth-cmd">{AUTH_COMMAND}</code>
                  <div className="mac-app__auth-tags">
                    <span className="mac-app__rule">static_rule</span>
                    <span className="mac-app__risk mac-app__risk--confirm">需确认</span>
                  </div>
                  <div className="mac-app__auth-actions">
                    <button type="button" className="mac-app__deny" onClick={onDeny}>
                      拒绝
                    </button>
                    <button type="button" className="mac-app__allow" onClick={onAllow}>
                      允许
                    </button>
                  </div>
                </div>
              )
            }
            return (
              <div key={item.id} className="mac-app__cmd-done">
                <div className="mac-app__cmd-label">
                  <span>已执行命令</span>
                  <span className="mac-app__rule">static_rule</span>
                </div>
                <div className="mac-app__cmd-bar">
                  <span aria-hidden="true">▶</span>
                  <code>{AUTH_COMMAND}</code>
                  <span className="mac-app__safe">无害 · 已执行</span>
                </div>
              </div>
            )
          })}
        </div>

        <form
          className="mac-app__composer"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <div className="mac-app__tools" aria-hidden="true">
            <button type="button">✦</button>
            <button type="button">☰</button>
            <button type="button">⇄</button>
          </div>
          <textarea
            className="mac-app__input"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Interrupt with a note, @ teammates…"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                send()
              }
            }}
          />
          <div className="mac-app__composer-bar">
            <button type="button" className="mac-app__plus" aria-label="附件">
              +
            </button>
            <div className="mac-app__ctx" aria-label="上下文占用 68%">
              <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#6ee7a8"
                  strokeWidth="3"
                  strokeDasharray={`${0.68 * 88} 88`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <span>68%</span>
            </div>
            <span className="mac-app__hint">Ctrl + Enter to send</span>
            <button type="button" className="mac-app__interrupt">
              Interrupt
            </button>
            <button type="button" className="mac-app__stop" aria-label="Stop">
              <i />
              Stop
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

function ChatRow({
  item,
  selected,
  onSelect,
}: {
  item: MacChatItem
  selected: boolean
  onSelect: () => void
}) {
  return (
    <li>
      <button
        type="button"
        className={`mac-app__chat ${selected ? 'is-selected' : ''}`}
        onClick={onSelect}
      >
        <JellyAvatar color={item.color} size={26} state="idle" />
        <span className="mac-app__chat-body">
          <span className="mac-app__chat-title">{item.title}</span>
          <span className="mac-app__chat-status">
            <i className={item.status === '进行中' ? 'is-busy' : 'is-done'} />
            {item.team}
            {' · '}
            {item.status}
          </span>
        </span>
      </button>
    </li>
  )
}

function baseFeed(): FeedItem[] {
  return baseFeedFor(MAC_CHATS[0])
}

function baseFeedFor(chat: MacChatItem): FeedItem[] {
  if (chat.status === '已完成') {
    return [
      { kind: 'agent-intro', id: 'intro' },
      {
        kind: 'agent',
        id: 'done',
        text: '这项任务已完成，相关改动已整理好。',
        elapsed: '0m42s',
      },
    ]
  }
  return [
    { kind: 'agent-intro', id: 'intro' },
    { kind: 'user', id: 'u1', text: 'hello' },
    {
      kind: 'agent',
      id: 'a1',
      text: '你好！我在。',
      elapsed: '1m56s',
    },
    {
      kind: 'user',
      id: 'u2',
      text: '数字员工设置界面里，名称显示太长了，帮我缩短一下。',
      withThumb: true,
    },
    { kind: 'working', id: 'w1' },
  ]
}

function formatElapsed(total: number) {
  if (total < 60) return `${total}s`
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}m${String(s).padStart(2, '0')}s`
}
