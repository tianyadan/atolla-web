import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import JellyAvatar from '../../jelly/JellyAvatar'
import { AUTH_COMMAND, type AuthPhase } from '../mac/macChats'
import './IPhoneAuthScreen.css'

export type IPhoneAuthScreenProps = {
  phase: AuthPhase
  /** 是否展示底部授权 sheet（island 收起之后） */
  sheetVisible: boolean
  onAllow: () => void
  onDeny: () => void
}

/**
 * iPhone 授权演示屏：
 * Island 通知与底部 sheet 不同时出现；命令路径单行 ellipsis，点按展开。
 */
export default function IPhoneAuthScreen({
  phase,
  sheetVisible,
  onAllow,
  onDeny,
}: IPhoneAuthScreenProps) {
  const { t } = useI18n()
  const [pathExpanded, setPathExpanded] = useState(false)
  const pending = phase === 'pending'
  const jelly =
    phase === 'pending' ? 'alert' : phase === 'approved' ? 'coding' : phase === 'denied' ? 'error' : 'idle'

  useEffect(() => {
    if (!sheetVisible) setPathExpanded(false)
  }, [sheetVisible])

  const showSheet = sheetVisible && phase !== 'idle'

  return (
    <div className={`iphone-auth ${pending ? 'is-pending' : ''}`}>
      <div className="iphone-auth__wallpaper" aria-hidden="true" />

      <div className={`iphone-auth__sheet ${showSheet ? 'is-show' : ''}`}>
        <div className="iphone-auth__agent">
          <JellyAvatar color="red" size={36} state={jelly} />
          <div>
            <strong>{t('agent.team.fullstack')}</strong>
            <span>{t('auth.cardTitle')}</span>
          </div>
        </div>

        {phase === 'pending' || phase === 'idle' ? (
          <>
            <button
              type="button"
              className={`iphone-auth__cmd ${pathExpanded ? 'is-expanded' : ''}`}
              onClick={() => setPathExpanded((v) => !v)}
              title={AUTH_COMMAND}
            >
              <code>{AUTH_COMMAND}</code>
            </button>
            <div className="iphone-auth__tags">
              <span className="iphone-auth__rule">static_rule</span>
              <span className="iphone-auth__risk">{t('auth.risk')}</span>
            </div>
            <div className="iphone-auth__actions">
              <button type="button" className="iphone-auth__deny" onClick={onDeny} disabled={!pending}>
                {t('auth.deny')}
              </button>
              <button type="button" className="iphone-auth__allow" onClick={onAllow} disabled={!pending}>
                {t('auth.allow')}
              </button>
            </div>
          </>
        ) : null}

        {phase === 'approved' ? (
          <div className="iphone-auth__done">
            <span className="iphone-auth__safe">{t('auth.safeDone')}</span>
            <p>{t('auth.doneSync')}</p>
          </div>
        ) : null}

        {phase === 'denied' ? (
          <div className="iphone-auth__done is-denied">
            <span className="iphone-auth__blocked">{t('auth.blocked')}</span>
            <p>{t('auth.deniedHint')}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
