import { useEffect, useState } from 'react'
import BrandLogo from './BrandLogo'
import GitHubMark, { GITHUB_API_REPO, GITHUB_REPO_URL } from './GitHubMark'
import { useI18n } from '../i18n/I18nProvider'

/** 顶部固定磨砂导航：Logo · 锚点 · 中/EN · GitHub star · CTA */
export default function SiteNav() {
  const { t, locale, setLocale } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(GITHUB_API_REPO)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { stargazers_count?: number }) => {
        if (cancelled) return
        if (typeof data.stargazers_count === 'number') setStars(data.stargazers_count)
      })
      .catch(() => {
        if (!cancelled) setStars(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { href: '#collaborate', label: t('nav.collaborate') },
    { href: '#devices', label: t('nav.devices') },
    { href: '#authorize', label: t('nav.authorize') },
    { href: '#engines', label: t('nav.engines') },
    { href: '#avatars', label: t('nav.avatars') },
  ]

  return (
    <header className={`site-nav-bar ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="site-nav">
        <a className="site-nav__brand" href="#top" aria-label={t('nav.home')}>
          <BrandLogo size={22} />
          <span>Atolla</span>
        </a>

        <nav className="site-nav__center" aria-label={t('nav.home')}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-nav__right">
          <div className="site-nav__lang" role="group" aria-label={t('nav.lang')}>
            <button
              type="button"
              className={locale === 'zh' ? 'is-active' : undefined}
              onClick={() => setLocale('zh')}
            >
              中
            </button>
            <button
              type="button"
              className={locale === 'en' ? 'is-active' : undefined}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
          </div>

          <a
            className="site-nav__github"
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('nav.github')}
          >
            <GitHubMark size={15} />
            <span className="site-nav__stars">
              {stars === null ? null : formatStars(stars)}
            </span>
          </a>

          <a className="site-nav__cta" href="#cta" onClick={() => setOpen(false)}>
            {t('nav.cta')}
          </a>

          <button
            type="button"
            className="site-nav__burger"
            aria-label={open ? t('nav.close') : t('nav.menu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`site-nav__drawer ${open ? 'is-open' : ''}`}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          GitHub
          {stars === null ? null : ` · ${formatStars(stars)}`}
        </a>
        <a href="#cta" className="site-nav__drawer-cta" onClick={() => setOpen(false)}>
          {t('nav.cta')}
        </a>
      </div>
    </header>
  )
}

function formatStars(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`
  return String(n)
}
