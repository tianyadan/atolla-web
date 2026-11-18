import { useI18n } from '../../i18n/I18nProvider'
import MacBookFrame from '../mac/MacBookFrame'
import MacAppScreen from '../mac/MacAppScreen'
import IPhoneFrame from '../phone/IPhoneFrame'
import IPhoneChatScreen from '../phone/IPhoneChatScreen'
import ContinuityStage from './ContinuityStage'

/** 多端协作展示：MacBook + 叠放的 iPhone */
export default function MultiDeviceSection() {
  const { t } = useI18n()
  return (
    <ContinuityStage
      className="multi-device"
      mac={
        <MacBookFrame label={t('mac.label')}>
          <MacAppScreen />
        </MacBookFrame>
      }
      phone={
        <IPhoneFrame label={t('phone.label')} className="multi-device__phone">
          <IPhoneChatScreen />
        </IPhoneFrame>
      }
    />
  )
}
