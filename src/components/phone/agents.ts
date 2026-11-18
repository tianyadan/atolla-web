import type { JellyColor } from '../../jelly/colors'

export type EngineId = 'Cursor' | 'Codex' | 'Claude'

export type Agent = {
  id: string
  name: string
  color: JellyColor
  engine: EngineId
  groupId: string
  badge?: string
}

export type AgentGroup = {
  id: string
  name: string
  agentIds: string[]
}

export const AGENT_GROUPS: AgentGroup[] = [
  { id: 'intel', name: '情报收集团队', agentIds: ['front-xiaoshuai'] },
  { id: 'finance', name: '财务预算团队', agentIds: ['fin-b', 'fin-c', 'fin-full'] },
  { id: 'tms', name: 'TMS 物流系统', agentIds: ['fullstack-c'] },
  { id: 'rd', name: 'Atolla 研发组', agentIds: ['fullstack-a', 'fullstack-b', 'fullstack-d'] },
]

export const AGENTS: Record<string, Agent> = {
  'front-xiaoshuai': {
    id: 'front-xiaoshuai',
    name: '前台小帅',
    color: 'green',
    engine: 'Claude',
    groupId: 'intel',
    badge: '∞',
  },
  'fin-b': {
    id: 'fin-b',
    name: '财务预算-B',
    color: 'orange',
    engine: 'Codex',
    groupId: 'finance',
  },
  'fin-c': {
    id: 'fin-c',
    name: '财务预算-C',
    color: 'purple',
    engine: 'Cursor',
    groupId: 'finance',
  },
  'fin-full': {
    id: 'fin-full',
    name: '财务预算-全栈',
    color: 'sky',
    engine: 'Claude',
    groupId: 'finance',
  },
  'fullstack-c': {
    id: 'fullstack-c',
    name: '全栈-小 C',
    color: 'red',
    engine: 'Codex',
    groupId: 'tms',
  },
  'fullstack-a': {
    id: 'fullstack-a',
    name: '全栈-小 A',
    color: 'blue',
    engine: 'Cursor',
    groupId: 'rd',
  },
  'fullstack-b': {
    id: 'fullstack-b',
    name: '全栈-小B',
    color: 'orange',
    engine: 'Cursor',
    groupId: 'rd',
  },
  'fullstack-d': {
    id: 'fullstack-d',
    name: '全栈-小D',
    color: 'teal',
    engine: 'Claude',
    groupId: 'rd',
  },
}

export const DEFAULT_AGENT_ID = 'fullstack-b'

export function groupNameOf(agentId: string): string {
  const agent = AGENTS[agentId]
  return AGENT_GROUPS.find((g) => g.id === agent?.groupId)?.name ?? ''
}

/** 前端模拟回复：按关键词轻量匹配 */
export function pickReply(input: string): { text: string; withCommand?: string } {
  const text = input.trim().toLowerCase()
  if (/你好|嗨|hello|hi|早上好|晚上好/.test(text)) {
    return { text: '你好，我在。把需求发我，我先拆成可执行的步骤。' }
  }
  if (/你是谁|介绍|自己/.test(text)) {
    return {
      text: '我是 Atolla 里的数字人智能体，可以和团队里的其他智能体一起协作完成任务。',
    }
  }
  if (/cli|引擎|codex|claude|cursor/.test(text)) {
    return {
      text: '我可以运行在 Codex、Claude、Cursor 三种 CLI 引擎上，按任务切换即可。',
      withCommand: '/workspace/project/engines/list_runtimes.sh',
    }
  }
  if (/审批|批准|治理|蓝光|拍板/.test(text)) {
    return {
      text: '需要你拍板的操作会标出等待确认；钟面边缘的蓝光亮起时，请在网页或手机上审批。',
    }
  }
  if (/团队|协作|水母/.test(text)) {
    return {
      text: '一只水母就是一支团队：钟面派发任务，触手是各个智能体，一起往前推进。',
    }
  }
  return {
    text: '收到。我先按现有上下文推进，有结果会同步到聊天里。',
    withCommand: '/workspace/project/collect_data/fetch_metrics.py',
  }
}
