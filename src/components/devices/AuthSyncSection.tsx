import { useCallback, useEffect, useRef, useState } from 'react'
import MacBookFrame from '../mac/MacBookFrame'
import MacAppScreen from '../mac/MacAppScreen'
import IPhoneFrame from '../phone/IPhoneFrame'
import { jellyForAuth, type AuthPhase } from '../mac/macChats'
import ContinuityStage from './ContinuityStage'
import IPhoneAuthScreen from './IPhoneAuthScreen'
import './AuthSyncSection.css'

/**
 * 命令授权 Continuity 演示：Mac 会话卡 + macOS 横幅 + iPhone 通知同步。
 */
export default function AuthSyncSection() {
  const [phase, setPhase] = useState<AuthPhase>('idle')
  const [loopKey, setLoopKey] = useState(0)
  const autoRef = useRef(true)
  const timers = useRef<number[]>([])
  const cycle = useRef(0)

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  const allow = useCallback(() => {
    autoRef.current = false
    clearTimers()
    setPhase('approved')
  }, [])

  const deny = useCallback(() => {
    autoRef.current = false
    clearTimers()
    setPhase('denied')
  }, [])

  const replay = () => {
    clearTimers()
    autoRef.current = true
    setPhase('idle')
    setLoopKey((n) => n + 1)
  }

  useEffect(() => {
    if (!autoRef.current) return undefined
    let cancelled = false
    const gen = ++cycle.current

    const run = () => {
      if (cancelled || cycle.current !== gen || !autoRef.current) return
      clearTimers()
      setPhase('idle')
      schedule(() => {
        if (cancelled || cycle.current !== gen || !autoRef.current) return
        setPhase('pending')
      }, 1400)
      schedule(() => {
        if (cancelled || cycle.current !== gen || !autoRef.current) return
        setPhase('approved')
      }, 5200)
      schedule(() => {
        if (cancelled || cycle.current !== gen || !autoRef.current) return
        run()
      }, 8200)
    }

    run()
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [loopKey])

  const jelly = jellyForAuth(phase)
  const pending = phase === 'pending'

  const macBanner = (
    <div className={`mac-notify ${pending ? 'is-show' : ''}`} role="status" aria-live="polite">
      <div className="mac-notify__card">
        <img src="/brand-jellyfish-white.png" alt="" width={28} height={28} className="mac-notify__logo" />
        <div className="mac-notify__body">
          <div className="mac-notify__top">
            <strong>Atolla</strong>
            <time>现在</time>
          </div>
          <p className="mac-notify__title">全栈 请求执行命令</p>
          <p className="mac-notify__text">有一条命令等待你授权后才会继续。</p>
          <div className="mac-notify__actions">
            <button type="button" onClick={deny}>
              拒绝
            </button>
            <button type="button" className="is-allow" onClick={allow}>
              允许
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="auth-sync">
      <ContinuityStage
        mac={
          <MacBookFrame
            label="Atolla Mac 命令授权演示"
            overlay={macBanner}
            className="auth-sync__mac"
          >
            <MacAppScreen
              authPhase={phase}
              onAllow={allow}
              onDeny={deny}
              jellyState={jelly}
            />
          </MacBookFrame>
        }
        phone={
          <IPhoneFrame
            label="Atolla iPhone 命令授权通知"
            className="auth-sync__phone"
            islandExpanded={pending}
            islandTitle="全栈"
            islandSubtitle="请求执行命令"
          >
            <IPhoneAuthScreen phase={phase} onAllow={allow} onDeny={deny} />
          </IPhoneFrame>
        }
      />

      <div className="auth-sync__controls">
        <button type="button" className="auth-sync__replay" onClick={replay}>
          重新演示
        </button>
        <p>
          {phase === 'pending'
            ? '两端同时等待授权 — 点「允许」或「拒绝」会立刻同步。'
            : phase === 'approved'
              ? '已允许：通知关闭，命令标记为「无害 · 已执行」。'
              : phase === 'denied'
                ? '已拒绝：通知关闭，水母进入错误态。'
                : '智能体即将请求执行命令…'}
        </p>
      </div>
    </div>
  )
}
