import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { useQuery } from '@apollo/client/react';
import {
  PermissionFlagType,
  BillingPortalSessionDocument,
} from '~/generated-metadata/graphql';

export const InformationBannerFailPaymentInfo = () => {
  const { redirect } = useRedirect();

  const { data, loading } = useQuery(BillingPortalSessionDocument, {
    variables: {
      returnUrlPath: getSettingsPath(SettingsPath.Billing),
    },
  });

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
      componentInstanceId="information-banner-fail-payment-info"
      color="danger"
      variant="secondary"
      message={
        hasPermissionToUpdateBillingDetails
          ? t`Pembayaran terakhir gagal. Perbarui informasi pembayaran Anda.`
          : t`Pembayaran terakhir gagal. Silakan hubungi admin Anda.`
      }
      buttonTitle={
        hasPermissionToUpdateBillingDetails ? t`Perbarui` : undefined
      }
      buttonOnClick={() => openBillingPortal()}
      isButtonDisabled={loading || !isDefined(data)}
    />
  );
};
