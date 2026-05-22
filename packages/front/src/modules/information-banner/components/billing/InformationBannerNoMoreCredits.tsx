import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { PermissionFlagType } from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const InformationBannerNoMoreCredits = () => {
  const { t } = useLingui();

  const { [PermissionFlagType.WORKSPACE]: hasPermissionToUpdateCreditPlan } =
    usePermissionFlagMap();

  const navigateSettings = useNavigateSettings();

  return (
    <InformationBanner
      componentInstanceId="information-banner-no-more-credits"
      color="danger"
      variant="secondary"
      message={
        hasPermissionToUpdateCreditPlan
          ? t`Batas kredit tercapai. Perbarui paket kredit agar alur kerja dan AI tetap berjalan.`
          : t`Batas kredit tercapai. Hubungi admin Anda untuk melanjutkan alur kerja dan AI.`
      }
      buttonTitle={
        hasPermissionToUpdateCreditPlan ? t`Perbarui paket` : undefined
      }
      buttonOnClick={async () => navigateSettings(SettingsPath.Billing)}
    />
  );
};
