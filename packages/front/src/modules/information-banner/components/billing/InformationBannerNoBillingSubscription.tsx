import { BILLING_CHECKOUT_SESSION_DEFAULT_VALUE } from '@/settings/billing/constants/BillingCheckoutSessionDefaultValue';
import { useHandleCheckoutSession } from '@/settings/billing/hooks/useHandleCheckoutSession';
import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { usePermissionFlagMap } from '@/settings/roles/hooks/usePermissionFlagMap';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { PermissionFlagType } from '~/generated-metadata/graphql';

export const InformationBannerNoBillingSubscription = () => {
  const { handleCheckoutSession, isSubmitting } = useHandleCheckoutSession({
    recurringInterval: BILLING_CHECKOUT_SESSION_DEFAULT_VALUE.interval,
    plan: BILLING_CHECKOUT_SESSION_DEFAULT_VALUE.plan,
    requirePaymentMethod: true,
    successUrlPath: getSettingsPath(SettingsPath.Billing),
  });

  const { [PermissionFlagType.WORKSPACE]: hasPermissionToSubscribe } =
    usePermissionFlagMap();

  return (
    <InformationBanner
      componentInstanceId="information-banner-no-billing-subscription"
      color="danger"
      variant="secondary"
      message={
        hasPermissionToSubscribe
          ? t`Ruang kerja Anda belum memiliki langganan aktif.`
          : t`Ruang kerja Anda belum memiliki langganan aktif. Silakan hubungi admin Anda.`
      }
      buttonTitle={hasPermissionToSubscribe ? t`Mulai langganan` : undefined}
      buttonOnClick={() => handleCheckoutSession()}
      isButtonDisabled={isSubmitting}
    />
  );
};
