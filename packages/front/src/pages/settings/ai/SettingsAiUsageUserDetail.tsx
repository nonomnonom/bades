import { SettingsBillingLabelValueItem } from '@/settings/billing/components/internal/SettingsBillingLabelValueItem';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { UsageBreakdownPieSection } from '@/settings/usage/components/UsageBreakdownPieSection';
import { UsageDailyChartSection } from '@/settings/usage/components/UsageDailyChartSection';
import { UsageSectionSkeleton } from '@/settings/usage/components/UsageSectionSkeleton';
import { AI_OPERATION_TYPES } from '@/settings/usage/constants/AiOperationTypes';
import { useUsageAnalyticsData } from '@/settings/usage/hooks/useUsageAnalyticsData';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { t } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Section } from 'ui/layout';

export const SettingsAiUsageUserDetail = () => {
  const { t: tLingui } = useLingui();
  const { userWorkspaceId } = useParams<{ userWorkspaceId: string }>();

  const { analytics, isInitialLoading } = useUsageAnalyticsData({
    operationTypes: AI_OPERATION_TYPES,
    userWorkspaceId,
    skip: !userWorkspaceId,
  });

  const userName = analytics?.usageByUser?.find(
    (item) => item.key === userWorkspaceId,
  )?.label;

  const displayName = userName ?? userWorkspaceId ?? '';

  const hasAnyData = analytics
    ? (analytics.userDailyUsage?.dailyUsage?.length ?? 0) > 0 ||
      analytics.usageByOperationType.length > 0
    : false;

  const breadcrumbLinks = [
    {
      children: Ruang kerja,
      href: getSettingsPath(SettingsPath.Workspace),
    },
    {
      children: "AI,
      href: getSettingsPath(SettingsPath.AI),
    },
    { children: isInitialLoading ? '' : displayName },
  ];

  if (isInitialLoading) {
    return (
      <SubMenuTopBarContainer
        title={tLingui`AI User Usage`}
        links={breadcrumbLinks}
      >
        <SettingsPageContainer>
          <UsageSectionSkeleton />
          <UsageSectionSkeleton />
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    );
  }

  return (
    <SubMenuTopBarContainer title={displayName} links={breadcrumbLinks}>
      <SettingsPageContainer>
        {!hasAnyData && (
          <Section>
            <SubscriptionInfoContainer>
              <SettingsBillingLabelValueItem
                label={""No usage data"}
                value={""No AI consumption recorded for this user."}
              />
            </SubscriptionInfoContainer>
          </Section>
        )}

        <UsageDailyChartSection
          title={""Daily AI Usage"}
          description={""Per-day AI consumption."}
          operationTypes={AI_OPERATION_TYPES}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          chartId="ai-user-daily"
          chartLabel={""AI Usage"}
        />
        <UsageBreakdownPieSection
          title={""AI Usage by Type"}
          operationTypes={AI_OPERATION_TYPES}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          breakdownField="operationType"
          sectionId="ai-user-type"
        />
        <UsageBreakdownPieSection
          title={""AI Usage by Model"}
          description={""Breakdown across AI models."}
          operationTypes={AI_OPERATION_TYPES}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          breakdownField="model"
          sectionId="ai-user-model"
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
