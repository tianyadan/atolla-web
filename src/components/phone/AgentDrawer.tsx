import { useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import JellyAvatar from '../../jelly/JellyAvatar'
import { AGENT_GROUPS, AGENTS, agentName } from './agents'
import './AgentDrawer.css'

type AgentDrawerProps = {
  open: boolean
  selectedId: string
  onClose: () => void
  onSelect: (agentId: string) => void
}

/**
 * 智能体选择抽屉：约占屏宽 75%，左侧滑入，点遮罩关闭。
 */
export default function AgentDrawer({ open, selectedId, onClose, onSelect }: AgentDrawerProps) {
  const { t, locale } = useI18n()
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(AGENT_GROUPS.map((g) => [g.id, true])),
  )

  const toggleGroup = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className={`agent-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button
        type="button"
        className="agent-drawer__overlay"
        aria-label={t('phone.closeSidebar')}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside className="agent-drawer__panel" role="dialog" aria-label={t('phone.selectAgent')}>
        <header className="agent-drawer__brand">
          <img src="/brand-jellyfish-white.png" alt="" width={22} height={22} className="agent-drawer__logo" />
          <span>Atolla</span>
        </header>

        <div className="agent-drawer__cards">
          <button type="button" className="agent-drawer__card">
            <span className="agent-drawer__card-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="14" height="14">
                <rect x="2" y="4" width="16" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 13.5h16" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <span className="agent-drawer__card-body">
              <strong>company-mac</strong>
              <span className="agent-drawer__server">
                <i />
                {t('phone.server')}
              </span>
            </span>
            <span className="agent-drawer__chev" aria-hidden="true">
              ▾
            </span>
          </button>

          <button type="button" className="agent-drawer__card">
            <span className="agent-drawer__card-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="14" height="14">
                <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M4 16.5c1.4-2.4 3.4-3.5 6-3.5s4.6 1.1 6 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="agent-drawer__card-body">
              <strong>{t('phone.manage')}</strong>
            </span>
            <span className="agent-drawer__chev" aria-hidden="true">
              ›
            </span>
          </button>
        </div>

        <div className="agent-drawer__groups">
          {AGENT_GROUPS.map((group) => {
            const openGroup = expanded[group.id] !== false
            return (
              <section key={group.id} className="agent-drawer__group">
                <button
                  type="button"
                  className="agent-drawer__group-head"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={openGroup}
                >
                  <span className={`agent-drawer__chev ${openGroup ? 'is-open' : ''}`} aria-hidden="true">
                    ▾
                  </span>
                  <span className="agent-drawer__group-name">{t(group.nameKey)}</span>
                  <span className="agent-drawer__count">{group.agentIds.length}</span>
                </button>

                {openGroup && (
                  <ul className="agent-drawer__agents">
                    {group.agentIds.map((id) => {
                      const agent = AGENTS[id]
                      const selected = id === selectedId
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            className={`agent-drawer__agent ${selected ? 'is-selected' : ''}`}
                            onClick={() => onSelect(id)}
                          >
                            <JellyAvatar color={agent.color} size={28} state="idle" />
                            <span className="agent-drawer__agent-meta">
                              <span className="agent-drawer__agent-name">{agentName(id, locale)}</span>
                              <span className="agent-drawer__agent-status">
                                <i />
                                {t('phone.idle')}
                              </span>
                            </span>
                            {agent.badge ? (
                              <span className="agent-drawer__badge">{agent.badge}</span>
                            ) : null}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </div>

        <footer className="agent-drawer__footer">
          <div className="agent-drawer__user">
            <span className="agent-drawer__user-avatar" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="14" height="14">
                <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M4 16.5c1.4-2.4 3.4-3.5 6-3.5s4.6 1.1 6 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="agent-drawer__user-meta">
              <strong>{t('phone.user')}</strong>
              <span>1***@163.com</span>
            </span>
            <span className="agent-drawer__gear" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="15" height="15">
                <circle cx="10" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M10 2.6v1.8M10 15.6v1.8M2.6 10h1.8M15.6 10h1.8M4.4 4.4l1.3 1.3M14.3 14.3l1.3 1.3M15.6 4.4l-1.3 1.3M5.7 14.3l-1.3 1.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </footer>
      </aside>
    </div>
  )
}
