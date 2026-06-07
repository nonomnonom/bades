import { type WorkspaceInfo } from '@/settings/admin-panel/types/WorkspaceInfo';
import { getUpgradeHealthStatusBadge } from '@/settings/admin-panel/utils/getUpgradeHealthStatusBadge';
import { getWorkspaceSchemaName } from '@/settings/admin-panel/utils/getWorkspaceSchemaName';
import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { DEFAULT_WORKSPACE_LOGO } from '@/ui/navigation/navigation-drawer/constants/DefaultWorkspaceLogo';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { UserContext } from '@/users/contexts/UserContext';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { useContext } from 'react';
import { SettingsPath } from 'shared/types';
import {
  formatUpgradeCommandName,
  getImageAbsoluteURI,
  getSettingsPath,
  isDefined,
} from 'shared/utils';
import { type GetUpgradeStatusQuery } from '~/generated-admin/graphql';
import { AvatarOrIcon, LinkChip } from 'ui/components';
import {
  H2Title,
  IconCalendar,
  IconHome,
  IconId,
  IconLink,
  IconStatusChange,
  IconUser,
  OverflowingTextWithTooltip,
  Status,
} from 'ui/display';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { dateLocaleState } from '~/localization/states/dateLocaleState';
import { formatDateTimeString } from '~/utils/string/formatDateTimeString';

type SettingsAdminWorkspaceContentProps = {
  activeWorkspace: WorkspaceInfo | undefined;
  workspaceUpgradeStatus?: GetUpgradeStatusQuery['getUpgradeStatus'][number];
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  margin-top: ${themeCssVariables.spacing[6]};
`;

export const SettingsAdminWorkspaceContent = ({
  activeWorkspace,
  workspaceUpgradeStatus,
}: SettingsAdminWorkspaceContentProps) => {
  const { dateFormat, timeFormat, timeZone } = useContext(UserContext);
  const { localeCatalog } = useAtomStateValue(dateLocaleState);

  const formattedLastUpdated = formatDateTimeString({
    value: workspaceUpgradeStatus?.latestCommand?.createdAt,
    timeZone,
    dateFormat,
    timeFormat,
    localeCatalog: localeCatalog,
  });

  const getWorkspaceUrl = (workspaceUrls: WorkspaceInfo['workspaceUrls']) => {
    return workspaceUrls.customUrl ?? workspaceUrls.subdomainUrl;
  };

  const upgradeHealthStatusBadge = getUpgradeHealthStatusBadge(
    workspaceUpgradeStatus?.health,
  );

  const workspaceInfoItems = [
    {
      Icon: IconHome,
      label: `Nama`,
      value: activeWorkspace?.id ? (
        <LinkChip
          label={activeWorkspace?.name ?? ''}
          emptyLabel="Tanpa judul"
          to={getSettingsPath(SettingsPath.AdminPanelWorkspaceDetail, {
            workspaceId: activeWorkspace.id,
          })}
          leftComponent={
            <AvatarOrIcon
              avatarUrl={
                getImageAbsoluteURI({
                  imageUrl: isNonEmptyString(activeWorkspace?.logo)
                    ? activeWorkspace?.logo
                    : DEFAULT_WORKSPACE_LOGO,
                  baseUrl: REACT_APP_SERVER_BASE_URL,
                }) ?? ''
              }
            />
          }
        />
      ) : (
        (activeWorkspace?.name ?? '')
      ),
    },
    {
      Icon: IconId,
      label: `ID`,
      value: activeWorkspace?.id,
    },
    {
      Icon: IconId,
      label: `Nama skema`,
      value: isDefined(activeWorkspace?.id)
        ? getWorkspaceSchemaName(activeWorkspace.id)
        : '',
    },
    {
      Icon: IconLink,
      label: `URL`,
      value: activeWorkspace?.workspaceUrls
        ? getWorkspaceUrl(activeWorkspace.workspaceUrls)
        : '',
    },
    {
      Icon: IconUser,
      label: `Anggota`,
      value: activeWorkspace?.totalUsers,
    },
    {
      Icon: IconStatusChange,
      label: `Status`,
      value: activeWorkspace?.activationStatus,
    },
    {
      Icon: IconCalendar,
      label: `Dibuat`,
      value: activeWorkspace?.createdAt
        ? new Date(activeWorkspace.createdAt).toLocaleDateString()
        : '',
    },
  ];

  if (!activeWorkspace) return null;

  return (
    <StyledContainer>
      <Section>
        <H2Title
          title={`Info Ruang Kerja`}
          description={`Tentang ruang kerja ini`}
        />
        <SettingsTableCard
          items={workspaceInfoItems}
          gridAutoColumns="1fr 4fr"
        />
      </Section>
      {workspaceUpgradeStatus && (
        <Section>
          <H2Title
            title={`Status Pembaruan`}
            description={`Kesehatan pembaruan ruang kerja`}
          />
          <SettingsTableCard
            items={[
              {
                Icon: IconStatusChange,
                label: `Status`,
                value: (
                  <Status
                    color={upgradeHealthStatusBadge.color}
                    text={upgradeHealthStatusBadge.label}
                    weight="medium"
                  />
                ),
              },
              {
                Icon: IconId,
                label: `Versi terdeteksi`,
                value:
                  workspaceUpgradeStatus.inferredVersion ?? `Tidak diketahui`,
              },
              {
                Icon: IconCalendar,
                label: `Perintah terakhir`,
                value: (
                  <OverflowingTextWithTooltip
                    text={
                      workspaceUpgradeStatus.latestCommand?.name
                        ? formatUpgradeCommandName(
                            workspaceUpgradeStatus.latestCommand.name,
                          )
                        : `Tidak ada`
                    }
                  />
                ),
              },
              {
                Icon: IconCalendar,
                label: `Terakhir diperbarui`,
                value: isNonEmptyString(formattedLastUpdated)
                  ? formattedLastUpdated
                  : `T/A`,
              },
              {
                Icon: IconStatusChange,
                label: `Hasil perintah terakhir`,
                value: workspaceUpgradeStatus.latestCommand?.status
                  ? workspaceUpgradeStatus.latestCommand.status === 'completed'
                    ? `Selesai`
                    : `Gagal`
                  : `T/A`,
              },
              ...(workspaceUpgradeStatus.latestCommand?.errorMessage
                ? [
                    {
                      Icon: IconStatusChange,
                      label: `Error terakhir`,
                      value: (
                        <OverflowingTextWithTooltip
                          text={
                            workspaceUpgradeStatus.latestCommand.errorMessage
                          }
                          isTooltipMultiline
                        />
                      ),
                    },
                  ]
                : []),
            ]}
            gridAutoColumns="2fr 3fr"
          />
        </Section>
      )}
    </StyledContainer>
  );
};
