import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import MacBookFrame from '../mac/MacBookFrame'
import MacAppScreen from '../mac/MacAppScreen'
import IPhoneFrame from '../phone/IPhoneFrame'
import { jellyForAuth, type AuthPhase } from '../mac/macChats'
import ContinuityStage from './ContinuityStage'
import IPhoneAuthScreen from './IPhoneAuthScreen'
import { IslandAuthCard, IslandAuthResult } from './IPhoneIslandAuth'
import './AuthSyncSection.css'

/**
 * 命令授权 Continuity 演示。
 * iPhone：灵动岛展开为可交互的授权 Live Activity，直接在岛上允许 / 拒绝；
 * 结果以横幅回执显示后收起。
 */
export default function AuthSyncSection() {
  const { t } = useI18n()
  const [phase, setPhase] = useState<AuthPhase>('idle')
  const [island, setIsland] = useState<'none' | 'auth' | 'result'>('none')
  const [loopKey, setLoopKey] = useState(0)
  const autoRef = useRef(true)
  const timers = useRef<number[]>([])
  const cycle = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  /** pending：灵动岛展开为授权 Live Activity */
  const enterPendingUi = useCallback(() => {
    setPhase('pending')
    setIsland('auth')
  }, [])

  /** 结果回执：岛收成横幅 2.4s 后收起 */
  const resolve = useCallback((next: 'approved' | 'denied') => {
    setPhase(next)
    setIsland('result')
    schedule(() => setIsland('none'), 2400)
  }, [])

  const allow = useCallback(() => {
    autoRef.current = false
    clearTimers()
    resolve('approved')
  }, [resolve])

  const deny = useCallback(() => {
    autoRef.current = false
    clearTimers()
    resolve('denied')
  }, [resolve])

  const replay = () => {
    clearTimers()
    autoRef.current = true
    setPhase('idle')
    setIsland('none')
    setLoopKey((n) => n + 1)
  }

  useEffect(() => {
    if (!autoRef.current || !inView) return undefined
    let cancelled = false
    const gen = ++cycle.current

    const run = () => {
      if (cancelled || cycle.current !== gen || !autoRef.current) return
      clearTimers()
      setPhase('idle')
      setIsland('none')

      schedule(() => {
        if (cancelled || cycle.current !== gen || !autoRef.current) return
        enterPendingUi()
      }, 1400)

      // 岛上停留 4s 等待点击，无操作则自动允许
      schedule(() => {
        if (cancelled || cycle.current !== gen || !autoRef.current) return
        resolve('approved')
      }, 1400 + 4000)

      schedule(() => {
        if (cancelled || cycle.current !== gen || !autoRef.current) return
        run()
      }, 1400 + 4000 + 2400 + 1600)
    }

    run()
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [loopKey, enterPendingUi, resolve, inView])

  const jelly = jellyForAuth(phase)
  const macNotifyShow = phase === 'pending'

  const macBanner = (
    <div className={`mac-notify ${macNotifyShow ? 'is-show' : ''}`} role="status" aria-live="polite">
      <div className="mac-notify__card">
        <img src="/brand-jellyfish-white.png" alt="" width={28} height={28} className="mac-notify__logo" />
        <div className="mac-notify__body">
          <div className="mac-notify__top">
            <strong>Atolla</strong>
            <time>{t('auth.notify.now')}</time>
          </div>
          <p className="mac-notify__title">{t('auth.notify.title')}</p>
          <p className="mac-notify__text">{t('auth.notify.body')}</p>
          <div className="mac-notify__actions">
            <button type="button" onClick={deny}>
              {t('auth.deny')}
            </button>
            <button type="button" className="is-allow" onClick={allow}>
              {t('auth.allow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="auth-sync" ref={rootRef}>
      <ContinuityStage
        mac={
          <MacBookFrame
            label={t('auth.macLabel')}
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
            label={t('auth.iphoneLabel')}
            className="auth-sync__phone"
            tone="dark"
            islandExpanded={island !== 'none'}
            islandSize={island === 'auth' ? 'large' : 'banner'}
            islandContent={
              island === 'auth' ? (
                <IslandAuthCard phase={phase} onAllow={allow} onDeny={deny} />
              ) : island === 'result' ? (
                <IslandAuthResult phase={phase} />
              ) : null
            }
          >
            <IPhoneAuthScreen />
          </IPhoneFrame>
        }
      />

      <div className="auth-sync__controls">
        <button type="button" className="auth-sync__replay" onClick={replay}>
          {t('auth.replay')}
        </button>
        <p>
          {phase === 'pending'
            ? t('auth.status.pending')
            : phase === 'approved'
              ? t('auth.status.approved')
              : phase === 'denied'
                ? t('auth.status.denied')
                : t('auth.status.idle')}
        </p>
      </div>
    </div>
  )
}
