import Aurora from './components/reactbits/Aurora/Aurora'
import BlurText from './components/reactbits/BlurText/BlurText'
import FadeContent from './components/reactbits/FadeContent/FadeContent'
import ScrollFloat from './components/reactbits/ScrollFloat/ScrollFloat'
import ScrollReveal from './components/reactbits/ScrollReveal/ScrollReveal'
import AuthSyncSection from './components/devices/AuthSyncSection'
import MultiDeviceSection from './components/devices/MultiDeviceSection'
import AvatarShowcase from './components/AvatarShowcase'
import EnginesSection from './components/EnginesSection'
import GitHubMark, { GITHUB_REPO_URL } from './components/GitHubMark'
import HeroJelly from './components/HeroJelly'
import ParallaxSection from './components/ParallaxSection'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import TeamDiagram from './components/TeamDiagram'
import { useI18n } from './i18n/I18nProvider'
import './App.css'

/** Atolla 产品营销单页 */
export default function App() {
  const { t, fading } = useI18n()

  return (
    <div className={`page ${fading ? 'is-locale-fading' : ''}`} id="top">
      <div className="page__aurora" aria-hidden="true">
        <Aurora
          colorStops={['#0a3a4a', '#1a6b7a', '#0d4f5c']}
          amplitude={0.6}
          blend={0.55}
          speed={0.5}
          height={0.55}
          glow={0.5}
          brightness={0.75}
          layers={2}
          direction="top"
          mouseInteraction
          opacity={0.6}
        />
      </div>

      <SiteNav />

      <section className="section section--hero" aria-label="hero">
        <div className="hero">
          <div className="hero__copy">
            <h1 className="hero__brand">
              <BlurText
                text="Atolla"
                animateBy="letters"
                direction="top"
                delay={40}
                stepDuration={0.28}
                blur={12}
                distance={28}
                trigger="load"
                className="hero__brand-text"
              />
            </h1>
            <FadeContent
              blur
              duration={0.85}
              delay={0.15}
              threshold={0}
              trigger="mount"
              className="hero__tagline"
            >
              <p className="hero__tagline-text">{t('hero.tagline')}</p>
            </FadeContent>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#cta">
                {t('hero.ctaTrial')}
              </a>
              <a
                className="btn btn--ghost btn--github"
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubMark size={16} />
                {t('hero.ctaGithub')}
              </a>
            </div>
          </div>
          <HeroJelly size={148} />
        </div>
      </section>

      <ParallaxSection id="collaborate" aria-labelledby="collab-title">
        <FadeContent blur duration={0.9} threshold={0.2} className="section__inner">
          <p className="section__eyebrow">{t('collab.eyebrow')}</p>
          <ScrollFloat
            containerClassName="section__title-wrap"
            textClassName="section__title"
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="top bottom-=20%"
            scrollEnd="bottom bottom-=35%"
            stagger={0.02}
          >
            {t('collab.title')}
          </ScrollFloat>
          <p className="section__lede">{t('collab.lede')}</p>
          <TeamDiagram />
        </FadeContent>
      </ParallaxSection>

      <section className="section section--devices" id="devices" aria-labelledby="devices-title">
        <div className="section__inner section__inner--devices">
          <FadeContent blur duration={0.9} threshold={0.12} className="section__copy-block">
            <p className="section__eyebrow">{t('devices.eyebrow')}</p>
            <h2 id="devices-title" className="section__title section__title--balanced">
              {t('devices.title')}
            </h2>
            <p className="section__lede section__lede--wide">{t('devices.lede')}</p>
          </FadeContent>
          <MultiDeviceSection />
        </div>
      </section>

      <section className="section section--auth" id="authorize" aria-labelledby="auth-title">
        <div className="section__inner section__inner--devices">
          <FadeContent blur duration={0.9} threshold={0.12} className="section__copy-block">
            <p className="section__eyebrow">{t('auth.eyebrow')}</p>
            <h2 id="auth-title" className="section__title section__title--balanced">
              {t('auth.title')}
            </h2>
            <p className="section__lede section__lede--wide">{t('auth.lede')}</p>
          </FadeContent>
          <AuthSyncSection />
        </div>
      </section>

      <ParallaxSection id="engines" aria-labelledby="engines-title">
        <FadeContent blur duration={0.9} threshold={0.15} className="section__inner">
          <p className="section__eyebrow">{t('engines.eyebrow')}</p>
          <ScrollReveal
            containerClassName="section__title-wrap"
            textClassName="section__title"
            baseOpacity={0.12}
            enableBlur
            blurStrength={5}
            baseOffset={24}
            stagger={0.04}
            mode="enter"
            effect="rise"
            duration={0.7}
          >
            {t('engines.title')}
          </ScrollReveal>
          <p className="section__lede">{t('engines.lede')}</p>
          <EnginesSection />
        </FadeContent>
      </ParallaxSection>

      <ParallaxSection id="avatars" aria-labelledby="avatar-title">
        <FadeContent blur duration={0.9} threshold={0.15} className="section__inner">
          <p className="section__eyebrow">{t('avatars.eyebrow')}</p>
          <ScrollReveal
            containerClassName="section__title-wrap"
            textClassName="section__title"
            baseOpacity={0.12}
            enableBlur
            blurStrength={5}
            baseOffset={24}
            stagger={0.04}
            mode="enter"
            effect="rise"
            duration={0.7}
          >
            {t('avatars.title')}
          </ScrollReveal>
          <p className="section__lede">{t('avatars.lede')}</p>
          <AvatarShowcase />
        </FadeContent>
      </ParallaxSection>

      <section className="section section--cta" id="cta" aria-label={t('cta.aria')}>
        <FadeContent blur duration={0.9} threshold={0.2} className="section__inner section__inner--cta">
          <h2 className="cta__title">{t('cta.title')}</h2>
          <p className="cta__lede">{t('cta.lede')}</p>
          <div className="cta__actions">
            <a className="btn btn--primary" href="#">
              {t('cta.trial')}
            </a>
            <a
              className="btn btn--ghost btn--github"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubMark size={16} />
              {t('cta.github')}
            </a>
          </div>
        </FadeContent>
      </section>

      <SiteFooter />
    </div>
  )
}
