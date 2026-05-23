import { plural, t } from '~/utils/i18n/badesI18n';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { SettingsAdminWorkspacesByHealthAccordion } from '@/settings/admin-panel/health-status/components/SettingsAdminWorkspacesByHealthAccordion';
import { SettingsAdminWorkspacesStatusSummaryCard } from '@/settings/admin-panel/health-status/components/SettingsAdminWorkspacesStatusSummaryCard';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import {
  GetInstanceAndAllWorkspacesUpgradeStatusDocument,
  RefreshUpgradeStatusDocument,
} from '~/generated-admin/graphql';

const StyledRefreshButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${themeCssVariables.spacing[4]};
  margin-top: ${themeCssVariables.spacing[3]};
`;

const StyledAccordionCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

export const SettingsAdminWorkspacesStatus = () => {
  const apolloAdminClient = useApolloAdminClient();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const {
    data,
    refetch,
    loading: isLoadingUpgradeStatus,
  } = useQuery(GetInstanceAndAllWorkspacesUpgradeStatusDocument, {
    client: apolloAdminClient,
    fetchPolicy: 'network-only',
  });
  const [refreshUpgradeStatus, { loading: isRefreshingUpgradeStatus }] =
    useMutation(RefreshUpgradeStatusDocument, {
      client: apolloAdminClient,
    });

  const upgradeStatus = data?.getInstanceAndAllWorkspacesUpgradeStatus;
  const behindCount = upgradeStatus?.workspacesBehind.length ?? 0;
  const failedCount = upgradeStatus?.workspacesFailed.length ?? 0;

  const handleRefreshUpgradeStatus = async () => {
    try {
      await refreshUpgradeStatus();
      await refetch();
      enqueueSuccessSnackBar({
        message: t`Status pembaruan disegarkan`,
      });
    } catch (error) {
      enqueueErrorSnackBar({
        message:
          error instanceof Error
            ? error.message
            : t`Gagal menyegarkan status pembaruan`,
      });
    }
  };

  return (
    <SubMenuTopBarContainer
      links={[
        {
          children: t`Lainnya`,
          href: getSettingsPath(SettingsPath.AdminPanel),
        },
        {
          children: t`Panel Admin - Kesehatan`,
          href: getSettingsPath(SettingsPath.AdminPanelHealthStatus),
        },
        {
          children: t`Status ruang kerja`,
        },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Status ruang kerja`}
            description={t`Kesehatan pembaruan di semua ruang kerja`}
          />
          <SettingsAdminWorkspacesStatusSummaryCard
            behindCount={behindCount}
            failedCount={failedCount}
            computedAt={upgradeStatus?.computedAt}
          />
          <StyledRefreshButtonContainer>
            <Button
              variant="secondary"
              title={t`Segarkan status`}
              onClick={handleRefreshUpgradeStatus}
              disabled={isRefreshingUpgradeStatus || isLoadingUpgradeStatus}
            />
          </StyledRefreshButtonContainer>
        </Section>
        <Section>
          <H2Title
            title={t`Detail per ruang kerja`}
            description={t`Daftar ruang kerja berdasarkan status pembaruan`}
          />
          <StyledAccordionCardsContainer>
            <SettingsAdminWorkspacesByHealthAccordion
              filledLabel={plural(behindCount, {
                one: '# ruang kerja tertinggal',
                other: '# ruang kerja tertinggal',
              })}
              emptyLabel={t`Tidak ada ruang kerja tertinggal`}
              workspaces={upgradeStatus?.workspacesBehind ?? []}
              defaultExpanded={true}
            />
            <SettingsAdminWorkspacesByHealthAccordion
              filledLabel={plural(failedCount, {
                one: '# ruang kerja gagal',
                other: '# ruang kerja gagal',
              })}
              emptyLabel={t`Tidak ada ruang kerja gagal`}
              workspaces={upgradeStatus?.workspacesFailed ?? []}
            />
          </StyledAccordionCardsContainer>
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
