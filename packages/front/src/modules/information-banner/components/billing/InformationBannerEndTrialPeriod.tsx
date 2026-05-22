import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { useEndSubscriptionTrialPeriod } from '@/settings/billing/hooks/useEndSubscriptionTrialPeriod';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { useLingui } from '@lingui/react/macro';
import { PermissionFlagType } from '~/generated-metadata/graphql';

export const InformationBannerEndTrialPeriod = () => {
  const { endTrialPeriod, isLoading } = useEndSubscriptionTrialPeriod();
  const { t } = useLingui();

  const { [PermissionFlagType.WORKSPACE]: hasPermissionToEndTrialPeriod } =
    usePermissionFlagMap();

  return (
    <InformationBanner
      componentInstanceId="information-banner-end-trial-period"
      color="danger"
      variant="secondary"
      message={
        hasPermissionToEndTrialPeriod
          ? t`Akhiri masa uji coba untuk terus memakai fitur alur kerja atau AI.`
          : t`Hubungi admin Anda untuk terus memakai fitur alur kerja atau AI.`
      }
      buttonTitle={
        hasPermissionToEndTrialPeriod ? t`Akhiri masa uji coba` : undefined
      }
      buttonOnClick={async () => await endTrialPeriod()}
      isButtonDisabled={isLoading}
    />
  );
};
