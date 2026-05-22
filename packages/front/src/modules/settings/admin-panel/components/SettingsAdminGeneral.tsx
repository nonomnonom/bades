import { canManageFeatureFlagsState } from '@/client-config/states/canManageFeatureFlagsState';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { SettingsAdminVersionContainer } from '@/settings/admin-panel/components/SettingsAdminVersionContainer';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { Table } from '@/ui/layout/table/components/Table';
import { TableBody } from '@/ui/layout/table/components/TableBody';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { useContext, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

import { currentUserState } from '@/auth/states/currentUserState';
import {
  Avatar,
  H2Title,
  IconChevronRight,
  OverflowingTextWithTooltip,
} from 'ui/display';
import { Section } from 'ui/layout';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import {
  AdminPanelRecentUsersDocument,
  AdminPanelTopWorkspacesDocument,
} from '~/generated-admin/graphql';

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  padding: ${themeCssVariables.spacing[4]} 0;
`;

const RECENT_USERS_GRID_TEMPLATE_COLUMNS = '1fr 2fr 1fr 36px';
const TOP_WORKSPACES_GRID_TEMPLATE_COLUMNS = '2fr 1fr 36px';

export const SettingsAdminGeneral = () => {
  const { theme } = useContext(ThemeContext);
  const apolloAdminClient = useApolloAdminClient();
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [debouncedUserSearchTerm] = useDebounce(userSearchTerm, 300);

  const [workspaceSearchTerm, setWorkspaceSearchTerm] = useState('');
  const [debouncedWorkspaceSearchTerm] = useDebounce(workspaceSearchTerm, 300);

  const currentUser = useAtomStateValue(currentUserState);
  const canAccessFullAdminPanel = currentUser?.canAccessFullAdminPanel;
  const canImpersonate = currentUser?.canImpersonate;
  const canManageFeatureFlags = useAtomStateValue(canManageFeatureFlagsState);

  const { data: recentUsersData, loading: isLoadingUsers } = useQuery(
    AdminPanelRecentUsersDocument,
    {
      client: apolloAdminClient,
      variables: { searchTerm: debouncedUserSearchTerm },
      skip: !canImpersonate,
    },
  );

  const { data: topWorkspacesData, loading: isLoadingWorkspaces } = useQuery(
    AdminPanelTopWorkspacesDocument,
    {
      client: apolloAdminClient,
      variables: { searchTerm: debouncedWorkspaceSearchTerm },
      skip: !canImpersonate,
    },
  );

  const recentUsers = recentUsersData?.adminPanelRecentUsers ?? [];
  const topWorkspaces = topWorkspacesData?.adminPanelTopWorkspaces ?? [];

  return (
    <>
      {canAccessFullAdminPanel && (
        <Section>
          <H2Title
            title={t`Tentang`}
            description={t`Versi aplikasi`}
          />
          <SettingsAdminVersionContainer />
        </Section>
      )}

      {canImpersonate && (
        <>
          <Section>
            <H2Title
              title={t`Pengguna Terbaru`}
              description={
                canManageFeatureFlags
                  ? t`10 pengguna terakhir yang dibuat. Klik untuk mengelola feature flag atau impersonasi.`
                  : t`10 pengguna terakhir yang dibuat. Klik untuk impersonasi.`
              }
            />
            <SettingsTextInput
              instanceId="admin-panel-user-search"
              value={userSearchTerm}
              onChange={setUserSearchTerm}
              placeholder={t`Cari berdasarkan nama, email, atau ID pengguna...`}
              fullWidth
            />
            {isLoadingUsers ? (
              <SettingsSectionSkeletonLoader />
            ) : recentUsers.length === 0 ? (
              <StyledEmptyState>
                {t`Tidak ada pengguna yang cocok dengan kriteria pencarian Anda.`}
              </StyledEmptyState>
            ) : (
              <Table>
                <TableBody>
                  <TableRow
                    gridTemplateColumns={RECENT_USERS_GRID_TEMPLATE_COLUMNS}
                  >
                    <TableHeader>{t`Nama`}</TableHeader>
                    <TableHeader>{t`Email`}</TableHeader>
                    <TableHeader>{t`Ruang Kerja`}</TableHeader>
                    <TableHeader />
                  </TableRow>
                  {recentUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      gridTemplateColumns={RECENT_USERS_GRID_TEMPLATE_COLUMNS}
                      to={getSettingsPath(SettingsPath.AdminPanelUserDetail, {
                        userId: user.id,
                      })}
                    >
                      <TableCell
                        color={themeCssVariables.font.color.primary}
                        gap={themeCssVariables.spacing[2]}
                        overflow="hidden"
                      >
                        <Avatar
                          avatarUrl={user.avatarUrl}
                          placeholder={
                            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                            user.email
                          }
                          placeholderColorSeed={user.id}
                          size="md"
                          type="rounded"
                        />
                        <OverflowingTextWithTooltip
                          text={
                            `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                            '\u2014'
                          }
                        />
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell
                        gap={themeCssVariables.spacing[2]}
                        overflow="hidden"
                      >
                        {user.workspaceId ? (
                          <>
                            <Avatar
                              avatarUrl={user.workspaceLogo}
                              placeholder={user.workspaceName || ''}
                              placeholderColorSeed={user.workspaceId}
                              size="sm"
                            />
                            <OverflowingTextWithTooltip
                              text={user.workspaceName || '\u2014'}
                            />
                          </>
                        ) : (
                          '\u2014'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconChevronRight
                          size={theme.icon.size.md}
                          stroke={theme.icon.stroke.sm}
                          color={theme.font.color.tertiary}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Section>

          <Section>
            <H2Title
              title={t`Ruang Kerja Teratas`}
              description={t`10 ruang kerja teratas berdasarkan jumlah pengguna`}
            />
            <SettingsTextInput
              instanceId="admin-panel-workspace-search"
              value={workspaceSearchTerm}
              onChange={setWorkspaceSearchTerm}
              placeholder={t`Cari berdasarkan nama, subdomain, atau ID ruang kerja...`}
              fullWidth
            />
            {isLoadingWorkspaces ? (
              <SettingsSectionSkeletonLoader />
            ) : topWorkspaces.length === 0 ? (
              <StyledEmptyState>
                {t`Tidak ada ruang kerja yang cocok dengan kriteria pencarian Anda.`}
              </StyledEmptyState>
            ) : (
              <Table>
                <TableBody>
                  <TableRow
                    gridTemplateColumns={TOP_WORKSPACES_GRID_TEMPLATE_COLUMNS}
                  >
                    <TableHeader>{t`Ruang Kerja`}</TableHeader>
                    <TableHeader align="right">{t`Pengguna`}</TableHeader>
                    <TableHeader />
                  </TableRow>
                  {topWorkspaces.map((workspace) => (
                    <TableRow
                      key={workspace.id}
                      gridTemplateColumns={TOP_WORKSPACES_GRID_TEMPLATE_COLUMNS}
                      to={getSettingsPath(
                        SettingsPath.AdminPanelWorkspaceDetail,
                        { workspaceId: workspace.id },
                      )}
                    >
                      <TableCell
                        color={themeCssVariables.font.color.primary}
                        gap={themeCssVariables.spacing[2]}
                        overflow="hidden"
                      >
                        <Avatar
                          avatarUrl={workspace.logoUrl}
                          placeholder={workspace.name || ''}
                          placeholderColorSeed={workspace.id}
                          size="md"
                        />
                        <OverflowingTextWithTooltip
                          text={workspace.name || '\u2014'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {workspace.totalUsers}
                      </TableCell>
                      <TableCell align="center">
                        <IconChevronRight
                          size={theme.icon.size.md}
                          stroke={theme.icon.stroke.sm}
                          color={theme.font.color.tertiary}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Section>
        </>
      )}
    </>
  );
};
