import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconId } from 'ui/display';
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

export const SettingsAdminInferredVersion = () => {
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

  const inferredVersion =
    data?.getInstanceAndAllWorkspacesUpgradeStatus.instanceUpgradeStatus
      .inferredVersion;

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
          children: t`Versi terdeteksi`,
        },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Versi terdeteksi`}
            description={t`Versi aplikasi yang terdeteksi berjalan pada instans ini`}
          />
          <SettingsTableCard
            items={[
              {
                Icon: IconId,
                label: t`Versi terdeteksi`,
                value: inferredVersion ?? t`Tidak diketahui`,
              },
            ]}
            gridAutoColumns="3fr 4fr"
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
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
