/** 十二色像素水母头像色板（与产品素材一致） */
export const JELLY_COLORS = [
  'orange',
  'yellow',
  'blue',
  'green',
  'purple',
  'red',
  'cyan',
  'teal',
  'pink',
  'lime',
  'coral',
  'sky',
] as const

export type JellyColor = (typeof JELLY_COLORS)[number]

/** 中文展示名 */
export const JELLY_COLOR_LABELS: Record<JellyColor, string> = {
  orange: '橙',
  yellow: '黄',
  blue: '蓝',
  green: '绿',
  purple: '紫',
  red: '红',
  cyan: '青',
  teal: '青绿',
  pink: '粉',
  lime: '柠',
  coral: '珊瑚',
  sky: '天蓝',
}

export function isJellyColor(value: string): value is JellyColor {
  return (JELLY_COLORS as readonly string[]).includes(value)
}

export function normalizeJellyColor(value: string): JellyColor {
  return isJellyColor(value) ? value : 'cyan'
}
