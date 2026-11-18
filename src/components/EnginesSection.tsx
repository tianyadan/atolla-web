import TiltSurface from './TiltSurface'

const ENGINES = [
  {
    id: 'codex',
    name: 'Codex',
    note: '在 Codex CLI 上运行智能体',
  },
  {
    id: 'claude',
    name: 'Claude',
    note: '在 Claude CLI 上运行智能体',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    note: '在 Cursor CLI 上运行智能体',
  },
] as const

/** CLI 引擎卖点：Codex / Claude / Cursor */
export default function EnginesSection() {
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
              <p className="engines__note">{engine.note}</p>
            </TiltSurface>
          </li>
        ))}
      </ul>
      <p className="engines__footnote">智能体可运行在这三种 CLI 引擎之上。</p>
    </div>
  )
}
