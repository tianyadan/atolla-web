import { useEffect, useMemo, useRef, useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { useI18n } from '../i18n/I18nProvider'
import { navigate, onLinkClick, scrollToHash, usePathname } from '../router'
import { DEFAULT_SLUG, DOC_GROUPS, DOC_ITEMS, DOCS_UI, docSource, groupOf } from './manifest'
import { plainText, renderDoc } from './markdown'
import { DEMOS } from './demos/index'
import './docs.css'

const CALLOUTS = {
  zh: { note: '说明', tip: '提示', warning: '注意', important: '重要' },
  en: { note: 'Note', tip: 'Tip', warning: 'Warning', important: 'Important' },
}

/** 产品文档：左侧编号目录 · 中间 Markdown + 交互演示 · 右侧本页目录 */
export default function DocsPage() {
  const { locale, fading } = useI18n()
  const ui = DOCS_UI[locale]
  const path = usePathname()
  const slug = path.replace(/^\/docs\/?/, '').replace(/\/$/, '')
  const current = DOC_ITEMS.find((i) => i.slug === slug)

  // /docs 或未知 slug → 第一节
  useEffect(() => {
    if (!current) navigate(`/docs/${DEFAULT_SLUG}`, { replace: true })
  }, [current])

  useEffect(() => {
    document.body.classList.add('is-docs')
    return () => document.body.classList.remove('is-docs')
  }, [])

  const item = current ?? DOC_ITEMS[0]
  const group = groupOf(item.slug)!
  const index = DOC_ITEMS.indexOf(item)
  const prev = DOC_ITEMS[index - 1]
  const next = DOC_ITEMS[index + 1]

  const { segments, headings } = useMemo(
    () => renderDoc(docSource(locale, item.slug), { copy: ui.copy, callouts: CALLOUTS[locale] }),
    [locale, item.slug, ui.copy],
  )

  useEffect(() => {
    document.title = `${item.num} ${item.title[locale]} · Atolla ${ui.docs}`
  }, [item, locale, ui.docs])

  // 首次进入带 hash 时滚到对应标题
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash, 5)
  }, [item.slug])

  const [query, setQuery] = useState('')
  // 抽屉记住打开时所在的条目，切换条目后自动视为关闭
  const [drawerSlug, setDrawerSlug] = useState<string | null>(null)
  const drawer = drawerSlug === item.slug
  const setDrawer = (open: boolean) => setDrawerSlug(open ? item.slug : null)
  useEffect(() => {
    document.body.classList.toggle('docs-drawer-open', drawer)
    if (!drawer) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerSlug(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawer])

  const articleRef = useRef<HTMLElement>(null)
  const activeId = useActiveHeading(headings.map((h) => h.id), item.slug)

  // 文章内交互：复制代码、站内链接、标题锚点
  const onArticleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    const btn = target.closest('.md-copy') as HTMLButtonElement | null
    if (btn) {
      const code = btn.closest('.md-code')?.querySelector('code')?.textContent ?? ''
      void copy(code).then(() => {
        btn.textContent = ui.copied
        btn.classList.add('is-done')
        window.setTimeout(() => {
          btn.textContent = ui.copy
          btn.classList.remove('is-done')
        }, 1400)
      })
      return
    }
    const a = target.closest('a') as HTMLAnchorElement | null
    if (!a) return
    const href = a.getAttribute('href') ?? ''
    if (href.startsWith('#')) {
      e.preventDefault()
      window.history.replaceState(null, '', href)
      scrollToHash(href, 0)
    } else if (href.startsWith('/')) {
      onLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, href)
    }
  }

  return (
    <div className={`docs-shell ${fading ? 'is-locale-fading' : ''}`}>
      <SiteNav />

      <div className="docs-mobilebar">
        <button type="button" className="docs-mobilebar__btn" onClick={() => setDrawer(true)} aria-expanded={drawer}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 4h11M2.5 8h11M2.5 12h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="docs-mobilebar__label">{ui.toc}</span>
          <span className="docs-mobilebar__sep">·</span>
          <span className="docs-mobilebar__cur">
            {item.num} {item.title[locale]}
          </span>
          <svg className="docs-mobilebar__chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={`docs-drawer ${drawer ? 'is-open' : ''}`} aria-hidden={!drawer}>
        <button type="button" className="docs-drawer__scrim" aria-label={ui.close} onClick={() => setDrawer(false)} tabIndex={drawer ? 0 : -1} />
        <aside className="docs-drawer__panel" role="dialog" aria-label={ui.toc}>
          <div className="docs-drawer__head">
            <span>{ui.toc}</span>
            <button type="button" onClick={() => setDrawer(false)} aria-label={ui.close}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <Sidebar query={query} setQuery={setQuery} activeSlug={item.slug} />
        </aside>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar" aria-label={ui.toc}>
          <Sidebar query={query} setQuery={setQuery} activeSlug={item.slug} />
        </aside>

        <main className="docs-main" key={`${locale}-${item.slug}`}>
          <nav className="docs-crumbs" aria-label="breadcrumb">
            <a href={`/docs/${DEFAULT_SLUG}`} onClick={(e) => onLinkClick(e, `/docs/${DEFAULT_SLUG}`)}>
              {ui.docs}
            </a>
            <span aria-hidden="true">/</span>
            <span>
              {group.num}. {group.title[locale]}
            </span>
          </nav>
          <header className="docs-head">
            <p className="docs-head__num">{item.num}</p>
            <h1>{item.title[locale]}</h1>
            <p className="docs-head__lead">{item.summary[locale]}</p>
          </header>

          <article className="docs-article" ref={articleRef} onClick={onArticleClick}>
            {segments.map((seg, i) => {
              if (seg.kind === 'html') return <div key={i} className="md" dangerouslySetInnerHTML={{ __html: seg.html }} />
              const Demo = DEMOS[seg.name]
              return Demo ? <Demo key={i} /> : null
            })}
          </article>

          <nav className="docs-pager" aria-label="pager">
            {prev ? (
              <a className="docs-pager__card" href={`/docs/${prev.slug}`} onClick={(e) => onLinkClick(e, `/docs/${prev.slug}`)}>
                <span className="docs-pager__dir">← {ui.prev}</span>
                <span className="docs-pager__title">
                  {prev.num} {prev.title[locale]}
                </span>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a className="docs-pager__card docs-pager__card--next" href={`/docs/${next.slug}`} onClick={(e) => onLinkClick(e, `/docs/${next.slug}`)}>
                <span className="docs-pager__dir">{ui.next} →</span>
                <span className="docs-pager__title">
                  {next.num} {next.title[locale]}
                </span>
              </a>
            ) : (
              <span />
            )}
          </nav>
          <p className="docs-version">{ui.version}</p>
        </main>

        <aside className="docs-toc" aria-label={ui.onThisPage}>
          {headings.length > 0 && (
            <>
              <p className="docs-toc__title">{ui.onThisPage}</p>
              <ul>
                {headings.map((h) => (
                  <li key={h.id} className={`docs-toc__item docs-toc__item--h${h.depth} ${activeId === h.id ? 'is-active' : ''}`}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        window.history.replaceState(null, '', `#${h.id}`)
                        scrollToHash(`#${h.id}`, 0)
                      }}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
              <button type="button" className="docs-toc__top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ↑ {ui.backTop}
              </button>
            </>
          )}
        </aside>
      </div>

      <div className="docs-footer-wrap">
        <SiteFooter />
      </div>
    </div>
  )
}

function Sidebar({ query, setQuery, activeSlug }: { query: string; setQuery: (q: string) => void; activeSlug: string }) {
  const { locale } = useI18n()
  const ui = DOCS_UI[locale]
  const q = query.trim().toLowerCase()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const groups = useMemo(() => {
    if (!q) return DOC_GROUPS
    return DOC_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => {
        const hay = `${i.num} ${i.title.zh} ${i.title.en} ${i.summary[locale]}`.toLowerCase()
        return hay.includes(q) || plainText(docSource(locale, i.slug)).includes(q)
      }),
    })).filter((g) => g.items.length > 0)
  }, [q, locale])

  return (
    <div className="docs-nav">
      <label className="docs-search">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.search} aria-label={ui.search} />
      </label>
      {groups.length === 0 && <p className="docs-nav__empty">{ui.noResult}</p>}
      {groups.map((g) => {
        const isCollapsed = !q && collapsed[g.num]
        return (
          <div className="docs-nav__group" key={g.num}>
            <button
              type="button"
              className={`docs-nav__group-title ${isCollapsed ? 'is-collapsed' : ''}`}
              onClick={() => setCollapsed((c) => ({ ...c, [g.num]: !c[g.num] }))}
              aria-expanded={!isCollapsed}
            >
              <span className="docs-nav__gnum">{g.num}</span>
              <span>{g.title[locale]}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2.5 3.8 5 6.3l2.5-2.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              </svg>
            </button>
            {!isCollapsed && (
              <ul>
                {g.items.map((i) => (
                  <li key={i.slug}>
                    <a
                      href={`/docs/${i.slug}`}
                      className={i.slug === activeSlug ? 'is-active' : undefined}
                      aria-current={i.slug === activeSlug ? 'page' : undefined}
                      onClick={(e) => onLinkClick(e, `/docs/${i.slug}`)}
                    >
                      <span className="docs-nav__num">{i.num}</span>
                      <span>{i.title[locale]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function useActiveHeading(ids: string[], key: string) {
  const [active, setActive] = useState<string>('')
  const idsKey = ids.join('|')
  useEffect(() => {
    const list = idsKey ? idsKey.split('|') : []
    let raf = 0
    const update = () => {
      raf = 0
      let cur = list[0] ?? ''
      for (const id of list) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 140) cur = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && list.length) {
        // 到底部时高亮最后一个可见标题
        const lastVisible = list.filter((id) => {
          const el = document.getElementById(id)
          return el && el.getBoundingClientRect().top < window.innerHeight
        })
        cur = lastVisible[lastVisible.length - 1] ?? cur
      }
      setActive(cur)
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [idsKey, key])
  return active
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}
