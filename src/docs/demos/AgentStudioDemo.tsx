import { useEffect, useState } from 'react'
import JellyAvatar from '../../jelly/JellyAvatar'
import { JELLY_COLORS, type JellyColor } from '../../jelly/colors'
import type { JellyState } from '../../jelly/jellySprite'
import { DemoFrame, EngineMark } from './shared'
import { ENGINE_META, useZh, type EngineId } from './hooks'

/** 人才市场预制岗位（与产品 talent_market 模板一致） */
const ROLES = [
  { id: 'product_manager', name: '林晓晴', en: 'Lin Xiaoqing', zh: '产品经理', enTitle: 'Product Manager', color: 'purple', engine: 'claude' },
  { id: 'frontend_engineer', name: '沈清禾', en: 'Shen Qinghe', zh: '前端工程师', enTitle: 'Frontend Engineer', color: 'sky', engine: 'cursor' },
  { id: 'java_backend', name: '陈思语', en: 'Chen Siyu', zh: 'Java 后端程序员', enTitle: 'Java Backend', color: 'orange', engine: 'codex' },
  { id: 'go_backend', name: '陆景行', en: 'Lu Jingxing', zh: 'Go 后端程序员', enTitle: 'Go Backend', color: 'cyan', engine: 'codex' },
  { id: 'fullstack', name: '苏晚舟', en: 'Su Wanzhou', zh: '全栈开发工程师', enTitle: 'Full-stack Engineer', color: 'green', engine: 'claude' },
  { id: 'ops_engineer', name: '韩予澈', en: 'Han Yuche', zh: '运维工程师', enTitle: 'Ops Engineer', color: 'coral', engine: 'codex' },
] as const

const SWATCH: Record<JellyColor, string> = {
  orange: '#f59e0b', yellow: '#eab308', blue: '#3b82f6', green: '#22c55e', purple: '#a855f7', red: '#ef4444',
  cyan: '#06b6d4', teal: '#14b8a6', pink: '#ec4899', lime: '#84cc16', coral: '#fb7185', sky: '#38bdf8',
}

type Perm = 'write' | 'network' | 'delete' | 'restrict'
type Skill = 'browser' | 'database' | 'server'

const PERMS: Array<{ id: Perm; zh: string; en: string }> = [
  { id: 'write', zh: '写入文件', en: 'Write files' },
  { id: 'network', zh: '联网', en: 'Network' },
  { id: 'delete', zh: '删除', en: 'Delete' },
  { id: 'restrict', zh: '限制在工作区内', en: 'Stay in workspace' },
]

const SKILLS: Array<{ id: Skill; zh: string; en: string }> = [
  { id: 'browser', zh: '浏览器操作', en: 'Browser' },
  { id: 'database', zh: '数据库查询', en: 'Database' },
  { id: 'server', zh: '服务器 SSH', en: 'Server SSH' },
]

export default function AgentStudioDemo() {
  const zh = useZh()
  const [roleIdx, setRoleIdx] = useState(1)
  const role = ROLES[roleIdx]
  const [color, setColor] = useState<JellyColor>(role.color)
  const [engine, setEngine] = useState<EngineId>(role.engine)
  const [perms, setPerms] = useState<Record<Perm, boolean>>({ write: true, network: false, delete: false, restrict: true })
  const [skills, setSkills] = useState<Record<Skill, boolean>>({ browser: true, database: false, server: false })
  const [mood, setMood] = useState<JellyState>('idle')
  const [pulse, setPulse] = useState(0)

  // 每次修改让水母庆祝一下，再回到待命
  useEffect(() => {
    if (!pulse) return undefined
    const id = window.setTimeout(() => setMood('idle'), 1300)
    return () => window.clearTimeout(id)
  }, [pulse])
  const bump = () => {
    setMood('celebrate')
    setPulse((p) => p + 1)
  }

  const pickRole = (i: number) => {
    setRoleIdx(i)
    setColor(ROLES[i].color)
    setEngine(ROLES[i].engine)
    bump()
  }

  const matrix: Array<{ zh: string; en: string; on: boolean; note?: { zh: string; en: string } }> = [
    { zh: '读取工作区', en: 'Read workspace', on: true },
    { zh: '写入文件', en: 'Write files', on: perms.write },
    { zh: '联网请求', en: 'Network', on: perms.network, note: { zh: '受域名白名单约束', en: 'domain allowlist applies' } },
    { zh: '删除文件', en: 'Delete files', on: perms.delete },
    { zh: '访问工作区外路径', en: 'Paths outside workspace', on: !perms.restrict },
    { zh: '浏览器操作', en: 'Browser actions', on: skills.browser },
    { zh: '数据库查询', en: 'Database queries', on: skills.database },
    { zh: '服务器运维', en: 'Server operations', on: skills.server },
  ]
  const skillCount = Object.values(skills).filter(Boolean).length

  return (
    <DemoFrame
      title={zh ? '数字员工工作室' : 'Agent studio'}
      caption={
        zh
          ? '岗位来自人才市场的 6 个预制模板。权限开关决定员工能做什么，技能决定员工会做什么；Hard Deny 与人工审批始终在其之上生效。'
          : 'Roles come from the six Talent Market templates. Permissions decide what an agent may do, skills what it knows how to do; Hard Deny and approvals always sit on top.'
      }
    >
      <div className="as">
        <div className="as-controls">
          <div className="as-field">
            <span className="as-label">{zh ? '岗位模板' : 'Role template'}</span>
            <div className="as-roles">
              {ROLES.map((r, i) => (
                <button type="button" key={r.id} className={`as-chip ${i === roleIdx ? 'is-on' : ''}`} onClick={() => pickRole(i)}>
                  {zh ? r.zh : r.enTitle}
                </button>
              ))}
            </div>
          </div>
          <div className="as-field">
            <span className="as-label">{zh ? '工作引擎' : 'Engine'}</span>
            <div className="as-engines">
              {(Object.keys(ENGINE_META) as EngineId[]).map((id) => (
                <button type="button" key={id} className={`as-engine ${engine === id ? 'is-on' : ''}`} onClick={() => { setEngine(id); bump() }}>
                  <EngineMark id={id} size={20} />
                  {ENGINE_META[id].name}
                </button>
              ))}
            </div>
          </div>
          <div className="as-field">
            <span className="as-label">{zh ? '像素水母颜色' : 'Jellyfish color'}</span>
            <div className="as-swatches">
              {JELLY_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`as-swatch ${color === c ? 'is-on' : ''}`}
                  style={{ ['--sw' as string]: SWATCH[c] }}
                  onClick={() => { setColor(c); bump() }}
                  aria-label={c}
                  aria-pressed={color === c}
                />
              ))}
            </div>
          </div>
          <div className="as-field">
            <span className="as-label">{zh ? '权限策略' : 'Permission policy'}</span>
            <div className="as-toggles">
              {PERMS.map((p) => (
                <label key={p.id} className="as-toggle">
                  <input type="checkbox" checked={perms[p.id]} onChange={() => { setPerms((s) => ({ ...s, [p.id]: !s[p.id] })); bump() }} />
                  <span className="as-switch" aria-hidden="true" />
                  {zh ? p.zh : p.en}
                </label>
              ))}
            </div>
          </div>
          <div className="as-field">
            <span className="as-label">{zh ? '技能商店' : 'Skill store'}</span>
            <div className="as-roles">
              {SKILLS.map((s) => (
                <button type="button" key={s.id} className={`as-chip as-chip--skill ${skills[s.id] ? 'is-on' : ''}`} onClick={() => { setSkills((v) => ({ ...v, [s.id]: !v[s.id] })); bump() }}>
                  {skills[s.id] ? '✓ ' : '+ '}
                  {zh ? s.zh : s.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="as-preview">
          <div className="as-card" style={{ ['--sw' as string]: SWATCH[color] }}>
            <div className="as-card__glow" aria-hidden="true" />
            <div className="as-card__top">
              <JellyAvatar color={color} size={64} state={mood} />
              <div>
                <p className="as-card__name">{zh ? role.name : role.en}</p>
                <p className="as-card__title">{zh ? role.zh : role.enTitle}</p>
                <span className="as-card__engine">
                  <EngineMark id={engine} size={16} />
                  {ENGINE_META[engine].name} · <code>{ENGINE_META[engine].bin}</code>
                </span>
              </div>
            </div>
            <div className="as-card__meta">
              <span>{zh ? '工作区' : 'Workspace'}</span>
              <code>~/work/atolla-app</code>
            </div>
            <div className="as-card__meta">
              <span>{zh ? '已装技能' : 'Skills'}</span>
              <b>{skillCount}</b>
            </div>
            <ul className="as-matrix">
              {matrix.map((m) => (
                <li key={m.zh} className={m.on ? 'is-on' : ''}>
                  <span className="as-matrix__dot" aria-hidden="true">{m.on ? '✓' : '–'}</span>
                  <span>{zh ? m.zh : m.en}</span>
                  {m.note && m.on && <small>{zh ? m.note.zh : m.note.en}</small>}
                </li>
              ))}
            </ul>
            <p className="as-card__floor">{zh ? 'Hard Deny · 人工审批 · 命令审计 始终生效' : 'Hard Deny · approvals · audit always on'}</p>
          </div>
        </div>
      </div>
    </DemoFrame>
  )
}
