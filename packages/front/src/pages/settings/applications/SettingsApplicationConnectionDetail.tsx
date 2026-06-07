import { Trans } from '~/utils/i18n/badesI18n';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Tag } from 'ui/components';
import {
  H2Title,
  IconRefresh,
  IconTrash,
  IconUser,
  IconUsers,
  Status,
} from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

import { GET_MY_CONNECTED_ACCOUNTS } from '@/settings/accounts/graphql/queries/getMyConnectedAccounts';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { TableSection } from '@/ui/layout/table/components/TableSection';
import {
  DeleteConnectedAccountDocument,
  FindOneApplicationDocument,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { useFindApplicationConnectionProviders } from '~/pages/settings/applications/hooks/useFindApplicationConnectionProviders';
import {
  type AppConnectedAccount,
  useMyAppConnectedAccounts,
} from '~/pages/settings/applications/hooks/useMyAppConnectedAccounts';
import { useTriggerAppOAuth } from '~/pages/settings/applications/hooks/useTriggerAppOAuth';
import { type FrontendApplicationConnectionProvider } from '~/pages/settings/applications/types/FrontendApplicationConnectionProvider';

const DETAIL_GRID_TEMPLATE = '220px 1fr';

const StyledActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[3]};
`;

const StyledMonoText = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.code.font.family}, monospace;
  font-size: ${themeCssVariables.font.size.sm};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledScopeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const formatDateTime = (isoString?: string | null): string => {
  if (isoString === undefined || isoString === null) {
    return '-';
  }

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleString();
};

export const SettingsApplicationConnectionDetail = () => {
  const { applicationId = '', connectedAccountId = '' } = useParams<{
    applicationId: string;
    connectedAccountId: string;
  }>();

  const navigate = useNavigateSettings();
  const { openModal } = useModal();
  const { triggerAppOAuth } = useTriggerAppOAuth();
  const { connectionProviders, loading: providersLoading } =
    useFindApplicationConnectionProviders(applicationId);
  const { accounts: connectedAccounts, loading: accountsLoading } =
    useMyAppConnectedAccounts();

  const { data, loading: applicationLoading } = useQuery(
    FindOneApplicationDocument,
    {
      variables: { id: applicationId },
      skip: !applicationId,
    },
  );

  const [deleteConnectedAccount, { loading: isDeleting }] = useMutation(
    DeleteConnectedAccountDocument,
    {
      refetchQueries: [{ query: GET_MY_CONNECTED_ACCOUNTS }],
    },
  );

  const application = data?.findOneApplication;
  const providerIds = new Set(
    connectionProviders.map((provider) => provider.id),
  );
  const connection = connectedAccounts.find(
    (account) =>
      account.id === connectedAccountId &&
      account.connectionProviderId !== null &&
      account.connectionProviderId !== undefined &&
      providerIds.has(account.connectionProviderId),
  );
  const provider = connectionProviders.find(
    (connectionProvider) =>
      connectionProvider.id === connection?.connectionProviderId,
  );

  const applicationName = application?.name ?? `Aplikasi`;
  const connectionLabel =
    connection?.name !== null &&
    connection?.name !== undefined &&
    connection.name.trim() !== ''
      ? connection.name
      : (connection?.handle ?? `Koneksi`);
  const deleteModalId = `delete-application-connection-modal-${connectedAccountId}`;
  const changeVisibilityModalId = `change-application-connection-visibility-modal-${connectedAccountId}`;
  const applicationSettingsPath = getSettingsPath(
    SettingsPath.ApplicationDetail,
    { applicationId },
    undefined,
    'settings',
  );
  const detailPath = getSettingsPath(SettingsPath.ApplicationConnectionDetail, {
    applicationId,
    connectedAccountId,
  });

  const handleReconnect = () => {
    if (connection === undefined || provider === undefined) {
      return;
    }

    triggerAppOAuth({
      applicationId,
      providerName: provider.name,
      visibility: connection.visibility === 'workspace' ? 'workspace' : 'user',
      reconnectingConnectedAccountId: connection.id,
      redirectLocation: detailPath,
    });
  };

  const handleChangeVisibility = () => {
    if (connection === undefined || provider === undefined) {
      return;
    }

    triggerAppOAuth({
      applicationId,
      providerName: provider.name,
      visibility: connection.visibility === 'workspace' ? 'user' : 'workspace',
      reconnectingConnectedAccountId: connection.id,
      redirectLocation: detailPath,
    });
  };

  const handleDelete = async () => {
    if (connection === undefined) {
      return;
    }

    await deleteConnectedAccount({ variables: { id: connection.id } });

    navigate(
      SettingsPath.ApplicationDetail,
      { applicationId },
      undefined,
      { replace: true },
      'settings',
    );
  };

  const isLoading = providersLoading || accountsLoading || applicationLoading;

  const getDetailRows = ({
    connection,
    provider,
  }: {
    connection: AppConnectedAccount;
    provider: FrontendApplicationConnectionProvider;
  }): { key: string; label: string; value: ReactNode }[] => {
    const scopes = connection.scopes ?? [];

    return [
      {
        key: 'provider',
        label: `Penyedia`,
        value: provider.displayName,
      },
      {
        key: 'handle',
        label: 'Handle',
        value: <StyledMonoText>{connection.handle}</StyledMonoText>,
      },
      {
        key: 'visibility',
        label: `Visibilitas`,
        value: (
          <Status
            color={connection.visibility === 'workspace' ? 'blue' : 'gray'}
            text={
              connection.visibility === 'workspace'
                ? `Dibagikan ke ruang kerja`
                : `Hanya untuk saya`
            }
          />
        ),
      },
      {
        key: 'status',
        label: `Status`,
        value: connection.authFailedAt ? (
          <Status color="red" text={`Perlu sambung ulang`} />
        ) : (
          <Status color="green" text={`Terhubung`} />
        ),
      },
      {
        key: 'scopes',
        label: `Cakupan OAuth yang diberikan`,
        value:
          scopes.length > 0 ? (
            <StyledScopeList>
              {scopes.map((scope) => (
                <Tag key={scope} color="gray" text={scope} />
              ))}
            </StyledScopeList>
          ) : (
            '-'
          ),
      },
      {
        key: 'lastSignedInAt',
        label: `Terakhir masuk`,
        value: formatDateTime(connection.lastSignedInAt),
      },
      {
        key: 'lastCredentialsRefreshedAt',
        label: `Terakhir diperbarui`,
        value: formatDateTime(connection.lastCredentialsRefreshedAt),
      },
      {
        key: 'authFailedAt',
        label: `Autentikasi gagal pada`,
        value: formatDateTime(connection.authFailedAt),
      },
      {
        key: 'createdAt',
        label: `Dibuat`,
        value: formatDateTime(connection.createdAt),
      },
      {
        key: 'updatedAt',
        label: `Diperbarui`,
        value: formatDateTime(connection.updatedAt),
      },
    ];
  };

  const detailRows =
    connection !== undefined && provider !== undefined
      ? getDetailRows({ connection, provider })
      : [];

  return (
    <SubMenuTopBarContainer
      title={connectionLabel}
      links={[
        {
          children: `Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: `Aplikasi`,
          href: getSettingsPath(SettingsPath.Applications),
        },
        {
          children: applicationName,
          href: applicationSettingsPath,
        },
        { children: connectionLabel },
      ]}
    >
      <SettingsPageContainer>
        {isLoading ? (
          <SettingsSectionSkeletonLoader />
        ) : connection === undefined || provider === undefined ? (
          <Section>
            <H2Title
              title={`Koneksi tidak ditemukan`}
              description={`Koneksi ini tidak ada atau tidak tersedia untuk aplikasi ini.`}
            />
          </Section>
        ) : (
          <>
            <Section>
              <H2Title
                title={connectionLabel}
                description={`Kelola koneksi OAuth aplikasi ini.`}
              />
              <StyledActions>
                {connection.authFailedAt && (
                  <Button
                    title={`Sambung ulang`}
                    Icon={IconRefresh}
                    variant="secondary"
                    accent="blue"
                    onClick={handleReconnect}
                  />
                )}
                <Button
                  title={
                    connection.visibility === 'workspace'
                      ? `Jadikan privat`
                      : `Bagikan ke ruang kerja`
                  }
                  Icon={
                    connection.visibility === 'workspace' ? IconUser : IconUsers
                  }
                  variant="secondary"
                  accent="default"
                  onClick={() => openModal(changeVisibilityModalId)}
                />
                <Button
                  title={`Putuskan koneksi`}
                  Icon={IconTrash}
                  variant="secondary"
                  accent="danger"
                  onClick={() => openModal(deleteModalId)}
                />
              </StyledActions>
            </Section>
            <Section>
              <H2Title
                title={`Detail`}
                description={`Metadata kredensial OAuth untuk koneksi aplikasi ini`}
              />
              <Table>
                <TableRow gridTemplateColumns={DETAIL_GRID_TEMPLATE}>
                  <TableHeader>{`Properti`}</TableHeader>
                  <TableHeader>{`Nilai`}</TableHeader>
                </TableRow>
                <TableSection title={`Koneksi`}>
                  {detailRows.map((row) => (
                    <TableRow
                      key={row.key}
                      gridTemplateColumns={DETAIL_GRID_TEMPLATE}
                    >
                      <TableCell color={themeCssVariables.font.color.secondary}>
                        {row.label}
                      </TableCell>
                      <TableCell minWidth="0" overflow="hidden">
                        {row.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableSection>
              </Table>
            </Section>
            <ConfirmationModal
              modalInstanceId={deleteModalId}
              title={`Putuskan koneksi?`}
              subtitle={
                <Trans>
                  Tindakan ini akan memutuskan {connectionLabel} dari aplikasi
                  ini.
                </Trans>
              }
              onConfirmClick={handleDelete}
              confirmButtonText={`Putuskan koneksi`}
              loading={isDeleting}
            />
            <ConfirmationModal
              modalInstanceId={changeVisibilityModalId}
              title={`Ubah visibilitas?`}
              subtitle={
                <Trans>
                  Mengubah visibilitas memerlukan sambung ulang koneksi OAuth
                  ini. Anda akan diarahkan untuk mengotorisasi ulang.
                </Trans>
              }
              onConfirmClick={handleChangeVisibility}
              confirmButtonText={`Sambung ulang dan ubah visibilitas`}
              confirmButtonAccent="blue"
            />
          </>
        )}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
