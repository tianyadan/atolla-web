import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import './IPhoneAuthScreen.css'

/**
 * iPhone 授权演示屏：深色锁屏（日期 + 时钟）。
 * 授权本身在灵动岛的 Live Activity 中完成，不再有底部卡片。
 */
export default function IPhoneAuthScreen() {
  const { locale } = useI18n()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const dateLabel = now.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="iphone-auth">
      <div className="iphone-auth__wallpaper" aria-hidden="true" />
      <div className="iphone-auth__lock" aria-hidden="true">
        <span className="iphone-auth__date">{dateLabel}</span>
        <span className="iphone-auth__clock">{clock}</span>
      </div>
    </div>
  )
}
