import JellyAvatar from '../jelly/JellyAvatar'

/**
 * 隐喻示意：一只水母 = 一个团队；钟面派发任务；触手 = 智能体。
 * 用多色小头像环绕大型「团队」水母，避免发明额外产品功能。
 */
export default function TeamDiagram() {
  const agents = [
    { color: 'orange', state: 'coding' as const, label: '智能体' },
    { color: 'yellow', state: 'typing' as const, label: '智能体' },
    { color: 'green', state: 'ponder' as const, label: '智能体' },
    { color: 'pink', state: 'idle' as const, label: '智能体' },
    { color: 'sky', state: 'typing' as const, label: '智能体' },
  ]

  return (
    <div className="team-diagram" aria-hidden="true">
      <div className="team-diagram__bell">
        <JellyAvatar color="teal" size={120} state="idle" />
        <span className="team-diagram__bell-label">任务 · 钟面</span>
      </div>
      <ul className="team-diagram__tentacles">
        {agents.map((agent) => (
          <li key={agent.color} className="team-diagram__agent">
            <JellyAvatar color={agent.color} size={56} state={agent.state} />
            <span>{agent.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
