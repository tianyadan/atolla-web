import { useI18n } from '../i18n/I18nProvider'
import TiltSurface from './TiltSurface'

const ENGINES = [
  { id: 'codex', name: 'Codex', noteKey: 'engines.note.codex' },
  { id: 'claude', name: 'Claude', noteKey: 'engines.note.claude' },
  { id: 'cursor', name: 'Cursor', noteKey: 'engines.note.cursor' },
] as const

/** CLI 引擎卖点：Codex / Claude / Cursor */
export default function EnginesSection() {
  const { t } = useI18n()
  return (
    <div className="engines">
      <ul className="engines__grid">
        {ENGINES.map((engine) => (
          <li key={engine.id}>
            <TiltSurface className="engines__card" maxTilt={6}>
              <img
                className="engines__mark"
                src={`/engine-logos/${engine.id}.svg`}
                alt=""
                width={36}
                height={36}
              />
              <h3 className="engines__name">{engine.name}</h3>
              <p className="engines__note">{t(engine.noteKey)}</p>
            </TiltSurface>
          </li>
        ))}
      </ul>
      <p className="engines__footnote">{t('engines.footnote')}</p>
    </div>
  )
}
