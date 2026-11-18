import { useEffect, useMemo, useState } from 'react'
import JellyAvatar from '../../jelly/JellyAvatar'
import { prefersReducedMotion } from '../../jelly/jellySprite'
import './IPhoneChatScreen.css'

const ENGINES = ['Cursor', 'Codex', 'Claude'] as const

const COMMANDS = [
  '/workspace/project/collect_data/fetch_metrics.py',
  '/workspace/project/collect_data/normalize_rows.ts',
  '/workspace/project/collect_data/validate_schema.json',
  '/workspace/project/collect_data/write_snapshot.py',
  '/workspace/project/collect_data/publish_report.md',
]

const MESSAGE =
  'One decision changes the design a lot — answering this next lets me lock the plan.'

type Phase = 'commands' | 'message' | 'hold'

/**
 * iPhone 聊天场景：命令流逐条出现 → 消息卡片淡入并打字 → 循环。
 * 引擎标签在 Cursor / Codex / Claude 间轮换。
 */
export default function IPhoneChatScreen() {
  const [engineIndex, setEngineIndex] = useState(0)
  const [visibleCommands, setVisibleCommands] = useState(0)
  const [badgePop, setBadgePop] = useState(-1)
  const [showMessage, setShowMessage] = useState(false)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<Phase>('commands')
  const [reduced, setReduced] = useState(false)

  const engine = ENGINES[engineIndex]

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  // 引擎标签轮换
  useEffect(() => {
    if (reduced) return undefined
    const t = setInterval(() => {
      setEngineIndex((i) => (i + 1) % ENGINES.length)
    }, 2800)
    return () => clearInterval(t)
  }, [reduced])

  // 主时间轴：命令流 → 消息 → 停顿 → 重置循环
  useEffect(() => {
    if (reduced) {
      setVisibleCommands(COMMANDS.length)
      setShowMessage(true)
      setTyped(MESSAGE)
      return undefined
    }

    let cancelled = false
    const timers: number[] = []

    const reset = () => {
      setVisibleCommands(0)
      setBadgePop(-1)
      setShowMessage(false)
      setTyped('')
      setPhase('commands')
    }

    const run = () => {
      reset()
      COMMANDS.forEach((_, index) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return
            setVisibleCommands(index + 1)
            setBadgePop(index)
            timers.push(
              window.setTimeout(() => {
                if (!cancelled) setBadgePop(-1)
              }, 420),
            )
          }, 520 + index * 480),
        )
      })

      const afterCommands = 520 + COMMANDS.length * 480 + 350
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase('message')
          setShowMessage(true)
        }, afterCommands),
      )

      // 逐字打字
      MESSAGE.split('').forEach((_, i) => {
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return
            setTyped(MESSAGE.slice(0, i + 1))
          }, afterCommands + 280 + i * 28),
        )
      })

      const holdAt = afterCommands + 280 + MESSAGE.length * 28 + 2200
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase('hold')
        }, holdAt),
      )

      timers.push(
        window.setTimeout(() => {
          if (!cancelled) run()
        }, holdAt + 900),
      )
    }

    run()
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [reduced])

  const shownCommands = useMemo(
    () => COMMANDS.slice(0, visibleCommands),
    [visibleCommands],
  )

  return (
    <div className="iphone-chat">
      <header className="iphone-chat__top">
        <button type="button" className="iphone-chat__sidebar" aria-label="侧栏">
          <span />
          <span />
        </button>
        <div className="iphone-chat__title-block">
          <div className="iphone-chat__name">全栈-小B</div>
          <div className="iphone-chat__meta">
            <span className="iphone-chat__engine" key={engine}>
              {engine}
            </span>
            <span className="iphone-chat__group">Atolla 研发组</span>
          </div>
        </div>
      </header>

      <div className="iphone-chat__feed" aria-live="polite">
        <ul className="iphone-chat__commands">
          {shownCommands.map((cmd, index) => (
            <li
              key={`${cmd}-${index}`}
              className={`iphone-chat__cmd ${index === badgePop ? 'is-pop' : ''}`}
            >
              <div className="iphone-chat__cmd-label">
                <span>已执行命令</span>
                <span className="iphone-chat__rule">static_rule</span>
              </div>
              <div className="iphone-chat__cmd-bar">
                <span className="iphone-chat__play" aria-hidden="true">
                  ▶
                </span>
                <code className="iphone-chat__path">{cmd}</code>
                <span className="iphone-chat__safe">无害</span>
              </div>
            </li>
          ))}
        </ul>

        {showMessage && (
          <article className={`iphone-chat__bubble ${phase !== 'commands' ? 'is-in' : ''}`}>
            <div className="iphone-chat__bubble-head">
              <div className="iphone-chat__who">
                <JellyAvatar color="orange" size={22} state="typing" />
                <span>全栈-小B</span>
              </div>
              <button type="button" className="iphone-chat__copy">
                复制
              </button>
            </div>
            <p className="iphone-chat__body">
              {typed}
              {typed.length < MESSAGE.length && !reduced ? (
                <span className="iphone-chat__caret" aria-hidden="true" />
              ) : null}
            </p>
          </article>
        )}
      </div>

      <div className="iphone-chat__composer">
        <button type="button" className="iphone-chat__round" aria-label="更多">
          +
        </button>
        <div className="iphone-chat__input">输入消息…</div>
        <button type="button" className="iphone-chat__send" aria-label="发送">
          ↑
        </button>
      </div>
    </div>
  )
}
