import { isClickHouseConfiguredState } from '@/client-config/states/isClickHouseConfiguredState';
import { SettingsBillingLabelValueItem } from '@/settings/billing/components/internal/SettingsBillingLabelValueItem';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { UsageBreakdownPieSection } from '@/settings/usage/components/UsageBreakdownPieSection';
import { UsageByUserTableSection } from '@/settings/usage/components/UsageByUserTableSection';
import { UsageDailyChartSection } from '@/settings/usage/components/UsageDailyChartSection';
import { UsageSectionSkeleton } from '@/settings/usage/components/UsageSectionSkeleton';
import { useUsageAnalyticsData } from '@/settings/usage/hooks/useUsageAnalyticsData';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { Link } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconSparkles } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { SETTINGS_AI_TABS } from '~/pages/settings/ai/constants/SettingsAiTabs';

export const SettingsUsageAnalyticsSection = () => {
  const isClickHouseConfigured = useAtomStateValue(isClickHouseConfiguredState);

  const { analytics, isInitialLoading } = useUsageAnalyticsData({
    skip: !isClickHouseConfigured,
  });

  if (!isClickHouseConfigured) {
    return (
      <Section>
        <H2Title
          title={""Usage Analytics"}
          description={""Credit usage breakdown for your workspace."}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={""ClickHouse Not Configured"}
            value={""Usage analytics requires ClickHouse. Contact your administrator."}
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
      analytics.usageByUser.length > 0);

  if (!hasData) {
    return (
      <Section>
        <H2Title
          title={""Usage Analytics"}
          description={""Credit usage breakdown for your workspace."}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={""No usage data yet"}
            value={""Usage analytics will appear here once you start using credits."}
          />
        </SubscriptionInfoContainer>
      </Section>
    );
  }

  return (
    <>
      <UsageBreakdownPieSection
        title={""Usage by Type"}
        breakdownField="operationType"
        sectionId="usage-type"
      />
      <UsageDailyChartSection
        title={""Daily Usage"}
        description={""Credit consumption over time."}
        chartId="usage-daily"
        chartLabel={"Kredit"}
      />
      <UsageByUserTableSection
        title={""Usage by User"}
        description={""Click a user to see their daily breakdown."}
        getDetailPath={(userWorkspaceId) =>
          getSettingsPath(SettingsPath.UsageUserDetail, {
            userWorkspaceId,
          })
        }
        showAvatar
      />
      <Section>
        <Link
          to={`${getSettingsPath(SettingsPath.AI)}#${SETTINGS_AI_TABS.TABS_IDS.USAGE}`}
          style={{ textDecoration: 'none' }}
        >
          <Button
            Icon={IconSparkles}
            title={""View AI usage breakdown"}
            variant="secondary"
          />
        </Link>
      </Section>
    </>
  );
};
