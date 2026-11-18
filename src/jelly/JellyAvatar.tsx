import { useEffect, useState } from 'react'
import { isJellyColor, normalizeJellyColor } from './colors'
import {
  JELLY_ACTION_ROWS,
  JELLY_CELL,
  JELLY_FRAMES,
  jellyActionRow,
  jellySpriteUrl,
  pickSpriteScale,
  prefersReducedMotion,
  type JellyState,
} from './jellySprite'
import './jellyAvatar.css'

const FLOAT_MS = 3000
const JUMP_MS = 600
const ALERT_MS = 800
const ERROR_MS = 889
const PONDER_MS = 1000
const CODING_MS = 1000
const SLEEP_MS = 1600
const EAT_MS = 727
const CELEBRATE_MS = 667

const FRAME_MS: Record<string, number> = {
  idle: FLOAT_MS / JELLY_FRAMES,
  typing: JUMP_MS / JELLY_FRAMES,
  working: JUMP_MS / JELLY_FRAMES,
  waiting: ALERT_MS / JELLY_FRAMES,
  alert: ALERT_MS / JELLY_FRAMES,
  error: ERROR_MS / JELLY_FRAMES,
  ponder: PONDER_MS / JELLY_FRAMES,
  coding: CODING_MS / JELLY_FRAMES,
  sleep: SLEEP_MS / JELLY_FRAMES,
  eat: EAT_MS / JELLY_FRAMES,
  celebrate: CELEBRATE_MS / JELLY_FRAMES,
}

type JellyAvatarProps = {
  color?: string
  size?: number
  state?: JellyState
  className?: string
  title?: string
  'aria-label'?: string
}

/** 像素水母头像：按 state 切换精灵行并步进 background-position */
export default function JellyAvatar({
  color = 'cyan',
  size = 48,
  state = 'idle',
  className = '',
  title,
  'aria-label': ariaLabel,
}: JellyAvatarProps) {
  const safeColor = isJellyColor(color) ? normalizeJellyColor(color) : 'cyan'
  const px = Math.max(8, Math.round(Number(size) || 48))
  const cellPx = px / JELLY_CELL
  const [frame, setFrame] = useState(0)
  const [reduced, setReduced] = useState(() => prefersReducedMotion())
  const [flashOn, setFlashOn] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    onChange()
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const row = jellyActionRow(state)
  const frameMs = FRAME_MS[state] ?? FRAME_MS.idle

  // 帧循环；减少动效时定格第 0 帧
  useEffect(() => {
    if (reduced) {
      setFrame(0)
      return undefined
    }
    const t = setInterval(() => {
      setFrame((f) => (f + 1) % JELLY_FRAMES)
    }, frameMs)
    return () => clearInterval(t)
  }, [state, frameMs, reduced])

  // waiting：叠加透明度闪烁
  useEffect(() => {
    if (state !== 'waiting' && state !== 'alert') {
      setFlashOn(true)
      return undefined
    }
    if (reduced) {
      setFlashOn(true)
      return undefined
    }
    let bright = true
    setFlashOn(true)
    const t = setInterval(() => {
      bright = !bright
      setFlashOn(bright)
    }, 700)
    return () => clearInterval(t)
  }, [state, reduced])

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const scale = pickSpriteScale(px, dpr)

  let transform = 'translateY(0)'
  let opacity = 1
  let animClass = ''

  if (state === 'error' && !reduced) {
    transform = `translateY(${cellPx * 1.5}px)`
  } else if (state === 'waiting' || state === 'alert') {
    opacity = flashOn ? 1 : 0.35
  } else if (!reduced && state === 'idle') {
    animClass = 'jelly-avatar--bob'
  } else if (!reduced && (state === 'working' || state === 'typing')) {
    animClass = 'jelly-avatar--jump'
  }

  const classes = ['jelly-avatar', animClass, className].filter(Boolean).join(' ')

  // 百分比定位帧，便于 CSS 覆盖显示尺寸时仍对齐单元格
  const posX = (frame / (JELLY_FRAMES - 1 || 1)) * 100
  const posY = (row / (JELLY_ACTION_ROWS - 1 || 1)) * 100

  return (
    <span
      className={classes}
      title={title}
      role="img"
      aria-label={ariaLabel || `jelly ${safeColor}`}
      style={{
        width: px,
        height: px,
        ['--jelly-cell' as string]: `${cellPx}px`,
        ['--jelly-frame' as string]: String(frame),
        ['--jelly-row' as string]: String(row),
        backgroundImage: `url(${jellySpriteUrl(safeColor, scale)})`,
        backgroundSize: `${JELLY_FRAMES * 100}% ${JELLY_ACTION_ROWS * 100}%`,
        backgroundPosition: `${posX}% ${posY}%`,
        transform,
        opacity,
      }}
    />
  )
}
