import { useI18n } from '../i18n/I18nProvider'
import JellyAvatar from '../jelly/JellyAvatar'

/** 隐喻示意：一只水母 = 一个团队 */
export default function TeamDiagram() {
  const { t } = useI18n()
  const agents = [
    { color: 'orange', state: 'coding' as const },
    { color: 'yellow', state: 'typing' as const },
    { color: 'green', state: 'ponder' as const },
    { color: 'pink', state: 'idle' as const },
    { color: 'sky', state: 'typing' as const },
  ]

  return (
    <div className="team-diagram" aria-hidden="true">
      <div className="team-diagram__bell">
        <JellyAvatar color="teal" size={120} state="idle" />
        <span className="team-diagram__bell-label">{t('collab.bell')}</span>
      </div>
      <ul className="team-diagram__tentacles">
        {agents.map((agent) => (
          <li key={agent.color} className="team-diagram__agent">
            <JellyAvatar color={agent.color} size={56} state={agent.state} />
            <span>{t('collab.agent')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
