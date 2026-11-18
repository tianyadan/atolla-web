import IPhoneFrame from './phone/IPhoneFrame'
import IPhoneChatScreen from './phone/IPhoneChatScreen'

/** iPhone 应用与 Web 协同展示 */
export default function MobileCollabSection() {
  return (
    <div className="mobile-collab">
      <div className="mobile-collab__copy">
        <p className="mobile-collab__aside">
          在手机上跟进团队进展，与网页端同一套智能体与审批流协同工作。
        </p>
      </div>
      <IPhoneFrame className="mobile-collab__phone" label="Atolla iPhone 应用聊天界面">
        <IPhoneChatScreen />
      </IPhoneFrame>
    </div>
  )
}
