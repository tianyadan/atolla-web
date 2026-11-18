import { useEffect, useState } from 'react'
import JellyAvatar from '../jelly/JellyAvatar'
import { JELLY_COLORS, JELLY_COLOR_LABELS, type JellyColor } from '../jelly/colors'
import { prefersReducedMotion, type JellyState } from '../jelly/jellySprite'
import TiltSurface from './TiltSurface'

const STATES: { id: JellyState; label: string }[] = [
  { id: 'idle', label: '空闲' },
  { id: 'typing', label: '回复中' },
  { id: 'ponder', label: '思考' },
  { id: 'coding', label: '写代码' },
  { id: 'sleep', label: '休眠' },
  { id: 'eat', label: '进食' },
  { id: 'alert', label: '提醒' },
  { id: 'error', label: '出错' },
  { id: 'celebrate', label: '庆祝' },
]

/** 十二色头像：点选色板即时切换，状态可手动或自动循环 */
export default function AvatarShowcase() {
  const [state, setState] = useState<JellyState>('typing')
  const [color, setColor] = useState<JellyColor>('cyan')
  const [autoCycle, setAutoCycle] = useState(true)

  useEffect(() => {
    if (!autoCycle || prefersReducedMotion()) return undefined
    const t = setInterval(() => {
      setState((current) => {
        const idx = STATES.findIndex((s) => s.id === current)
        return STATES[(idx + 1) % STATES.length].id
      })
    }, 2200)
    return () => clearInterval(t)
  }, [autoCycle])

  return (
    <div className="avatar-showcase">
      <div className="avatar-showcase__stage">
        <TiltSurface className="avatar-showcase__hero-card" maxTilt={8}>
          <JellyAvatar color={color} size={120} state={state} />
          <p className="avatar-showcase__hero-meta">
            {JELLY_COLOR_LABELS[color]} · {STATES.find((s) => s.id === state)?.label}
          </p>
        </TiltSurface>
      </div>

      <div className="avatar-showcase__states" role="tablist" aria-label="头像状态">
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={state === item.id}
            className={state === item.id ? 'is-active' : undefined}
            onClick={() => {
              setAutoCycle(false)
              setState(item.id)
            }}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className={autoCycle ? 'is-active avatar-showcase__cycle' : 'avatar-showcase__cycle'}
          onClick={() => setAutoCycle(true)}
        >
          自动循环
        </button>
      </div>

      <ul className="avatar-showcase__grid" aria-label="选择颜色">
        {JELLY_COLORS.map((c) => (
          <li key={c}>
            <button
              type="button"
              className={color === c ? 'is-active' : undefined}
              onClick={() => setColor(c)}
              aria-pressed={color === c}
            >
              <JellyAvatar color={c} size={56} state={state} />
              <span>{JELLY_COLOR_LABELS[c]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
