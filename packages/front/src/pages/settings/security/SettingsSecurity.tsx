import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { authProvidersState } from '@/client-config/states/authProvidersState';
import { isClickHouseConfiguredState } from '@/client-config/states/isClickHouseConfiguredState';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { Separator } from '@/settings/components/Separator';
import { SettingsEnterpriseFeatureGateCard } from '@/settings/components/SettingsEnterpriseFeatureGateCard';
import { SettingsOptionCardContentButton } from '@/settings/components/SettingsOptions/SettingsOptionCardContentButton';
import { SettingsOptionCardContentCounter } from '@/settings/components/SettingsOptions/SettingsOptionCardContentCounter';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsRoleDefaultRole } from '@/settings/roles/components/SettingsRolesDefaultRole';
import { SettingsRolesQueryEffect } from '@/settings/roles/components/SettingsRolesQueryEffect';
import { useSettingsAllRoles } from '@/settings/roles/hooks/useSettingsAllRoles';
import { SettingsSSOIdentitiesProvidersListCard } from '@/settings/security/components/SSO/SettingsSSOIdentitiesProvidersListCard';
import { SettingsSecurityAuthBypassOptionsList } from '@/settings/security/components/SettingsSecurityAuthBypassOptionsList';
import { SettingsSecurityAuthProvidersOptionsList } from '@/settings/security/components/SettingsSecurityAuthProvidersOptionsList';
import { SettingsSecurityEditableProfileFields } from '@/settings/security/components/SettingsSecurityEditableProfileFields';
import { SSOIdentitiesProvidersState } from '@/settings/security/states/SSOIdentitiesProvidersState';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { ToggleImpersonate } from '@/settings/workspace/components/ToggleImpersonate';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useMutation } from '@apollo/client/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Tag } from 'ui/components';
import {
  H2Title,
  IconClockHour8,
  IconHistory,
  IconLock,
  IconMail,
  IconTrash,
} from 'ui/display';
import { Button } from 'ui/input';
import { Card, Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { UpdateWorkspaceDocument } from '~/generated-metadata/graphql';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[10]};
  min-height: 200px;
`;

const StyledSectionContainer = styled.div`
  flex-shrink: 0;
`;

const StyledLinkContainer = styled.div`
  > a {
    text-decoration: none;

    &[data-disabled='true'] {
      pointer-events: none;
    }
  }
`;

export const SettingsSecurity = () => {
  const { t } = useLingui();
  const { enqueueErrorSnackBar } = useSnackBar();

  const isMultiWorkspaceEnabled = useAtomStateValue(
    isMultiWorkspaceEnabledState,
  );
  const isClickHouseConfigured = useAtomStateValue(isClickHouseConfiguredState);
  const authProviders = useAtomStateValue(authProvidersState);
  const SSOIdentitiesProviders = useAtomStateValue(SSOIdentitiesProvidersState);
  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );
  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);

  const saveTrashRetention = useDebouncedCallback(async (value: number) => {
    try {
      await updateWorkspace({
        variables: {
          input: {
            trashRetentionDays: value,
          },
        },
      });
    } catch (err) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    }
  }, 500);

  const saveEventLogRetention = useDebouncedCallback(async (value: number) => {
    try {
      await updateWorkspace({
        variables: {
          input: {
            eventLogRetentionDays: value,
          },
        },
      });
    } catch (err) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    }
  }, 500);

  const handleTrashRetentionDaysChange = (value: number) => {
    if (!currentWorkspace) {
      return;
    }

    if (value === currentWorkspace.trashRetentionDays) {
      return;
    }

    setCurrentWorkspace({
      ...currentWorkspace,
      trashRetentionDays: value,
    });

    saveTrashRetention(value);
  };

  const handleSyncInternalEmailsChange = (value: boolean) => {
    if (!currentWorkspace) {
      return;
    }

    if (value === currentWorkspace.isInternalMessagesImportEnabled) {
      return;
    }

    setCurrentWorkspace({
      ...currentWorkspace,
      isInternalMessagesImportEnabled: value,
    });

    updateWorkspace({
      variables: {
        input: {
          isInternalMessagesImportEnabled: value,
        },
      },
    }).catch((err) => {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(err) ? err : undefined,
      });
    });
  };

  const handleEventLogRetentionDaysChange = (value: number) => {
    if (!currentWorkspace) {
      return;
    }

    if (value === currentWorkspace.eventLogRetentionDays) {
      return;
    }

    setCurrentWorkspace({
      ...currentWorkspace,
      eventLogRetentionDays: value,
    });

    saveEventLogRetention(value);
  };

  const roles = useSettingsAllRoles();

  const hasSsoIdentityProviders = SSOIdentitiesProviders.length > 0;
  const hasDirectAuthEnabled =
    currentWorkspace?.isGoogleAuthEnabled ||
    currentWorkspace?.isMicrosoftAuthEnabled ||
    currentWorkspace?.isPasswordAuthEnabled;
  const hasBypassProviderAvailable =
    authProviders?.google ||
    authProviders?.microsoft ||
    authProviders?.password;
  const shouldShowBypassSection =
    hasSsoIdentityProviders &&
    !hasDirectAuthEnabled &&
    hasBypassProviderAvailable;

  const hasEnterpriseAccess = currentWorkspace?.hasValidEnterpriseKey === true;
  const isEventLogsEnabled = hasEnterpriseAccess && isClickHouseConfigured;

  return (
    <SubMenuTopBarContainer
      title={t`Keamanan`}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>Keamanan</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <SettingsRolesQueryEffect />
        <StyledMainContent>
          <StyledSectionContainer>
            <Section>
              <H2Title
                title={t`SSO`}
                description={t`Konfigurasi koneksi SSO`}
                adornment={
                  <Tag
                    text={"Enterprise"}
                    color="transparent"
                    Icon={IconLock}
                    variant="border"
                  />
                }
              />
              <SettingsSSOIdentitiesProvidersListCard />
            </Section>
          </StyledSectionContainer>

          <Section>
            <StyledContainer>
              <H2Title
                title={t`Autentikasi`}
                description={t`Sesuaikan keamanan ruang kerja Anda`}
              />
              <SettingsSecurityAuthProvidersOptionsList />
            </StyledContainer>
          </Section>
          <Section>
            <StyledContainer>
              <H2Title
                title={t`Kolom Profil yang Dapat Diedit`}
                description={t`Pilih kolom profil mana yang dapat diubah pengguna dengan izin Edit Profil`}
              />
              <SettingsSecurityEditableProfileFields />
            </StyledContainer>
          </Section>
          <SettingsRoleDefaultRole roles={roles} />
          {shouldShowBypassSection && (
            <Section>
              <StyledContainer>
                <H2Title
                  title={t`Bypass SSO`}
                  description={t`Konfigurasi metode masuk cadangan untuk pengguna dengan izin bypass SSO`}
                />
                <SettingsSecurityAuthBypassOptionsList />
              </StyledContainer>
            </Section>
          )}
          {isMultiWorkspaceEnabled && (
            <Section>
              <H2Title
                title={t`Dukungan`}
                description={t`Kelola pengaturan akses dukungan`}
              />
              <ToggleImpersonate />
            </Section>
          )}
          <Section>
            <H2Title
              title={t`Log Audit`}
              description={t`Lihat log aktivitas ruang kerja`}
              adornment={
                <Tag
                  text={"Enterprise"}
                  color="transparent"
                  Icon={IconLock}
                  variant="border"
                />
              }
            />
            {hasEnterpriseAccess ? (
              <Card rounded>
                <SettingsOptionCardContentButton
                  Icon={IconHistory}
                  title={t`Peristiwa Ruang Kerja`}
                  description={
                    !isClickHouseConfigured
                      ? t`ClickHouse diperlukan untuk log audit. Hubungi administrator Anda.`
                      : t`Lihat dan filter peristiwa, tampilan halaman, perubahan objek`
                  }
                  Button={
                    <StyledLinkContainer>
                      <Link
                        to={getSettingsPath(SettingsPath.EventLogs)}
                        data-disabled={!isEventLogsEnabled}
                      >
                        <Button
                          title={t`Lihat Log`}
                          variant="secondary"
                          size="small"
                          disabled={!isEventLogsEnabled}
                        />
                      </Link>
                    </StyledLinkContainer>
                  }
                />
                {isEventLogsEnabled && (
                  <>
                    <Separator />
                    <SettingsOptionCardContentCounter
                      Icon={IconClockHour8}
                      title={t`Retensi log`}
                      description={t`Jumlah hari menyimpan log audit (30-1095 hari)`}
                      value={currentWorkspace?.eventLogRetentionDays ?? 90}
                      onChange={handleEventLogRetentionDaysChange}
                      minValue={30}
                      maxValue={1095}
                      showButtons={false}
                    />
                  </>
                )}
              </Card>
            ) : (
              <SettingsEnterpriseFeatureGateCard
                title={t`Fitur enterprise`}
                description={t`Tingkatkan ke Enterprise untuk mengakses log audit.`}
                buttonTitle={t`Aktifkan`}
              />
            )}
          </Section>
          <Section>
            <H2Title
              title={t`Lainnya`}
              description={t`Pengaturan keamanan lainnya`}
            />
            <Card rounded>
              <SettingsOptionCardContentCounter
                Icon={IconTrash}
                title={t`Penghapusan catatan yang dihapus sementara`}
                description={t`Penghapusan permanen. Masukkan jumlah hari.`}
                value={currentWorkspace?.trashRetentionDays ?? 14}
                onChange={handleTrashRetentionDaysChange}
                minValue={0}
                showButtons={false}
              />
              <Separator />
              <SettingsOptionCardContentToggle
                Icon={IconMail}
                title={t`Sinkronisasi Surel Internal`}
                description={t`Sertakan surel di mana semua peserta berbagi domain yang sama.`}
                checked={
                  currentWorkspace?.isInternalMessagesImportEnabled ?? false
                }
                onChange={handleSyncInternalEmailsChange}
                advancedMode
              />
            </Card>
          </Section>
        </StyledMainContent>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
