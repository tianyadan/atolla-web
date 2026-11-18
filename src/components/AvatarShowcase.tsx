import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import JellyAvatar from '../jelly/JellyAvatar'
import { JELLY_COLORS, type JellyColor } from '../jelly/colors'
import { prefersReducedMotion, type JellyState } from '../jelly/jellySprite'
import TiltSurface from './TiltSurface'

const STATE_IDS: JellyState[] = [
  'idle',
  'typing',
  'ponder',
  'coding',
  'sleep',
  'eat',
  'alert',
  'error',
  'celebrate',
]

/** 十二色头像：点选色板即时切换，状态可手动或自动循环 */
export default function AvatarShowcase() {
  const { t } = useI18n()
  const [state, setState] = useState<JellyState>('typing')
  const [color, setColor] = useState<JellyColor>('cyan')
  const [autoCycle, setAutoCycle] = useState(true)

  useEffect(() => {
    if (!autoCycle || prefersReducedMotion()) return undefined
    const timer = setInterval(() => {
      setState((current) => {
        const idx = STATE_IDS.findIndex((s) => s === current)
        return STATE_IDS[(idx + 1) % STATE_IDS.length]
      })
    }, 2200)
    return () => clearInterval(timer)
  }, [autoCycle])

  return (
    <div className="avatar-showcase">
      <div className="avatar-showcase__stage">
        <TiltSurface className="avatar-showcase__hero-card" maxTilt={8}>
          <JellyAvatar color={color} size={120} state={state} />
          <p className="avatar-showcase__hero-meta">
            {t(`avatars.color.${color}`)} · {t(`avatars.state.${state}`)}
          </p>
        </TiltSurface>
      </div>

      <div className="avatar-showcase__states" role="tablist" aria-label={t('avatars.states')}>
        {STATE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={state === id}
            className={state === id ? 'is-active' : undefined}
            onClick={() => {
              setAutoCycle(false)
              setState(id)
            }}
          >
            {t(`avatars.state.${id}`)}
          </button>
        ))}
        <button
          type="button"
          className={autoCycle ? 'is-active avatar-showcase__cycle' : 'avatar-showcase__cycle'}
          onClick={() => setAutoCycle(true)}
        >
          {t('avatars.cycle')}
        </button>
      </div>

      <ul className="avatar-showcase__grid" aria-label={t('avatars.colors')}>
        {JELLY_COLORS.map((c) => (
          <li key={c}>
            <button
              type="button"
              className={color === c ? 'is-active' : undefined}
              onClick={() => setColor(c)}
              aria-pressed={color === c}
            >
              <JellyAvatar color={c} size={56} state={state} />
              <span>{t(`avatars.color.${c}`)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
