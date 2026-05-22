import { useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';

import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import {
  H2Title,
  IconChevronRight,
  IconPlus,
  IconUser,
  IconUsers,
  Info,
  Status,
} from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { MenuItem } from 'ui/navigation';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { useFindApplicationConnectionProviders } from '~/pages/settings/applications/hooks/useFindApplicationConnectionProviders';
import { useMyAppConnectedAccounts } from '~/pages/settings/applications/hooks/useMyAppConnectedAccounts';
import { useTriggerAppOAuth } from '~/pages/settings/applications/hooks/useTriggerAppOAuth';
import { type FrontendApplicationConnectionProvider } from '~/pages/settings/applications/types/FrontendApplicationConnectionProvider';

const CONNECTION_TABLE_ROW_GRID_TEMPLATE_COLUMNS =
  'minmax(0, 1fr) 160px 180px 36px';

const StyledFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledTableRowsContainer = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  padding: ${themeCssVariables.spacing[2]} 0;
`;

const AddConnectionDropdown = ({
  provider,
  onPick,
}: {
  provider: FrontendApplicationConnectionProvider;
  onPick: (visibility: 'user' | 'workspace') => void;
}) => {
  const { t } = useLingui();
  const dropdownId = `app-connection-add-${provider.id}`;
  const { closeDropdown } = useCloseDropdown();

  const handleSelect = (visibility: 'user' | 'workspace') => {
    closeDropdown(dropdownId);
    onPick(visibility);
  };

  return (
    <Dropdown
      dropdownId={dropdownId}
      dropdownPlacement="bottom-start"
      clickableComponent={
        <Button
          title={t`Tambah koneksi`}
          Icon={IconPlus}
          variant="secondary"
          accent="default"
          size="small"
        />
      }
      dropdownComponents={
        <DropdownContent>
          <DropdownMenuItemsContainer>
            <MenuItem
              text={t`Hanya untuk saya`}
              LeftIcon={IconUser}
              onClick={() => handleSelect('user')}
            />
            <MenuItem
              text={t`Dibagikan ke ruang kerja`}
              LeftIcon={IconUsers}
              onClick={() => handleSelect('workspace')}
            />
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};

export const SettingsApplicationConnectionsSection = ({
  applicationId,
}: {
  applicationId: string;
}) => {
  const { t } = useLingui();
  const { theme } = useContext(ThemeContext);
  const { triggerAppOAuth } = useTriggerAppOAuth();
  const { connectionProviders, loading } =
    useFindApplicationConnectionProviders(applicationId);
  const { accounts: connectedAccounts } = useMyAppConnectedAccounts();

  if (loading || connectionProviders.length === 0) {
    return null;
  }

  return (
    <>
      {connectionProviders.map((provider) => {
        const isOAuth = provider.type === 'oauth';
        const isClientCredentialsConfigured =
          provider.oauth?.isClientCredentialsConfigured ?? false;

        const providerConnections = connectedAccounts.filter(
          (account) => account.connectionProviderId === provider.id,
        );

        return (
          <Section key={provider.id}>
            <H2Title
              title={provider.displayName}
              description={t`Kelola koneksi yang digunakan aplikasi ini untuk mengakses ${provider.displayName}.`}
            />
            {isOAuth && !isClientCredentialsConfigured && (
              <Info
                accent="danger"
                text={t`OAuth ${provider.displayName} belum dikonfigurasi oleh administrator server. Mereka perlu mengisi Client ID dan secret OAuth pada registrasi aplikasi sebelum Anda dapat menambah koneksi.`}
              />
            )}
            {providerConnections.length > 0 && (
              <Table>
                <TableRow
                  gridTemplateColumns={
                    CONNECTION_TABLE_ROW_GRID_TEMPLATE_COLUMNS
                  }
                >
                  <TableHeader>{t`Koneksi`}</TableHeader>
                  <TableHeader>{t`Status`}</TableHeader>
                  <TableHeader>{t`Visibilitas`}</TableHeader>
                  <TableHeader />
                </TableRow>
                <StyledTableRowsContainer>
                  {providerConnections.map((connection) => (
                    <TableRow
                      key={connection.id}
                      gridTemplateColumns={
                        CONNECTION_TABLE_ROW_GRID_TEMPLATE_COLUMNS
                      }
                      to={getSettingsPath(
                        SettingsPath.ApplicationConnectionDetail,
                        {
                          applicationId,
                          connectedAccountId: connection.id,
                        },
                      )}
                    >
                      <TableCell
                        clickable
                        minWidth="0"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {connection.name ?? connection.handle}
                      </TableCell>
                      <TableCell clickable>
                        {connection.authFailedAt ? (
                          <Status color="red" text={t`Perlu sambung ulang`} />
                        ) : (
                          <Status color="green" text={t`Terhubung`} />
                        )}
                      </TableCell>
                      <TableCell clickable>
                        <Status
                          color={
                            connection.visibility === 'workspace'
                              ? 'blue'
                              : 'gray'
                          }
                          text={
                            connection.visibility === 'workspace'
                              ? t`Dibagikan ke ruang kerja`
                              : t`Hanya untuk saya`
                          }
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        color={themeCssVariables.font.color.tertiary}
                        padding={`0 ${themeCssVariables.spacing[2]} 0 0`}
                      >
                        <IconChevronRight
                          size={theme.icon.size.md}
                          stroke={theme.icon.stroke.sm}
                          color={theme.font.color.light}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </StyledTableRowsContainer>
              </Table>
            )}
            {isClientCredentialsConfigured && (
              <StyledFooter>
                <AddConnectionDropdown
                  provider={provider}
                  onPick={(visibility) =>
                    triggerAppOAuth({
                      applicationId,
                      providerName: provider.name,
                      visibility,
                    })
                  }
                />
              </StyledFooter>
            )}
          </Section>
        );
      })}
    </>
  );
};
