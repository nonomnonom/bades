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
          title={t`Analitik Penggunaan`}
          description={t`Rincian penggunaan kredit untuk ruang kerja Anda.`}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={t`ClickHouse Belum Dikonfigurasi`}
            value={t`Analitik penggunaan memerlukan ClickHouse. Hubungi administrator Anda.`}
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
          title={t`Analitik Penggunaan`}
          description={t`Rincian penggunaan kredit untuk ruang kerja Anda.`}
        />
        <SubscriptionInfoContainer>
          <SettingsBillingLabelValueItem
            label={t`Belum ada data penggunaan`}
            value={t`Analitik penggunaan akan muncul di sini setelah Anda mulai menggunakan kredit.`}
          />
        </SubscriptionInfoContainer>
      </Section>
    );
  }

  return (
    <>
      <UsageBreakdownPieSection
        title={t`Penggunaan per Jenis`}
        breakdownField="operationType"
        sectionId="usage-type"
      />
      <UsageDailyChartSection
        title={t`Penggunaan Harian`}
        description={t`Konsumsi kredit dari waktu ke waktu.`}
        chartId="usage-daily"
        chartLabel={t`Credits`}
      />
      <UsageByUserTableSection
        title={t`Penggunaan per Pengguna`}
        description={t`Klik pengguna untuk melihat rincian harian mereka.`}
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
            title={t`Lihat rincian penggunaan AI`}
            variant="secondary"
          />
        </Link>
      </Section>
    </>
  );
};
