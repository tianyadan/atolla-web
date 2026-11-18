import MacBookFrame from '../mac/MacBookFrame'
import MacAppScreen from '../mac/MacAppScreen'
import IPhoneFrame from '../phone/IPhoneFrame'
import IPhoneChatScreen from '../phone/IPhoneChatScreen'
import ContinuityStage from './ContinuityStage'

/** 多端协作展示：MacBook + 叠放的 iPhone */
export default function MultiDeviceSection() {
  return (
    <ContinuityStage
      className="multi-device"
      mac={
        <MacBookFrame label="Atolla macOS 桌面应用">
          <MacAppScreen />
        </MacBookFrame>
      }
      phone={
        <IPhoneFrame label="Atolla iPhone 应用" className="multi-device__phone">
          <IPhoneChatScreen />
        </IPhoneFrame>
      }
    />
  )
}
