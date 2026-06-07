import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { SettingsPath } from 'shared/types';
import { PermissionFlagType } from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const InformationBannerNoMoreCredits = () => {
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
          ? `Batas kredit tercapai. Perbarui paket kredit agar alur kerja dan AI tetap berjalan.`
          : `Batas kredit tercapai. Hubungi admin Anda untuk melanjutkan alur kerja dan AI.`
      }
      buttonTitle={
        hasPermissionToUpdateCreditPlan ? `Perbarui paket` : undefined
      }
      buttonOnClick={async () => navigateSettings(SettingsPath.Billing)}
    />
  );
};
