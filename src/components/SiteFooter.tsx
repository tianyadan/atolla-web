import BrandLogo from './BrandLogo'

/** 页脚 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand-row">
        <BrandLogo size={22} />
        <p className="site-footer__brand">Atolla</p>
      </div>
      <p className="site-footer__meta">多智能体协作平台</p>
    </footer>
  )
}
