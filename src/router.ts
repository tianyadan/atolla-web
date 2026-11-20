import { useSyncExternalStore } from 'react'

/** 极简 History 路由：不引入 react-router，保持首页包体轻量 */
const EVENT = 'atolla:navigate'

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

const getPath = () => window.location.pathname

export function usePathname() {
  return useSyncExternalStore(subscribe, getPath, () => '/')
}

export function isDocsPath(path: string) {
  return path === '/docs' || path.startsWith('/docs/')
}

/** 站内跳转：支持 "/docs/x"、"/#relay"、"/" */
export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = new URL(to, window.location.origin)
  const samePath = url.pathname === window.location.pathname
  if (opts.replace) window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  else window.history.pushState(null, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new Event(EVENT))
  if (url.hash) {
    scrollToHash(url.hash, samePath ? 0 : 3)
  } else if (!samePath) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

/** 等目标节点渲染出来再滚动（跨页回首页锚点时需要多等几帧） */
export function scrollToHash(hash: string, retries = 3) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  let tries = 0
  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: tries === 0 ? 'smooth' : 'auto', block: 'start' })
      return
    }
    if (tries++ < retries + 20) window.setTimeout(tick, 50)
  }
  window.requestAnimationFrame(tick)
}

/** 普通 <a> 点击拦截：保留新标签页 / 修饰键行为 */
export function onLinkClick(e: React.MouseEvent<HTMLAnchorElement>, to: string, after?: () => void) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  navigate(to)
  after?.()
}
