import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
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
  const { t } = useI18n()
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
    <div className="auth-sync">
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
            islandExpanded={pending}
            islandTitle={t('agent.team.fullstack')}
            islandSubtitle={t('auth.islandSubtitle')}
          >
            <IPhoneAuthScreen phase={phase} onAllow={allow} onDeny={deny} />
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
