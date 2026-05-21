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
          title={""AI Usage"}
          description={""Track AI consumption across your workspace."}
          adornment={
            <Tag
              text={""Enterprise"}
              color="transparent"
              Icon={IconLock}
              variant="border"
            />
          }
        />
        <SettingsEnterpriseFeatureGateCard
          title={""Enterprise feature"}
          description={""AI usage analytics is available with an Enterprise key."}
          buttonTitle={"Aktifkan"}
        />
      </Section>
    );
  }

  if (!isClickHouseConfigured) {
    return (
      <Section>
        <H2Title
          title={""AI Usage"}
          description={""Track AI consumption across your workspace."}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={""ClickHouse Not Configured"}
            value={""AI usage analytics requires ClickHouse. Contact your administrator."}
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
          title={""AI Usage"}
          description={""Track AI consumption across your workspace."}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={""No usage data yet"}
            value={""AI usage analytics will appear here once you start using AI features."}
          />
        </SubscriptionInfoContainer>
      </Section>
    );
  }

  return (
    <>
      <UsageDailyChartSection
        title={""Daily AI Usage"}
        description={""AI consumption over time."}
        operationTypes={AI_OPERATION_TYPES}
        chartId="ai-usage-daily"
        chartLabel={""AI Usage"}
      />
      <UsageBreakdownPieSection
        title={""AI Usage by Type"}
        operationTypes={AI_OPERATION_TYPES}
        breakdownField="operationType"
        sectionId="ai-usage-type"
      />
      <UsageBreakdownPieSection
        title={""AI Usage by Model"}
        description={""Breakdown across AI models."}
        operationTypes={AI_OPERATION_TYPES}
        breakdownField="model"
        sectionId="ai-usage-model"
      />
      <UsageByUserTableSection
        title={""AI Usage by User"}
        description={""Click a user to see their daily breakdown."}
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
