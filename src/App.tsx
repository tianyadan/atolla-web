import Aurora from './components/reactbits/Aurora/Aurora'
import BlurText from './components/reactbits/BlurText/BlurText'
import FadeContent from './components/reactbits/FadeContent/FadeContent'
import ScrollReveal from './components/reactbits/ScrollReveal/ScrollReveal'
import AvatarShowcase from './components/AvatarShowcase'
import GovernanceVisual from './components/GovernanceVisual'
import HeroJelly from './components/HeroJelly'
import SiteFooter from './components/SiteFooter'
import SiteNav from './components/SiteNav'
import TeamDiagram from './components/TeamDiagram'
import './App.css'

/** Atolla 产品营销单页 */
export default function App() {
  return (
    <div className="page" id="top">
      <div className="page__aurora" aria-hidden="true">
        <Aurora
          colorStops={['#0a3a4a', '#1a6b7a', '#0d4f5c']}
          amplitude={0.55}
          blend={0.55}
          speed={0.45}
          height={0.55}
          glow={0.45}
          brightness={0.7}
          layers={2}
          direction="top"
          mouseInteraction={false}
          opacity={0.55}
        />
      </div>

      <SiteNav />

      {/* 1. Hero */}
      <section className="section section--hero" aria-label="首屏">
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
              {/* 普通文本换行，避免按字拆开后在「AI」处尴尬断行 */}
              <p className="hero__tagline-text">
                创建 AI 智能体，
                <wbr />
                组成团队，协同完成任务。
              </p>
            </FadeContent>
          </div>
          <HeroJelly size={148} />
        </div>
      </section>

      {/* 2. Multi-agent collaboration */}
      <section className="section" id="collaborate" aria-labelledby="collab-title">
        <FadeContent blur duration={0.9} threshold={0.2} className="section__inner">
          <p className="section__eyebrow">多智能体协作</p>
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
            一只水母，就是一支团队
          </ScrollReveal>
          <p className="section__lede">
            在 Atolla，你创建智能体，并把它们组织成团队。钟面用于指派任务；每一条触手，都是一名智能体，共同推进工作。
          </p>
          <TeamDiagram />
        </FadeContent>
      </section>

      {/* 3. Avatars + states */}
      <section className="section" id="avatars" aria-labelledby="avatar-title">
        <FadeContent blur duration={0.9} threshold={0.15} className="section__inner">
          <p className="section__eyebrow">像素水母头像</p>
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
            十二色身份，随状态而动
          </ScrollReveal>
          <p className="section__lede">
            每位智能体拥有像素风水母头像，共十二种颜色。头像会随状态变化：空闲轻轻漂浮，回复时工作，思考时沉吟，写代码时敲击——一眼读懂此刻发生了什么。
          </p>
          <AvatarShowcase />
        </FadeContent>
      </section>

      {/* 4. Governance */}
      <section className="section" id="governance" aria-labelledby="gov-title">
        <FadeContent blur duration={0.9} threshold={0.15} className="section__inner">
          <p className="section__eyebrow">审批与治理</p>
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
            需要你拍板时，蓝光会亮起
          </ScrollReveal>
          <p className="section__lede">
            需要人类批准的操作会被明确呈现。钟面边缘的蓝光表示有事项正在等待你的确认——你始终保有控制权。
          </p>
          <GovernanceVisual />
        </FadeContent>
      </section>

      {/* 5. Closing CTA */}
      <section className="section section--cta" id="cta" aria-label="开始使用">
        <FadeContent blur duration={0.9} threshold={0.2} className="section__inner section__inner--cta">
          <h2 className="cta__title">把智能体，带进你的团队</h2>
          <p className="cta__lede">申请试用，或直接进入产品，开始组建你的第一支水母团队。</p>
          <div className="cta__actions">
            <a className="btn btn--primary" href="#">
              申请试用
            </a>
            <a className="btn btn--ghost" href="#">
              进入产品
            </a>
          </div>
        </FadeContent>
      </section>

      <SiteFooter />
    </div>
  )
}
