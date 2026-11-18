import { normalizeJellyColor, type JellyColor } from './colors'

/** 精灵图：每格 16px 逻辑像素 */
export const JELLY_CELL = 16
export const JELLY_FRAMES = 8
/** 8 列 × 9 行动作 */
export const JELLY_ACTION_ROWS = 9

export type JellyState =
  | 'idle'
  | 'typing'
  | 'working'
  | 'sleep'
  | 'eat'
  | 'alert'
  | 'waiting'
  | 'error'
  | 'celebrate'
  | 'ponder'
  | 'coding'

/** 动作行顺序与 spritesheet 一致 */
export const JELLY_ACTION_ROW: Record<string, number> = {
  idle: 0,
  typing: 1,
  sleep: 2,
  eat: 3,
  alert: 4,
  error: 5,
  celebrate: 6,
  ponder: 7,
  coding: 8,
  float: 0,
  jump: 1,
  working: 1,
  waiting: 4,
}

/** Avatar state → 精灵行 */
export function jellyActionRow(state: JellyState | string): number {
  const s = String(state || 'idle')
  if (s === 'working' || s === 'typing') return JELLY_ACTION_ROW.typing
  if (s === 'waiting') return JELLY_ACTION_ROW.alert
  if (s === 'error') return JELLY_ACTION_ROW.error
  if (s === 'sleep') return JELLY_ACTION_ROW.sleep
  if (s === 'eat') return JELLY_ACTION_ROW.eat
  if (s === 'celebrate') return JELLY_ACTION_ROW.celebrate
  if (s === 'ponder') return JELLY_ACTION_ROW.ponder
  if (s === 'coding') return JELLY_ACTION_ROW.coding
  return JELLY_ACTION_ROW.idle
}

/** 按显示尺寸选最清晰的精灵图密度（1x / 2x / 3x） */
export function pickSpriteScale(size: number, dpr = 1): 1 | 2 | 3 {
  const need = size * (dpr || 1)
  if (need <= 16) return 1
  if (need <= 32) return 2
  return 3
}

/**
 * 精灵图相对 URL（配合 Vite base: './'）
 * 仅提供 @32 / @48，scale 1 回退到 32。
 */
export function jellySpriteUrl(color: string, scale: 1 | 2 | 3): string {
  const c: JellyColor = normalizeJellyColor(color)
  const px = scale === 1 ? 32 : JELLY_CELL * scale
  return `./jelly-sprites/jelly-${c}@${px}.png`
}

/** 是否应跳过位移动画 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
