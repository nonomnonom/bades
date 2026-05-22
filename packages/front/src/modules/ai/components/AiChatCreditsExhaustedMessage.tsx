import { AiChatBanner } from '@/ai/components/AiChatBanner';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { IconSparkles } from 'ui/display';
import {
  PermissionFlagType,
  SubscriptionStatus,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const AiChatCreditsExhaustedMessage = () => {
  const navigateSettings = useNavigateSettings();
  const subscriptionStatus = useSubscriptionStatus();

  const isTrialing = subscriptionStatus === SubscriptionStatus.Trialing;

  const { [PermissionFlagType.WORKSPACE]: hasPermissionToManageBilling } =
    usePermissionFlagMap();

  const handleUpgradeClick = () => {
    navigateSettings(SettingsPath.Billing);
  };

  const message = hasPermissionToManageBilling
    ? isTrialing
      ? t`Kredit uji coba gratis habis. Berlangganan sekarang untuk terus menggunakan fitur AI.`
      : t`Kredit habis. Tingkatkan paket Anda untuk mendapatkan lebih banyak kredit.`
    : t`Kredit habis. Hubungi administrator ruang kerja Anda untuk meningkatkan paket.`;

  const buttonTitle = isTrialing ? t`Berlangganan Sekarang` : t`Tingkatkan Paket`;

  return (
    <AiChatBanner
      message={message}
      variant="warning"
      buttonTitle={hasPermissionToManageBilling ? buttonTitle : undefined}
      buttonIcon={IconSparkles}
      buttonOnClick={
        hasPermissionToManageBilling ? handleUpgradeClick : undefined
      }
    />
  );
};
