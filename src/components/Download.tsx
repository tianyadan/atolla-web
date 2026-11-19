import { useI18n } from '../i18n/I18nProvider'
import './Download.css'

export const RELEASE_URL = 'https://github.com/tianyadan/Atolla/releases/tag/v0.6.5'
export const RELEASE_VERSION = '0.6.5'

export function AppleMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.75 2.27-1.6 2.78-.41 6.89 1.15 9.14.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.76-.96 2.8 1.02.08 2.05-.51 2.68-1.28z" />
    </svg>
  )
}

function WindowsMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 5.5 10.5 4.4v7.1H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7.1L3 18.5zM11.5 12.5H21V21l-9.5-1.3z" />
    </svg>
  )
}

function LinuxMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m7 9 3 3-3 3M12.5 15H17" />
    </svg>
  )
}

/** 主下载按钮：当前仅提供 macOS（Apple 芯片）安装包 */
export function MacDownloadButton({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n()
  return (
    <a className="btn btn--primary btn--download" href={RELEASE_URL} target="_blank" rel="noopener noreferrer">
      <AppleMark size={compact ? 15 : 17} />
      {t('download.mac')}
    </a>
  )
}

/** 平台说明：Mac 可下载，Windows / Linux 开发中 */
export function PlatformNote() {
  const { t } = useI18n()
  return (
    <ul className="platforms" aria-label={t('download.platforms')}>
      <li className="platforms__item is-ready">
        <AppleMark size={14} />
        <span>macOS</span>
        <em>{t('download.macMeta').replace('{v}', RELEASE_VERSION)}</em>
      </li>
      <li className="platforms__item">
        <WindowsMark />
        <span>Windows</span>
        <em>{t('download.wip')}</em>
      </li>
      <li className="platforms__item">
        <LinuxMark />
        <span>Linux</span>
        <em>{t('download.wip')}</em>
      </li>
    </ul>
  )
}
