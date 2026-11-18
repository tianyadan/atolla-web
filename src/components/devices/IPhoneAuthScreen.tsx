import JellyAvatar from '../../jelly/JellyAvatar'
import { AUTH_COMMAND, type AuthPhase } from '../mac/macChats'
import './IPhoneAuthScreen.css'

export type IPhoneAuthScreenProps = {
  phase: AuthPhase
  onAllow: () => void
  onDeny: () => void
}

/**
 * iPhone 授权演示屏：锁屏式通知横幅 + 命令授权卡片。
 */
export default function IPhoneAuthScreen({ phase, onAllow, onDeny }: IPhoneAuthScreenProps) {
  const pending = phase === 'pending'
  const jelly =
    phase === 'pending' ? 'alert' : phase === 'approved' ? 'coding' : phase === 'denied' ? 'error' : 'idle'

  return (
    <div className={`iphone-auth ${pending ? 'is-pending' : ''}`}>
      <div className="iphone-auth__wallpaper" aria-hidden="true" />

      {pending ? (
        <div className="iphone-auth__banner" role="status">
          <div className="iphone-auth__banner-top">
            <img src="/brand-jellyfish-white.png" alt="" width={14} height={14} />
            <span>ATOLLA</span>
            <time>现在</time>
          </div>
          <p className="iphone-auth__banner-title">全栈 请求执行命令</p>
          <p className="iphone-auth__banner-body">需要你确认后才会继续运行。</p>
        </div>
      ) : null}

      <div className={`iphone-auth__sheet ${phase !== 'idle' ? 'is-show' : ''}`}>
        <div className="iphone-auth__agent">
          <JellyAvatar color="red" size={36} state={jelly} />
          <div>
            <strong>全栈</strong>
            <span>命令授权</span>
          </div>
        </div>

        {phase === 'pending' || phase === 'idle' ? (
          <>
            <code className="iphone-auth__cmd">{AUTH_COMMAND}</code>
            <div className="iphone-auth__tags">
              <span className="iphone-auth__rule">static_rule</span>
              <span className="iphone-auth__risk">需确认</span>
            </div>
            <div className="iphone-auth__actions">
              <button type="button" className="iphone-auth__deny" onClick={onDeny} disabled={!pending}>
                拒绝
              </button>
              <button type="button" className="iphone-auth__allow" onClick={onAllow} disabled={!pending}>
                允许
              </button>
            </div>
          </>
        ) : null}

        {phase === 'approved' ? (
          <div className="iphone-auth__done">
            <span className="iphone-auth__safe">无害 · 已执行</span>
            <p>命令已在 Mac 与 iPhone 同步放行。</p>
          </div>
        ) : null}

        {phase === 'denied' ? (
          <div className="iphone-auth__done is-denied">
            <span className="iphone-auth__blocked">已拒绝</span>
            <p>命令未执行，智能体已停下等待新指示。</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
