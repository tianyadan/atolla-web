import { useI18n } from '../../i18n/I18nProvider'
import JellyAvatar from '../../jelly/JellyAvatar'
import { AUTH_COMMAND, type AuthPhase } from '../mac/macChats'
import './IPhoneAuthScreen.css'

export type IPhoneAuthScreenProps = {
  phase: AuthPhase
  onAllow: () => void
  onDeny: () => void
}

/** iPhone 授权演示屏：锁屏式通知横幅 + 命令授权卡片。 */
export default function IPhoneAuthScreen({ phase, onAllow, onDeny }: IPhoneAuthScreenProps) {
  const { t } = useI18n()
  const pending = phase === 'pending'
  const jelly =
    phase === 'pending' ? 'alert' : phase === 'approved' ? 'coding' : phase === 'denied' ? 'error' : 'idle'

  return (
    <div className={`iphone-auth ${pending ? 'is-pending' : ''}`}>
      <div className="iphone-auth__wallpaper" aria-hidden="true" />

      {pending ? (
        <div className="iphone-auth__banner" role="status">
          <div className="iphone-auth__banner-top">
            <img src="/brand-jellyfish-white.png" alt="" width={14} height={14} />
            <span>ATOLLA</span>
            <time>{t('auth.notify.now')}</time>
          </div>
          <p className="iphone-auth__banner-title">{t('auth.bannerTitle')}</p>
          <p className="iphone-auth__banner-body">{t('auth.bannerBody')}</p>
        </div>
      ) : null}

      <div className={`iphone-auth__sheet ${phase !== 'idle' ? 'is-show' : ''}`}>
        <div className="iphone-auth__agent">
          <JellyAvatar color="red" size={36} state={jelly} />
          <div>
            <strong>{t('agent.team.fullstack')}</strong>
            <span>{t('auth.cardTitle')}</span>
          </div>
        </div>

        {phase === 'pending' || phase === 'idle' ? (
          <>
            <code className="iphone-auth__cmd">{AUTH_COMMAND}</code>
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
