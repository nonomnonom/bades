import { t, Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsBillingLabelValueItem } from '@/settings/billing/components/internal/SettingsBillingLabelValueItem';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { UsageBreakdownPieSection } from '@/settings/usage/components/UsageBreakdownPieSection';
import { UsageDailyChartSection } from '@/settings/usage/components/UsageDailyChartSection';
import { UsageSectionSkeleton } from '@/settings/usage/components/UsageSectionSkeleton';
import { useUsageAnalyticsData } from '@/settings/usage/hooks/useUsageAnalyticsData';
import { useUsageValueFormatter } from '@/settings/usage/hooks/useUsageValueFormatter';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Avatar } from 'ui/display';
import { Section } from 'ui/layout';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';

const StyledUserHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-bottom: ${themeCssVariables.spacing[4]};
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserName = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledUserCredits = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

export const SettingsUsageUserDetail = () => {
  const { t: tLingui } = useLingui();
  const { userWorkspaceId } = useParams<{ userWorkspaceId: string }>();
  const { theme } = useContext(ThemeContext);
  const { formatUsageValue } = useUsageValueFormatter();

  const { analytics, isInitialLoading } = useUsageAnalyticsData({
    userWorkspaceId,
    skip: !userWorkspaceId,
  });

  const userName = analytics?.usageByUser?.find(
    (item) => item.key === userWorkspaceId,
  )?.label;

  const totalCredits = analytics
    ? analytics.usageByOperationType.reduce(
        (sum, item) => sum + item.creditsUsed,
        0,
      )
    : 0;

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
      children: <Trans>Tagihan</Trans>,
      href: getSettingsPath(SettingsPath.Billing),
    },
    {
      children: <Trans>Pemakaian</Trans>,
      href: getSettingsPath(SettingsPath.Usage),
    },
    { children: isInitialLoading ? '' : displayName },
  ];

  if (isInitialLoading) {
    return (
      <SubMenuTopBarContainer
        title={tLingui`Pemakaian Pengguna`}
        links={breadcrumbLinks}
      >
        <SettingsPageContainer>
          <SkeletonTheme
            baseColor={theme.background.tertiary}
            highlightColor={theme.background.transparent.lighter}
            borderRadius={4}
          >
            <StyledUserHeader>
              <Skeleton width={40} height={40} borderRadius={8} />
              <StyledUserInfo>
                <Skeleton width={160} height={16} />
                <Skeleton width={100} height={13} />
              </StyledUserInfo>
            </StyledUserHeader>
            <UsageSectionSkeleton />
            <UsageSectionSkeleton />
          </SkeletonTheme>
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    );
  }

  return (
    <SubMenuTopBarContainer
      title={tLingui`Pemakaian Pengguna`}
      links={breadcrumbLinks}
    >
      <SettingsPageContainer>
        <StyledUserHeader>
          <Avatar
            type="rounded"
            size="xl"
            placeholder={displayName}
            placeholderColorSeed={userWorkspaceId}
          />
          <StyledUserInfo>
            <StyledUserName>{displayName}</StyledUserName>
            <StyledUserCredits>
              {t`${formatUsageValue(totalCredits)} digunakan`}
            </StyledUserCredits>
          </StyledUserInfo>
        </StyledUserHeader>

        {!hasAnyData && (
          <Section>
            <SubscriptionInfoContainer>
              <SettingsBillingLabelValueItem
                label={t`Belum ada data pemakaian`}
                value={t`Tidak ada konsumsi kredit tercatat untuk pengguna ini.`}
              />
            </SubscriptionInfoContainer>
          </Section>
        )}

        <UsageDailyChartSection
          title={t`Pemakaian Harian`}
          description={t`Konsumsi kredit per hari.`}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          chartId="user-daily"
          chartLabel={t`Kredit`}
        />
        <UsageBreakdownPieSection
          title={t`Pemakaian per Jenis`}
          userWorkspaceId={userWorkspaceId}
          skip={!userWorkspaceId}
          breakdownField="operationType"
          sectionId="user-type"
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
