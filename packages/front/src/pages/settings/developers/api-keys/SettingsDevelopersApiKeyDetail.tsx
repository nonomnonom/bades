import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { useStore } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { ApiKeyInput } from '@/settings/developers/components/ApiKeyInput';
import { ApiKeyNameInput } from '@/settings/developers/components/ApiKeyNameInput';
import { SettingsDevelopersRoleSelector } from '@/settings/developers/components/SettingsDevelopersRoleSelector';
import { apiKeyTokenFamilyState } from '@/settings/developers/states/apiKeyTokenFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { computeNewExpirationDate } from '@/settings/developers/utils/computeNewExpirationDate';
import { formatExpiration } from '@/settings/developers/utils/formatExpiration';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title, IconRepeat, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  AssignRoleToApiKeyDocument,
  CreateApiKeyDocument,
  GenerateApiKeyTokenDocument,
  GetApiKeyDocument,
  GetRolesDocument,
  RevokeApiKeyDocument,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

const StyledInfo = styled.span`
  color: ${themeCssVariables.font.color.light};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};
`;

const StyledInputContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[2]};
  width: 100%;
`;

const DELETE_API_KEY_MODAL_ID = 'delete-api-key-modal';
const REGENERATE_API_KEY_MODAL_ID = 'regenerate-api-key-modal';

export const SettingsDevelopersApiKeyDetail = () => {
  const { t } = useLingui();
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigateSettings();
  const { apiKeyId = '' } = useParams();

  const jotaiStore = useStore();

  const apiKeyToken = useAtomFamilyStateValue(apiKeyTokenFamilyState, apiKeyId);

  const setApiKeyTokenCallback = useCallback(
    (apiKeyId: string, token: string) => {
      jotaiStore.set(apiKeyTokenFamilyState.atomFamily(apiKeyId), token);
    },
    [jotaiStore],
  );

  const [generateOneApiKeyToken] = useMutation(GenerateApiKeyTokenDocument);
  const [createApiKey] = useMutation(CreateApiKeyDocument);
  const [revokeApiKey] = useMutation(RevokeApiKeyDocument);
  const [assignRoleToApiKey] = useMutation(AssignRoleToApiKeyDocument);

  const { data: apiKeyData, loading: apiKeyLoading } = useQuery(
    GetApiKeyDocument,
    {
      variables: {
        input: {
          id: apiKeyId,
        },
      },
    },
  );

  useEffect(() => {
    if (isDefined(apiKeyData?.apiKey)) {
      setApiKeyName(apiKeyData.apiKey.name);
      if (isDefined(apiKeyData.apiKey.role)) {
        setSelectedRoleId(apiKeyData.apiKey.role.id);
      }
    }
  }, [apiKeyData]);

  const { data: rolesData, loading: rolesLoading } = useQuery(GetRolesDocument);

  const roles = rolesData?.getRoles ?? [];

  const apiKey = apiKeyData?.apiKey;
  const [apiKeyName, setApiKeyName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(
    undefined,
  );

  const handleRoleChange = async (roleId: string) => {
    if (!apiKey?.id || !isNonEmptyString(roleId)) return;

    setIsLoading(true);
    try {
      await assignRoleToApiKey({
        variables: {
          apiKeyId: apiKey.id,
          roleId,
        },
      });
      enqueueSuccessSnackBar({
        message: t`Peran berhasil diperbarui`,
      });
      setSelectedRoleId(roleId);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal memperbarui peran`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIntegration = async (redirect = true) => {
    setIsLoading(true);

    try {
      await revokeApiKey({
        variables: {
          input: {
            id: apiKeyId,
          },
        },
      });
      if (redirect) {
        navigate(SettingsPath.ApiWebhooks);
      }
    } catch {
      enqueueErrorSnackBar({ message: t`Gagal menghapus kunci API.` });
    } finally {
      setIsLoading(false);
    }
  };

  const createIntegration = async (
    name: string,
    newExpiresAt: string | null,
  ) => {
    const roleIdToUse = selectedRoleId;

    if (!roleIdToUse) {
      enqueueErrorSnackBar({
        message: t`Peran harus dipilih untuk kunci API`,
      });
      return;
    }

    if (!isDefined(roleIdToUse)) {
      throw new Error('Role not selected - this should never happen');
    }

    const { data: newApiKeyData } = await createApiKey({
      variables: {
        input: {
          name: name,
          expiresAt: newExpiresAt ?? '',
          roleId: roleIdToUse,
        },
      },
    });

    const newApiKey = newApiKeyData?.createApiKey;

    if (!newApiKey) {
      return;
    }

    const tokenData = await generateOneApiKeyToken({
      variables: {
        apiKeyId: newApiKey.id,
        expiresAt: newApiKey?.expiresAt,
      },
    });
    return {
      id: newApiKey.id,
      token: tokenData.data?.generateApiKeyToken.token,
    };
  };

  const regenerateApiKey = async () => {
    setIsLoading(true);
    try {
      if (isDefined(apiKey)) {
        if (!isNonEmptyString(apiKeyName)) {
          enqueueErrorSnackBar({
            message: t`Nama kunci API tidak boleh kosong`,
          });
          return;
        }
        const newExpiresAt = computeNewExpirationDate(
          apiKey.expiresAt,
          apiKey.createdAt,
        );
        const newApiKey = await createIntegration(apiKeyName, newExpiresAt);
        await deleteIntegration(false);

        if (isNonEmptyString(newApiKey?.token)) {
          setApiKeyTokenCallback(newApiKey.id, newApiKey.token);
          navigate(SettingsPath.ApiKeyDetail, {
            apiKeyId: newApiKey.id,
          });
        }
      }
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal membuat ulang kunci API.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmationValue = t`ya`;

  if (apiKeyLoading || rolesLoading) {
    return <SettingsSkeletonLoader />;
  }

  return (
    <>
      {isDefined(apiKey) && (
        <SubMenuTopBarContainer
          title={apiKey.name || t`Kunci API Tanpa Nama`}
          links={[
            {
              children: t`Ruang Kerja`,
              href: getSettingsPath(SettingsPath.Workspace),
            },
            {
              children: t`API & Webhook`,
              href: getSettingsPath(SettingsPath.ApiWebhooks),
            },
            { children: apiKey.name || t`Kunci API Tanpa Nama` },
          ]}
        >
          <SettingsPageContainer>
            <Section>
              {apiKeyToken ? (
                <>
                  <H2Title
                    title={t`Kunci API`}
                    description={t`Salin kunci ini karena tidak akan ditampilkan lagi`}
                  />
                  <ApiKeyInput apiKey={apiKeyToken} />
                </>
              ) : (
                <>
                  <H2Title
                    title={t`Kunci API`}
                    description={t`Buat ulang kunci API`}
                  />
                  <StyledInputContainer>
                    <Button
                      title={t`Buat Ulang Kunci`}
                      Icon={IconRepeat}
                      onClick={() => openModal(REGENERATE_API_KEY_MODAL_ID)}
                    />
                    <StyledInfo>
                      {formatExpiration(apiKey?.expiresAt || '', true, false)}
                    </StyledInfo>
                  </StyledInputContainer>
                </>
              )}
            </Section>
            <Section>
              <H2Title title={t`Nama`} description={t`Nama kunci API Anda`} />
              <ApiKeyNameInput
                apiKeyName={apiKeyName}
                apiKeyId={apiKey?.id}
                disabled={isLoading}
                onNameUpdate={setApiKeyName}
              />
            </Section>
            <Section>
              <H2Title
                title={t`Peran`}
                description={t`Kemampuan API ini: pilih peran pengguna untuk menentukan izinnya.`}
              />
              <SettingsDevelopersRoleSelector
                value={selectedRoleId}
                onChange={handleRoleChange}
                roles={roles}
              />
            </Section>
            <Section>
              <H2Title
                title={t`Kedaluwarsa`}
                description={t`Kapan kunci akan dinonaktifkan`}
              />
              <SettingsTextInput
                instanceId={`api-key-expiration-${apiKey?.id}`}
                placeholder={t`Mis. integrasi backoffice`}
                value={formatExpiration(apiKey?.expiresAt || '', true, false)}
                disabled
                fullWidth
              />
            </Section>
            <Section>
              <H2Title
                title={t`Zona berbahaya`}
                description={t`Hapus integrasi ini`}
              />
              <Button
                accent="danger"
                variant="secondary"
                title={t`Hapus`}
                Icon={IconTrash}
                onClick={() => openModal(DELETE_API_KEY_MODAL_ID)}
              />
            </Section>
          </SettingsPageContainer>
        </SubMenuTopBarContainer>
      )}
      <ConfirmationModal
        confirmationPlaceholder={confirmationValue}
        confirmationValue={confirmationValue}
        modalInstanceId={DELETE_API_KEY_MODAL_ID}
        title={t`Hapus kunci API`}
        subtitle={
          <Trans>
            Ketik {`"${confirmationValue}"`} untuk mengonfirmasi penghapusan
            kunci API ini. Perlu diketahui, integrasi apa pun yang memakai
            kunci ini akan berhenti berfungsi.
          </Trans>
        }
        onConfirmClick={deleteIntegration}
        confirmButtonText={t`Hapus`}
        loading={isLoading}
      />
      <ConfirmationModal
        confirmationPlaceholder={confirmationValue}
        confirmationValue={confirmationValue}
        modalInstanceId={REGENERATE_API_KEY_MODAL_ID}
        title={t`Buat ulang kunci API`}
        subtitle={
          <Trans>
            Jika kunci ini hilang, Anda dapat membuatnya ulang, tetapi
            integrasi apa pun yang memakai kunci lama harus diperbarui. Ketik
            {`"${confirmationValue}"`} untuk mengonfirmasi.
          </Trans>
        }
        onConfirmClick={regenerateApiKey}
        confirmButtonText={t`Buat ulang kunci`}
        loading={isLoading}
      />
    </>
  );
};
