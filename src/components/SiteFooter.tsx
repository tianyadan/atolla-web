import BrandLogo from './BrandLogo'
import GitHubMark, { GITHUB_README_URL, GITHUB_REPO_URL } from './GitHubMark'
import { useI18n } from '../i18n/I18nProvider'
import { isDocsPath, onLinkClick, usePathname } from '../router'

/** 标准产品页脚：四栏 + 底栏版权 */
export default function SiteFooter() {
  const { t, locale, setLocale } = useI18n()
  const onDocs = isDocsPath(usePathname())
  const anchor = (hash: string) => ({
    href: onDocs ? `/${hash}` : hash,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => (onDocs ? onLinkClick(e, `/${hash}`) : undefined),
  })

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand-col">
          <a className="site-footer__brand-row" {...anchor('#top')}>
            <BrandLogo size={22} />
            <span className="site-footer__brand">Atolla</span>
          </a>
          <p className="site-footer__tagline">{t('footer.tagline')}</p>
        </div>

        <div className="site-footer__cols">
          <div>
            <h3>{t('footer.product')}</h3>
            <ul>
              <li>
                <a {...anchor('#relay')}>{t('nav.relay')}</a>
              </li>
              <li>
                <a {...anchor('#devices')}>{t('nav.devices')}</a>
              </li>
              <li>
                <a {...anchor('#authorize')}>{t('nav.authorize')}</a>
              </li>
              <li>
                <a {...anchor('#island')}>{t('nav.island')}</a>
              </li>
              <li>
                <a {...anchor('#engines')}>{t('nav.engines')}</a>
              </li>
              <li>
                <a {...anchor('#avatars')}>{t('nav.avatars')}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>{t('footer.docs')}</h3>
            <ul>
              <li>
                <a href="/docs" onClick={(e) => onLinkClick(e, '/docs')}>
                  {t('footer.docsHome')}
                </a>
              </li>
              <li>
                <a href={GITHUB_README_URL} target="_blank" rel="noopener noreferrer">
                  {t('footer.readme')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>{t('footer.open')}</h3>
            <ul>
              <li>
                <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                  {t('footer.repo')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>{t('footer.language')}</h3>
            <ul>
              <li>
                <button type="button" className={locale === 'zh' ? 'is-active' : undefined} onClick={() => setLocale('zh')}>
                  中文
                </button>
              </li>
              <li>
                <button type="button" className={locale === 'en' ? 'is-active' : undefined} onClick={() => setLocale('en')}>
                  English
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">{t('footer.copyright')}</p>
        <a
          className="site-footer__gh"
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('nav.github')}
        >
          <GitHubMark size={16} />
        </a>
      </div>
    </footer>
  )
}
