import BrandLogo from './BrandLogo'

/** 顶部极简导航 */
export default function SiteNav() {
  return (
    <header className="site-nav">
      <a className="site-nav__brand" href="#top" aria-label="Atolla 首页">
        <BrandLogo size={26} />
        <span>Atolla</span>
      </a>
      <nav className="site-nav__links" aria-label="页面导航">
        <a href="#collaborate">协作</a>
        <a href="#engines">引擎</a>
        <a href="#avatars">头像</a>
        <a href="#iphone">手机</a>
        <a href="#governance">治理</a>
        <a href="#cta" className="site-nav__cta">
          试用
        </a>
      </nav>
    </header>
  )
}
