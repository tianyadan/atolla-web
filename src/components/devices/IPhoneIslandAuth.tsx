import { useI18n } from '../../i18n/I18nProvider'
import JellyAvatar from '../../jelly/JellyAvatar'
import { AUTH_COMMAND, type AuthPhase } from '../mac/macChats'
import './IPhoneIslandAuth.css'

type Props = {
  phase: AuthPhase
  onAllow: () => void
  onDeny: () => void
}

/** 灵动岛展开后的授权 Live Activity：直接在岛上允许 / 拒绝 */
export function IslandAuthCard({ phase, onAllow, onDeny }: Props) {
  const { t } = useI18n()
  const pending = phase === 'pending'
  return (
    <div className="island-auth">
      <div className="island-auth__head">
        <img src="/brand-jellyfish-white.png" alt="" width={20} height={20} className="island-auth__logo" />
        <span className="island-auth__app">Atolla</span>
        <span className="island-auth__risk">{t('auth.risk')}</span>
      </div>
      <div className="island-auth__agent">
        <JellyAvatar color="red" size={30} state="alert" />
        <div>
          <strong>{t('agent.team.fullstack')}</strong>
          <span>{t('auth.islandSubtitle')}</span>
        </div>
      </div>
      <code className="island-auth__cmd" title={AUTH_COMMAND}>
        {AUTH_COMMAND}
      </code>
      <div className="island-auth__actions">
        <button type="button" className="island-auth__deny" onClick={onDeny} disabled={!pending}>
          {t('auth.deny')}
        </button>
        <button type="button" className="island-auth__allow" onClick={onAllow} disabled={!pending}>
          {t('auth.allow')}
        </button>
      </div>
    </div>
  )
}

/** 结果回执：岛收成横幅显示结果后自动收起 */
export function IslandAuthResult({ phase }: { phase: AuthPhase }) {
  const { t } = useI18n()
  const ok = phase === 'approved'
  return (
    <div className={`island-result ${ok ? 'is-ok' : 'is-denied'}`}>
      <JellyAvatar color="red" size={24} state={ok ? 'coding' : 'error'} />
      <span className="island-result__title">{t('agent.team.fullstack')}</span>
      <span className="island-result__badge">{ok ? t('auth.safeDone') : t('auth.blocked')}</span>
    </div>
  )
}
