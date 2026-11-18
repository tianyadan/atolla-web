import type { JellyColor } from '../../jelly/colors'
import type { JellyState } from '../../jelly/jellySprite'

export type MacChatStatus = '进行中' | '已完成'

export type MacChatItem = {
  id: string
  title: string
  team: string
  status: MacChatStatus
  color: JellyColor
  group: 'today' | 'week'
}

export const MAC_CHATS: MacChatItem[] = [
  {
    id: 'opt-settings',
    title: '优化数字员工设置页面',
    team: '全栈',
    status: '进行中',
    color: 'red',
    group: 'today',
  },
  {
    id: 'fix-bug',
    title: '修复客户端 bug',
    team: '开发',
    status: '已完成',
    color: 'purple',
    group: 'week',
  },
  {
    id: 'mobile-ux',
    title: '完善移动端交互',
    team: '产品',
    status: '已完成',
    color: 'blue',
    group: 'week',
  },
]

export const AUTH_COMMAND = '/workspace/project/collect_data/fetch_metrics.py'

export type AuthPhase = 'idle' | 'pending' | 'approved' | 'denied'

export function jellyForAuth(phase: AuthPhase): JellyState {
  if (phase === 'pending') return 'alert'
  if (phase === 'approved') return 'coding'
  if (phase === 'denied') return 'error'
  return 'idle'
}

export function pickMacReply(input: string): string {
  const text = input.trim().toLowerCase()
  if (/你好|hello|hi/.test(text)) return '你好！我在。把需求发我，我继续推进。'
  if (/中断|interrupt|stop/.test(text)) return '已收到中断说明，我会先停在安全点，等你下一步指示。'
  if (/设置|页面|数字员工/.test(text)) {
    return '收到。我会缩短显示名称，并检查设置页在窄屏下的布局。'
  }
  return '明白。我先按这个方向改，有结果会同步到会话里。'
}
