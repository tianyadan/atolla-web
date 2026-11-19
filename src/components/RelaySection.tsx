import { useI18n } from '../i18n/I18nProvider'
import { AppleMark } from './Download'
import './RelaySection.css'

function ServerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <rect x="3.5" y="4" width="17" height="6.5" rx="2" />
      <rect x="3.5" y="13.5" width="17" height="6.5" rx="2" />
      <path d="M7 7.25h.01M7 16.75h.01M11 7.25h6M11 16.75h6" />
    </svg>
  )
}
function LaptopIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="1.6" />
      <path d="M2 19h20" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path d="M10.5 5.2h3" />
    </svg>
  )
}

/** 远程中继：自部署服务器，Mac ↔ 中继 ↔ 手机 */
export default function RelaySection() {
  const { t } = useI18n()
  const steps = [1, 2, 3].map((n) => ({ title: t(`relay.step${n}.title`), body: t(`relay.step${n}.body`) }))
  return (
    <div className="relay">
      <div className="relay__diagram" aria-hidden="true">
        <div className="relay__node">
          <span className="relay__icon"><LaptopIcon /></span>
          <strong>Mac</strong>
          <small><AppleMark size={11} /> Atolla</small>
        </div>
        <div className="relay__wire"><i /><i /></div>
        <div className="relay__node relay__node--hub">
          <span className="relay__icon"><ServerIcon /></span>
          <strong>{t('relay.hub')}</strong>
          <small>{t('relay.hubMeta')}</small>
        </div>
        <div className="relay__wire relay__wire--rev"><i /><i /></div>
        <div className="relay__node">
          <span className="relay__icon"><PhoneIcon /></span>
          <strong>iPhone</strong>
          <small>Atolla</small>
        </div>
      </div>
      <ol className="relay__steps">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="relay__num">{i + 1}</span>
            <div>
              <strong>{s.title}</strong>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
