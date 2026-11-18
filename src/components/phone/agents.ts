import { translate } from '../../i18n/dictionaries'
import type { Locale } from '../../i18n/types'
import type { JellyColor } from '../../jelly/colors'

export type EngineId = 'Cursor' | 'Codex' | 'Claude'

export type Agent = {
  id: string
  nameKey: string
  color: JellyColor
  engine: EngineId
  groupId: string
  badge?: string
}

export type AgentGroup = {
  id: string
  nameKey: string
  agentIds: string[]
}

export const AGENT_GROUPS: AgentGroup[] = [
  { id: 'intel', nameKey: 'agent.group.intel', agentIds: ['front-xiaoshuai'] },
  { id: 'finance', nameKey: 'agent.group.finance', agentIds: ['fin-b', 'fin-c', 'fin-full'] },
  { id: 'tms', nameKey: 'agent.group.tms', agentIds: ['fullstack-c'] },
  { id: 'rd', nameKey: 'agent.group.rd', agentIds: ['fullstack-a', 'fullstack-b', 'fullstack-d'] },
]

export const AGENTS: Record<string, Agent> = {
  'front-xiaoshuai': {
    id: 'front-xiaoshuai',
    nameKey: 'agent.front-xiaoshuai',
    color: 'green',
    engine: 'Claude',
    groupId: 'intel',
    badge: '∞',
  },
  'fin-b': {
    id: 'fin-b',
    nameKey: 'agent.fin-b',
    color: 'orange',
    engine: 'Codex',
    groupId: 'finance',
  },
  'fin-c': {
    id: 'fin-c',
    nameKey: 'agent.fin-c',
    color: 'purple',
    engine: 'Cursor',
    groupId: 'finance',
  },
  'fin-full': {
    id: 'fin-full',
    nameKey: 'agent.fin-full',
    color: 'sky',
    engine: 'Claude',
    groupId: 'finance',
  },
  'fullstack-c': {
    id: 'fullstack-c',
    nameKey: 'agent.fullstack-c',
    color: 'red',
    engine: 'Codex',
    groupId: 'tms',
  },
  'fullstack-a': {
    id: 'fullstack-a',
    nameKey: 'agent.fullstack-a',
    color: 'blue',
    engine: 'Cursor',
    groupId: 'rd',
  },
  'fullstack-b': {
    id: 'fullstack-b',
    nameKey: 'agent.fullstack-b',
    color: 'orange',
    engine: 'Cursor',
    groupId: 'rd',
  },
  'fullstack-d': {
    id: 'fullstack-d',
    nameKey: 'agent.fullstack-d',
    color: 'teal',
    engine: 'Claude',
    groupId: 'rd',
  },
}

export const DEFAULT_AGENT_ID = 'fullstack-b'

export function groupNameOf(agentId: string, locale: Locale): string {
  const agent = AGENTS[agentId]
  const group = AGENT_GROUPS.find((g) => g.id === agent?.groupId)
  return group ? translate(locale, group.nameKey) : ''
}

export function agentName(agentId: string, locale: Locale): string {
  const agent = AGENTS[agentId]
  return agent ? translate(locale, agent.nameKey) : agentId
}

/** 前端模拟回复：按关键词轻量匹配 */
export function pickReply(input: string, locale: Locale): { text: string; withCommand?: string } {
  const text = input.trim().toLowerCase()
  if (/你好|嗨|hello|hi|早上好|晚上好/.test(text)) {
    return { text: translate(locale, 'reply.hello') }
  }
  if (/你是谁|介绍|自己|who are you|introduce/.test(text)) {
    return { text: translate(locale, 'reply.who') }
  }
  if (/cli|引擎|engine|codex|claude|cursor/.test(text)) {
    return {
      text: translate(locale, 'reply.cli'),
      withCommand: '/workspace/project/engines/list_runtimes.sh',
    }
  }
  if (/审批|批准|治理|授权|auth|approve|allow/.test(text)) {
    return { text: translate(locale, 'reply.auth') }
  }
  if (/团队|协作|水母|team|jellyfish/.test(text)) {
    return { text: translate(locale, 'reply.team') }
  }
  return {
    text: translate(locale, 'reply.default'),
    withCommand: '/workspace/project/collect_data/fetch_metrics.py',
  }
}
