import { t, Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsBillingLabelValueItem } from '@/settings/billing/components/internal/SettingsBillingLabelValueItem';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { UsageBreakdownPieSection } from '@/settings/usage/components/UsageBreakdownPieSection';
import { UsageDailyChartSection } from '@/settings/usage/components/UsageDailyChartSection';
import { UsageSectionSkeleton } from '@/settings/usage/components/UsageSectionSkeleton';
import { AI_OPERATION_TYPES } from '@/settings/usage/constants/AiOperationTypes';
import { useUsageAnalyticsData } from '@/settings/usage/hooks/useUsageAnalyticsData';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
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
      children: <Trans>Ruang Kerja</Trans>,
      href: getSettingsPath(SettingsPath.Workspace),
    },
    {
      children: <Trans>AI</Trans>,
      href: getSettingsPath(SettingsPath.AI),
    },
    { children: isInitialLoading ? '' : displayName },
  ];

  if (isInitialLoading) {
    return (
      <SubMenuTopBarContainer
        title={tLingui`Pemakaian AI Pengguna`}
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
                label={t`Belum ada data pemakaian`}
                value={t`Tidak ada pemakaian AI tercatat untuk pengguna ini.`}
              />
            </SubscriptionInfoContainer>
          </Section>
        )}

        <UsageDailyChartSection
          title={t`Pemakaian AI Harian`}
          description={t`Konsumsi AI per hari.`}
          operationTypes={AI_OPERATION_TYPES}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          chartId="ai-user-daily"
          chartLabel={t`Pemakaian AI`}
        />
        <UsageBreakdownPieSection
          title={t`Pemakaian AI per Jenis`}
          operationTypes={AI_OPERATION_TYPES}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          breakdownField="operationType"
          sectionId="ai-user-type"
        />
        <UsageBreakdownPieSection
          title={t`Pemakaian AI per Model`}
          description={t`Rincian lintas model AI.`}
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
