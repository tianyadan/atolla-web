import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n/I18nProvider'
import './index.css'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// iOS 地址栏伸缩时不重算，避免滚动中布局跳动
ScrollTrigger.config({ ignoreMobileResize: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
