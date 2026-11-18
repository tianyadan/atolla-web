import JellyAvatar from '../jelly/JellyAvatar'

/** 治理示意：钟面边缘蓝光 = 等待人类批准 */
export default function GovernanceVisual() {
  return (
    <div className="gov-visual" aria-hidden="true">
      <div className="gov-visual__bell">
        <div className="gov-visual__rim">
          <span className="gov-visual__light" />
        </div>
        <JellyAvatar color="blue" size={112} state="waiting" />
      </div>
      <p className="gov-visual__caption">钟面边缘的蓝光 · 有操作等待你批准</p>
    </div>
  )
}
