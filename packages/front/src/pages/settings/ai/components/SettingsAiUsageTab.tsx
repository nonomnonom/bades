import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { billingState } from '@/client-config/states/billingState';
import { isClickHouseConfiguredState } from '@/client-config/states/isClickHouseConfiguredState';
import { SettingsBillingLabelValueItem } from '@/settings/billing/components/internal/SettingsBillingLabelValueItem';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { SettingsEnterpriseFeatureGateCard } from '@/settings/components/SettingsEnterpriseFeatureGateCard';
import { UsageBreakdownPieSection } from '@/settings/usage/components/UsageBreakdownPieSection';
import { UsageByUserTableSection } from '@/settings/usage/components/UsageByUserTableSection';
import { UsageDailyChartSection } from '@/settings/usage/components/UsageDailyChartSection';
import { UsageSectionSkeleton } from '@/settings/usage/components/UsageSectionSkeleton';
import { AI_OPERATION_TYPES } from '@/settings/usage/constants/AiOperationTypes';
import { useUsageAnalyticsData } from '@/settings/usage/hooks/useUsageAnalyticsData';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Tag } from 'ui/components';
import { H2Title, IconLock } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsAiUsageTab = () => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const billing = useAtomStateValue(billingState);
  const isBillingEnabled = billing?.isBillingEnabled ?? false;
  const isClickHouseConfigured = useAtomStateValue(isClickHouseConfiguredState);

  const hasEnterpriseAccess =
    isBillingEnabled ||
    currentWorkspace?.hasValidEnterpriseValidityToken === true;

  const shouldSkipQuery = !hasEnterpriseAccess || !isClickHouseConfigured;

  const { analytics, isInitialLoading } = useUsageAnalyticsData({
    operationTypes: AI_OPERATION_TYPES,
    skip: shouldSkipQuery,
  });

  if (!hasEnterpriseAccess) {
    return (
      <Section>
        <H2Title
          title={t`Pemakaian AI`}
          description={t`Pantau konsumsi AI di seluruh ruang kerja Anda.`}
          adornment={
            <Tag
              text={t`Fitur lanjutan`}
              color="transparent"
              Icon={IconLock}
              variant="border"
            />
          }
        />
        <SettingsEnterpriseFeatureGateCard
          title={t`Fitur lanjutan`}
          description={t`Analitik pemakaian AI tersedia dengan kunci lanjutan.`}
          buttonTitle={t`Aktifkan`}
        />
      </Section>
    );
  }

  if (!isClickHouseConfigured) {
    return (
      <Section>
        <H2Title
          title={t`Pemakaian AI`}
          description={t`Pantau konsumsi AI di seluruh ruang kerja Anda.`}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={t`ClickHouse belum dikonfigurasi`}
            value={t`Analitik pemakaian AI memerlukan ClickHouse. Hubungi administrator Anda.`}
          />
        </SubscriptionInfoContainer>
      </Section>
    );
  }

  if (isInitialLoading) {
    return <UsageSectionSkeleton />;
  }

  const hasData =
    analytics &&
    (analytics.timeSeries.length > 0 ||
      analytics.usageByOperationType.length > 0 ||
      analytics.usageByModel.length > 0 ||
      analytics.usageByUser.length > 0);

  if (!hasData) {
    return (
      <Section>
        <H2Title
          title={t`Pemakaian AI`}
          description={t`Pantau konsumsi AI di seluruh ruang kerja Anda.`}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={t`Belum ada data pemakaian`}
            value={t`Analitik pemakaian AI akan muncul di sini setelah Anda mulai menggunakan fitur AI.`}
          />
        </SubscriptionInfoContainer>
      </Section>
    );
  }

  return (
    <>
      <UsageDailyChartSection
        title={t`Pemakaian AI Harian`}
        description={t`Konsumsi AI dari waktu ke waktu.`}
        operationTypes={AI_OPERATION_TYPES}
        chartId="ai-usage-daily"
        chartLabel={t`Pemakaian AI`}
      />
      <UsageBreakdownPieSection
        title={t`Pemakaian AI per Jenis`}
        operationTypes={AI_OPERATION_TYPES}
        breakdownField="operationType"
        sectionId="ai-usage-type"
      />
      <UsageBreakdownPieSection
        title={t`Pemakaian AI per Model`}
        description={t`Rincian lintas model AI.`}
        operationTypes={AI_OPERATION_TYPES}
        breakdownField="model"
        sectionId="ai-usage-model"
      />
      <UsageByUserTableSection
        title={t`Pemakaian AI per Pengguna`}
        description={t`Klik pengguna untuk melihat rincian hariannya.`}
        operationTypes={AI_OPERATION_TYPES}
        getDetailPath={(userWorkspaceId) =>
          getSettingsPath(SettingsPath.AiUsageUserDetail, {
            userWorkspaceId,
          })
        }
      />
    </>
  );
};
