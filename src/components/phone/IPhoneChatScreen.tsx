import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import JellyAvatar from '../../jelly/JellyAvatar'
import { prefersReducedMotion } from '../../jelly/jellySprite'
import AgentDrawer from './AgentDrawer'
import {
  AGENTS,
  DEFAULT_AGENT_ID,
  agentName,
  groupNameOf,
  pickReply,
  type EngineId,
} from './agents'
import './IPhoneChatScreen.css'

const DEMO_COMMANDS = [
  '/workspace/project/collect_data/fetch_metrics.py',
  '/workspace/project/collect_data/normalize_rows.ts',
  '/workspace/project/collect_data/validate_schema.json',
  '/workspace/project/collect_data/write_snapshot.py',
  '/workspace/project/collect_data/publish_report.md',
]

type FeedItem =
  | { kind: 'command'; id: string; path: string; pop?: boolean }
  | { kind: 'user'; id: string; text: string }
  | {
      kind: 'agent'
      id: string
      text: string
      typed: string
      agentId: string
      typing: boolean
    }

type DemoPhase = 'commands' | 'drawer' | 'message' | 'hold' | 'stopped'

/**
 * iPhone 聊天场景：可交互输入、侧栏选人、自动演示（含短暂打开抽屉）。
 */
export default function IPhoneChatScreen() {
  const { t, locale } = useI18n()
  const [agentId, setAgentId] = useState(DEFAULT_AGENT_ID)
  const [engine, setEngine] = useState<EngineId>(AGENTS[DEFAULT_AGENT_ID].engine)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [demoActive, setDemoActive] = useState(true)
  const [demoPhase, setDemoPhase] = useState<DemoPhase>('commands')
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [reduced, setReduced] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<number[]>([])
  const demoGenRef = useRef(0)

  const agent = AGENTS[agentId]
  const demoReply = t('reply.demo')

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }

  const stopDemo = () => {
    demoGenRef.current += 1
    clearTimers()
    setDemoActive(false)
    setDemoPhase('stopped')
    setDrawerOpen(false)
    // 打断演示时补全未打完的气泡，避免残留半截英文
    setFeed((prev) =>
      prev.map((item) =>
        item.kind === 'agent' && item.typing
          ? { ...item, typed: item.text, typing: false }
          : item,
      ),
    )
    setBusy(false)
  }

  const scrollFeed = () => {
    requestAnimationFrame(() => {
      const el = feedRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  useEffect(() => {
    scrollFeed()
  }, [feed, drawerOpen])

  // 自动演示循环（用户交互后停止）
  useEffect(() => {
    if (!demoActive) return undefined
    if (reduced) {
      setFeed([
        ...DEMO_COMMANDS.map((path, i) => ({
          kind: 'command' as const,
          id: `c-${i}`,
          path,
        })),
        {
          kind: 'agent',
          id: 'demo-msg',
          text: demoReply,
          typed: demoReply,
          agentId: DEFAULT_AGENT_ID,
          typing: false,
        },
      ])
      return undefined
    }

    let cancelled = false
    const gen = ++demoGenRef.current
    const replyText = demoReply

    const alive = () => !cancelled && demoGenRef.current === gen

    const run = () => {
      if (!alive()) return
      clearTimers()
      setDrawerOpen(false)
      setAgentId(DEFAULT_AGENT_ID)
      setEngine(AGENTS[DEFAULT_AGENT_ID].engine)
      setFeed([])
      setDemoPhase('commands')

      DEMO_COMMANDS.forEach((path, index) => {
        schedule(() => {
          if (!alive()) return
          setFeed((prev) => [
            ...prev.map((item) =>
              item.kind === 'command' ? { ...item, pop: false } : item,
            ),
            { kind: 'command', id: `demo-c-${gen}-${index}`, path, pop: true },
          ])
          schedule(() => {
            if (!alive()) return
            setFeed((prev) =>
              prev.map((item) =>
                item.kind === 'command' && item.id === `demo-c-${gen}-${index}`
                  ? { ...item, pop: false }
                  : item,
              ),
            )
          }, 420)
        }, 480 + index * 460)
      })

      const afterCommands = 480 + DEMO_COMMANDS.length * 460 + 500

      schedule(() => {
        if (!alive()) return
        setDemoPhase('drawer')
        setDrawerOpen(true)
      }, afterCommands)

      schedule(() => {
        if (!alive()) return
        setAgentId('fullstack-a')
        setEngine(AGENTS['fullstack-a'].engine)
      }, afterCommands + 900)

      schedule(() => {
        if (!alive()) return
        setDrawerOpen(false)
        setDemoPhase('message')
        const msgId = `demo-a-${gen}`
        setFeed((prev) => [
          ...prev,
          {
            kind: 'agent',
            id: msgId,
            text: replyText,
            typed: '',
            agentId: 'fullstack-a',
            typing: true,
          },
        ])
        replyText.split('').forEach((_, i) => {
          schedule(() => {
            if (!alive()) return
            setFeed((prev) =>
              prev.map((item) =>
                item.kind === 'agent' && item.id === msgId
                  ? {
                      ...item,
                      typed: replyText.slice(0, i + 1),
                      typing: i + 1 < replyText.length,
                    }
                  : item,
              ),
            )
          }, 260 + i * 26)
        })
      }, afterCommands + 1400)

      const holdAt = afterCommands + 1400 + 260 + replyText.length * 26 + 1800
      schedule(() => {
        if (!alive()) return
        setDemoPhase('hold')
      }, holdAt)

      schedule(() => {
        if (!alive()) return
        setAgentId(DEFAULT_AGENT_ID)
        setEngine(AGENTS[DEFAULT_AGENT_ID].engine)
        run()
      }, holdAt + 800)
    }

    run()
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [demoActive, reduced, demoReply])

  /**
   * 回复节奏：先出回复卡（水母 typing 帧）→ 短暂原地打字态 → 再逐字打出正文。
   */
  const typeAgentReply = (replyText: string, forAgentId: string, withCommand?: string) => {
    setBusy(true)
    const cmdId = `cmd-${Date.now()}`
    const msgId = `agent-${Date.now()}`

    if (withCommand) {
      setFeed((prev) => [
        ...prev,
        { kind: 'command', id: cmdId, path: withCommand, pop: true },
      ])
      schedule(() => {
        setFeed((prev) =>
          prev.map((item) =>
            item.kind === 'command' && item.id === cmdId ? { ...item, pop: false } : item,
          ),
        )
      }, 420)
    }

    // 先出现回复卡并切到 typing 帧，稍后再开始打字
    const cardAt = withCommand ? 360 : 80
    const typeAt = cardAt + 520

    schedule(() => {
      setFeed((prev) => [
        ...prev,
        {
          kind: 'agent',
          id: msgId,
          text: replyText,
          typed: '',
          agentId: forAgentId,
          typing: true,
        },
      ])
    }, cardAt)

    schedule(() => {
      if (!replyText) {
        setFeed((prev) =>
          prev.map((item) =>
            item.kind === 'agent' && item.id === msgId
              ? { ...item, typing: false }
              : item,
          ),
        )
        setBusy(false)
        return
      }
      replyText.split('').forEach((_, i) => {
        schedule(() => {
          setFeed((prev) =>
            prev.map((item) =>
              item.kind === 'agent' && item.id === msgId
                ? {
                    ...item,
                    typed: replyText.slice(0, i + 1),
                    typing: i + 1 < replyText.length,
                  }
                : item,
            ),
          )
          if (i + 1 >= replyText.length) setBusy(false)
        }, i * 28)
      })
    }, typeAt)
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text || busy) return
    stopDemo()
    setDraft('')
    // 用户气泡立刻出现在右侧
    setFeed((prev) => [...prev, { kind: 'user', id: `user-${Date.now()}`, text }])
    const reply = pickReply(text, locale)
    // 稍后再切水母 typing → 打字回复
    schedule(() => {
      typeAgentReply(reply.text, agentId, reply.withCommand)
    }, 260)
  }

  const onSelectAgent = (id: string) => {
    stopDemo()
    setAgentId(id)
    setEngine(AGENTS[id].engine)
    setDrawerOpen(false)
  }

  const canSend = draft.trim().length > 0 && !busy

  return (
    <div className="iphone-chat">
      <header className="iphone-chat__top">
        <button
          type="button"
          className="iphone-chat__sidebar"
          aria-label={t('phone.openSidebar')}
          onClick={() => {
            stopDemo()
            setDrawerOpen(true)
          }}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <rect
              x="2.5"
              y="3.5"
              width="15"
              height="13"
              rx="2.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M7 3.5v13" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <div className="iphone-chat__title-block">
          <div className="iphone-chat__name">{agentName(agentId, locale)}</div>
          <div className="iphone-chat__meta">
            <span className="iphone-chat__engine" key={engine}>
              {engine}
            </span>
            <span className="iphone-chat__group">{groupNameOf(agentId, locale)}</span>
          </div>
        </div>
      </header>

      <div className="iphone-chat__feed" ref={feedRef} aria-live="polite">
        {feed.map((item) => {
          if (item.kind === 'command') {
            return (
              <div
                key={item.id}
                className={`iphone-chat__cmd ${item.pop ? 'is-pop' : ''}`}
              >
                <div className="iphone-chat__cmd-label">
                  <span>{t('phone.cmdLabel')}</span>
                  <span className="iphone-chat__rule">static_rule</span>
                </div>
                <div className="iphone-chat__cmd-bar">
                  <span className="iphone-chat__play" aria-hidden="true">
                    ▶
                  </span>
                  <code className="iphone-chat__path">{item.path}</code>
                  <span className="iphone-chat__safe">{t('phone.safe')}</span>
                </div>
              </div>
            )
          }
          if (item.kind === 'user') {
            return (
              <div key={item.id} className="iphone-chat__user-bubble">
                {item.text}
              </div>
            )
          }
          const who = AGENTS[item.agentId] ?? agent
          return (
            <article
              key={item.id}
              className={`iphone-chat__bubble ${item.typed || item.typing ? 'is-in' : ''}`}
            >
              <div className="iphone-chat__bubble-head">
                <div className="iphone-chat__who">
                  <JellyAvatar
                    color={who.color}
                    size={22}
                    state={item.typing ? 'typing' : 'idle'}
                  />
                  <span className="iphone-chat__who-name">{agentName(item.agentId, locale)}</span>
                </div>
                <button type="button" className="iphone-chat__copy">
                  {t('phone.copy')}
                </button>
              </div>
              <p className="iphone-chat__body">
                {item.typed}
                {item.typing ? <span className="iphone-chat__caret" aria-hidden="true" /> : null}
              </p>
            </article>
          )
        })}
        {demoPhase === 'commands' && feed.length === 0 ? (
          <p className="iphone-chat__hint">{t('phone.hint')}</p>
        ) : null}
      </div>

      <form
        className="iphone-chat__composer"
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage()
        }}
      >
        <button type="button" className="iphone-chat__round" aria-label={t('phone.more')}>
          +
        </button>
        <input
          className="iphone-chat__input"
          value={draft}
          onChange={(event) => {
            if (demoActive) stopDemo()
            setDraft(event.target.value)
          }}
          onFocus={() => {
            if (demoActive) stopDemo()
          }}
          placeholder={t('phone.placeholder')}
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="off"
        />
        <button
          type="submit"
          className={`iphone-chat__send ${canSend ? 'is-active' : ''}`}
          aria-label={t('phone.send')}
          disabled={!canSend}
        >
          ↑
        </button>
      </form>

      <AgentDrawer
        open={drawerOpen}
        selectedId={agentId}
        onClose={() => {
          stopDemo()
          setDrawerOpen(false)
        }}
        onSelect={onSelectAgent}
      />
    </div>
  )
}
