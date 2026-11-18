import { useState } from 'react'
import JellyAvatar from '../jelly/JellyAvatar'
import { JELLY_COLORS, JELLY_COLOR_LABELS } from '../jelly/colors'
import type { JellyState } from '../jelly/jellySprite'

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

/** 十二色头像 + 状态动画展示 */
export default function AvatarShowcase() {
  const [state, setState] = useState<JellyState>('typing')

  return (
    <div className="avatar-showcase">
      <div className="avatar-showcase__states" role="tablist" aria-label="头像状态">
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={state === item.id}
            className={state === item.id ? 'is-active' : undefined}
            onClick={() => setState(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="avatar-showcase__grid">
        {JELLY_COLORS.map((color) => (
          <li key={color}>
            <JellyAvatar color={color} size={64} state={state} />
            <span>{JELLY_COLOR_LABELS[color]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
