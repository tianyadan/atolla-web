import { translate } from '../../i18n/dictionaries'
import type { Locale } from '../../i18n/types'
import type { JellyColor } from '../../jelly/colors'
import type { JellyState } from '../../jelly/jellySprite'

export type MacChatStatusKey = 'active' | 'done'

export type MacChatItem = {
  id: string
  titleKey: string
  teamKey: string
  statusKey: MacChatStatusKey
  color: JellyColor
  group: 'today' | 'week'
}

export const MAC_CHATS: MacChatItem[] = [
  {
    id: 'opt-settings',
    titleKey: 'mac.chat.opt',
    teamKey: 'mac.team.fullstack',
    statusKey: 'active',
    color: 'red',
    group: 'today',
  },
  {
    id: 'fix-bug',
    titleKey: 'mac.chat.bug',
    teamKey: 'mac.team.dev',
    statusKey: 'done',
    color: 'purple',
    group: 'week',
  },
  {
    id: 'mobile-ux',
    titleKey: 'mac.chat.mobile',
    teamKey: 'mac.team.product',
    statusKey: 'done',
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

export function pickMacReply(input: string, locale: Locale): string {
  const text = input.trim().toLowerCase()
  if (/你好|hello|hi/.test(text)) return translate(locale, 'mac.reply.hello')
  if (/中断|interrupt|stop/.test(text)) return translate(locale, 'mac.reply.interrupt')
  if (/设置|页面|数字员工|settings|display/.test(text)) {
    return translate(locale, 'mac.reply.settings')
  }
  return translate(locale, 'mac.reply.default')
}

export function statusLabel(statusKey: MacChatStatusKey, locale: Locale) {
  return translate(locale, statusKey === 'active' ? 'mac.status.active' : 'mac.status.done')
}
