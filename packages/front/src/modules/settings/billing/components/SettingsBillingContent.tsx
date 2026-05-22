import { useLingui } from '~/utils/i18n/badesI18n';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useRedirect } from '@/domain-manager/hooks/useRedirect';
import { SettingsBillingCreditsSection } from '@/settings/billing/components/SettingsBillingCreditsSection';
import { SettingsBillingSubscriptionInfo } from '@/settings/billing/components/SettingsBillingSubscriptionInfo';
import { useGetResourceCreditUsage } from '@/settings/billing/hooks/useGetResourceCreditUsage';
import { useMidtransPaymentResult } from '@/settings/billing/hooks/useMidtransPaymentResult';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSubscriptionStatus } from '@/workspace/hooks/useSubscriptionStatus';
import { useQuery } from '@apollo/client/react';
import { isDefined } from 'shared/utils';
import { H2Title, IconCircleX, IconCreditCard } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import {
  BillingPortalSessionDocument,
  SubscriptionStatus,
} from '~/generated-metadata/graphql';
export const SettingsBillingContent = () => {
  const { t } = useLingui();

  const { redirect } = useRedirect();

  useMidtransPaymentResult();

  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const subscriptions = currentWorkspace?.billingSubscriptions;

  const hasSubscriptions = (subscriptions?.length ?? 0) > 0;

  const subscriptionStatus = useSubscriptionStatus();

  const { isGetResourceCreditUsageQueryLoaded: isUsageQueryLoaded } =
    useGetResourceCreditUsage();

  const hasNotCanceledCurrentSubscription =
    isDefined(subscriptionStatus) &&
    subscriptionStatus !== SubscriptionStatus.Canceled;

  const { data, loading } = useQuery(BillingPortalSessionDocument, {
    variables: {
      returnUrlPath: '/settings/billing',
    },
    skip: !hasSubscriptions,
  });

  const billingPortalButtonDisabled =
    loading || !isDefined(data) || !isDefined(data.billingPortalSession.url);

  const openBillingPortal = () => {
    if (isDefined(data) && isDefined(data.billingPortalSession.url)) {
      redirect(data.billingPortalSession.url);
    }
  };

  return (
    <SettingsPageContainer>
      {hasNotCanceledCurrentSubscription &&
        currentWorkspace &&
        currentWorkspace.currentBillingSubscription && (
          <SettingsBillingSubscriptionInfo
            currentWorkspace={currentWorkspace}
            currentBillingSubscription={
              currentWorkspace.currentBillingSubscription
            }
          />
        )}
      {hasNotCanceledCurrentSubscription &&
        currentWorkspace &&
        currentWorkspace.currentBillingSubscription &&
        isUsageQueryLoaded && (
          <SettingsBillingCreditsSection
            currentBillingSubscription={
              currentWorkspace.currentBillingSubscription
            }
          />
        )}
      <Section>
        <H2Title
          title={t`Kelola informasi pembayaran`}
          description={t`Ubah metode pembayaran, lihat riwayat tagihan, dan lainnya`}
        />
        <Button
          Icon={IconCreditCard}
          title={t`Lihat detail tagihan`}
          variant="secondary"
          onClick={openBillingPortal}
          disabled={billingPortalButtonDisabled}
        />
      </Section>
      {hasNotCanceledCurrentSubscription && (
        <Section>
          <H2Title
            title={t`Batalkan langganan`}
            description={t`Ruang kerja Anda akan dinonaktifkan`}
          />
          <Button
            Icon={IconCircleX}
            title={t`Batalkan langganan`}
            variant="secondary"
            accent="danger"
            onClick={openBillingPortal}
            disabled={billingPortalButtonDisabled}
          />
        </Section>
      )}
    </SettingsPageContainer>
  );
};
