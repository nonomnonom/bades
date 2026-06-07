import { useSnackBarOnQueryError } from '@/apollo/hooks/useSnackBarOnQueryError';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { useQuery } from '@apollo/client/react';
import {
  PermissionFlagType,
  BillingPortalSessionDocument,
} from '~/generated-metadata/graphql';

export const InformationBannerBillingSubscriptionPaused = () => {
  const { redirect } = useRedirect();

  const { data, loading, error } = useQuery(BillingPortalSessionDocument, {
    variables: {
      returnUrlPath: getSettingsPath(SettingsPath.Billing),
    },
  });

  useSnackBarOnQueryError(error);

  const {
    [PermissionFlagType.WORKSPACE]: hasPermissionToUpdateBillingDetails,
  } = usePermissionFlagMap();

  const openBillingPortal = () => {
    if (isDefined(data) && isDefined(data.billingPortalSession.url)) {
      redirect(data.billingPortalSession.url);
    }
  };

  return (
    <InformationBanner
      componentInstanceId="information-banner-billing-subscription-paused"
      color="danger"
      variant="secondary"
      message={
        hasPermissionToUpdateBillingDetails
          ? `Masa uji coba berakhir. Perbarui informasi pembayaran Anda.`
          : `Masa uji coba berakhir. Silakan hubungi admin Anda.`
      }
      buttonTitle={hasPermissionToUpdateBillingDetails ? `Perbarui` : undefined}
      buttonOnClick={() => openBillingPortal()}
      isButtonDisabled={loading || !isDefined(data)}
    />
  );
};
