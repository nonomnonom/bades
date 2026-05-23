import { t } from '~/utils/i18n/badesI18n';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';

import { AI_ADMIN_PATH } from '@/settings/admin-panel/ai/constants/AiAdminPath';
import { AI_PROVIDER_SOURCE } from '@/settings/admin-panel/ai/constants/AiProviderSource';
import {
  H2Title,
  type IconComponent,
  IconFlag,
  IconKey,
  IconPlug,
  IconPlus,
  IconServer,
  IconTag,
  IconTrash,
  IconWorld,
} from 'ui/display';
import { Button, SearchInput } from 'ui/input';
import { Section } from 'ui/layout';
import { RoundedLink, UndecoratedLink } from 'ui/navigation';

import { useClientConfig } from '@/client-config/hooks/useClientConfig';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { SettingsAiModelsTable } from '@/settings/ai/components/SettingsAiModelsTable';
import { REMOVE_AI_PROVIDER } from '@/settings/admin-panel/ai/graphql/mutations/removeAiProvider';
import { SET_ADMIN_AI_MODELS_ENABLED } from '@/settings/admin-panel/ai/graphql/mutations/setAdminAiModelsEnabled';
import { REMOVE_MODEL_FROM_PROVIDER } from '@/settings/admin-panel/ai/graphql/mutations/removeModelFromProvider';
import { GET_ADMIN_AI_MODELS } from '@/settings/admin-panel/ai/graphql/queries/getAdminAiModels';
import { GET_AI_PROVIDERS } from '@/settings/admin-panel/ai/graphql/queries/getAiProviders';
import { type GetAiProvidersResult } from '@/settings/admin-panel/ai/types/GetAiProvidersResult';
import { getDataResidencyDisplay } from '@/settings/ai/utils/getDataResidencyDisplay';
import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import {
  type AdminAiModelConfig,
  SetAdminAiModelEnabledDocument,
} from '~/generated-admin/graphql';

const REMOVE_PROVIDER_MODAL_ID = 'settings-ai-provider-remove';
const REMOVE_MODEL_MODAL_ID = 'settings-ai-model-remove';

export const SettingsAdminAiProviderDetail = () => {
  const { providerName } = useParams<{ providerName: string }>();
  const apolloAdminClient = useApolloAdminClient();
  const navigate = useNavigate();
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const { refetch: refetchClientConfig } = useClientConfig();
  const { openModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [modelToRemove, setModelToRemove] = useState<{
    modelId: string;
    label: string;
    name: string;
  } | null>(null);

  const { data: providersData, loading: isLoadingProviders } =
    useQuery<GetAiProvidersResult>(GET_AI_PROVIDERS, {
      client: apolloAdminClient,
    });

  const {
    data: modelsData,
    loading: isLoadingModels,
    refetch: refetchModels,
  } = useQuery<{
    getAdminAiModels: {
      models: AdminAiModelConfig[];
    };
  }>(GET_ADMIN_AI_MODELS, { client: apolloAdminClient });

  const [setModelEnabled] = useMutation(SetAdminAiModelEnabledDocument, {
    client: apolloAdminClient,
  });
  const [setModelsEnabled] = useMutation(SET_ADMIN_AI_MODELS_ENABLED, {
    client: apolloAdminClient,
  });
  const [removeAiProvider] = useMutation(REMOVE_AI_PROVIDER, {
    client: apolloAdminClient,
  });
  const [removeModelFromProvider] = useMutation(REMOVE_MODEL_FROM_PROVIDER, {
    client: apolloAdminClient,
  });

  const handleRemoveProvider = async () => {
    if (!providerName) {
      return;
    }

    try {
      await removeAiProvider({
        variables: { providerName },
        refetchQueries: [
          { query: GET_AI_PROVIDERS },
          { query: GET_ADMIN_AI_MODELS },
        ],
      });
      enqueueSuccessSnackBar({
        message: t`Penyedia "${provider?.label ?? providerName}" dihapus`,
      });
      navigate(AI_ADMIN_PATH);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal menghapus penyedia`,
      });
    }
  };

  const handleRemoveModel = async () => {
    if (!providerName || !modelToRemove) {
      return;
    }

    try {
      await removeModelFromProvider({
        variables: {
          providerName,
          modelName: modelToRemove.name,
        },
        refetchQueries: [
          { query: GET_AI_PROVIDERS },
          { query: GET_ADMIN_AI_MODELS },
        ],
      });
      await refetchClientConfig();
      enqueueSuccessSnackBar({
        message: t`Model "${modelToRemove.label}" dihapus`,
      });
      setModelToRemove(null);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal menghapus model`,
      });
    }
  };

  const providerConfig =
    providerName && providersData?.getAiProviders
      ? providersData.getAiProviders[providerName]
      : undefined;

  const provider = useMemo(
    () =>
      providerName && isDefined(providerConfig)
        ? { id: providerName, ...providerConfig }
        : undefined,
    [providerName, providerConfig],
  );

  const isCustomProvider = provider?.source === AI_PROVIDER_SOURCE.CUSTOM;

  const providerModels = useMemo(() => {
    const allModels = modelsData?.getAdminAiModels?.models ?? [];

    return allModels.filter((model) => model.providerName === providerName);
  }, [modelsData, providerName]);

  const filteredModels =
    searchQuery.trim().length === 0
      ? providerModels
      : providerModels.filter((model) => {
          const query = searchQuery.toLowerCase();

          return (
            model.label.toLowerCase().includes(query) ||
            model.modelId.toLowerCase().includes(query)
          );
        });

  const handleModelToggle = async (
    modelId: string,
    isCurrentlyEnabled: boolean,
  ) => {
    try {
      await setModelEnabled({
        variables: { modelId, enabled: !isCurrentlyEnabled },
        refetchQueries: [{ query: GET_ADMIN_AI_MODELS }],
      });
      await refetchClientConfig();
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal memperbarui ketersediaan model`,
      });
    }
  };

  const handleModelRemoveClick = (model: AdminAiModelConfig) => {
    setModelToRemove({
      modelId: model.modelId,
      label: model.label,
      name: model.name ?? model.modelId,
    });
    openModal(REMOVE_MODEL_MODAL_ID);
  };

  const providerInfoItems = useMemo(() => {
    if (!provider) {
      return [];
    }

    const items: Array<{
      Icon: IconComponent;
      label: string;
      value: string | React.ReactNode;
    }> = [
      {
        Icon: IconTag,
        label: t`Nama`,
        value: provider.label ?? provider.id,
      },
      {
        Icon: IconPlug,
        label: "SDK",
        value: provider.npm,
      },
    ];

    if (provider.apiKeyConfigVariable) {
      const envVar = provider.apiKeyConfigVariable;
      const configPath = getSettingsPath(
        SettingsPath.AdminPanelConfigVariableDetails,
        { variableName: envVar },
      );

      items.push({
        Icon: IconKey,
        label: t`Kunci API`,
        value: (
          <RoundedLink
            href={configPath}
            label={provider.apiKey ?? t`Konfigurasikan`}
            onClick={(event) => {
              event.preventDefault();
              navigate(configPath);
            }}
          />
        ),
      });
    } else if (provider.apiKey) {
      items.push({
        Icon: IconKey,
        label: t`Kunci API`,
        value: provider.apiKey,
      });
    }

    if (provider.baseUrl) {
      items.push({
        Icon: IconWorld,
        label: t`URL Dasar`,
        value: provider.baseUrl,
      });
    }

    if (provider.region) {
      items.push({
        Icon: IconServer,
        label: t`Wilayah`,
        value: provider.region,
      });
    }

    if (provider.hasAccessKey) {
      items.push({
        Icon: IconKey,
        label: t`Kredensial`,
        value: t`Kredensial IAM dikonfigurasi`,
      });
    } else if (provider.authType === 'role') {
      items.push({
        Icon: IconKey,
        label: t`Kredensial`,
        value: t`Peran IAM (profil instance)`,
      });
    }

    if (isCustomProvider && provider.dataResidency) {
      items.push({
        Icon: IconFlag,
        label: t`Residensi Data`,
        value: getDataResidencyDisplay(provider.dataResidency),
      });
    }

    return items;
  }, [provider, navigate, isCustomProvider]);

  const newModelPath = providerName
    ? getSettingsPath(SettingsPath.AdminPanelNewAiModel, { providerName })
    : undefined;

  if (isLoadingProviders || isLoadingModels) {
    return <SettingsSkeletonLoader />;
  }

  return (
    <SubMenuTopBarContainer
      links={[
        {
          children: t`Lainnya`,
          href: getSettingsPath(SettingsPath.AdminPanel),
        },
        {
          children: t`Panel Admin - AI`,
          href: AI_ADMIN_PATH,
        },
        {
          children: provider?.label ?? providerName ?? '',
        },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={provider?.label ?? providerName ?? ''}
            description={provider?.npm ?? ''}
          />

          {provider && (
            <SettingsTableCard
              rounded
              items={providerInfoItems}
              gridAutoColumns="120px 1fr"
            />
          )}
        </Section>

        <Section>
          <H2Title
            title={t`Model`}
            description={
              isCustomProvider
                ? t`Model untuk penyedia ini. Aktifkan atau nonaktifkan sesuai kebutuhan.`
                : t`Model bawaan dari penyedia ini. Aktifkan atau nonaktifkan sesuai kebutuhan.`
            }
          />

          {providerModels.length > 3 && (
            <SearchInput
              placeholder={t`Cari model...`}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          )}

          {filteredModels.length > 0 && (
            <SettingsAiModelsTable
              models={filteredModels}
              isChecked={(model) => model.isAdminEnabled}
              isDisabled={(model) =>
                !model.isAvailable || model.isDeprecated === true
              }
              onToggle={handleModelToggle}
              showProviderColumn={false}
              onToggleAll={async (shouldCheckAll) => {
                const modelIds = filteredModels
                  .filter(
                    (model) =>
                      model.isAvailable &&
                      model.isDeprecated !== true &&
                      model.isAdminEnabled !== shouldCheckAll,
                  )
                  .map((model) => model.modelId);

                if (modelIds.length === 0) return;

                try {
                  await setModelsEnabled({
                    variables: {
                      modelIds,
                      enabled: shouldCheckAll,
                    },
                  });
                } catch {
                  enqueueErrorSnackBar({
                    message: t`Gagal memperbarui ketersediaan model`,
                  });
                } finally {
                  await refetchModels();
                  await refetchClientConfig();
                }
              }}
              anchorPrefix="provider-model-row"
              onRemove={isCustomProvider ? handleModelRemoveClick : undefined}
            />
          )}

          {isCustomProvider && newModelPath && (
            <UndecoratedLink to={newModelPath}>
              <Button
                Icon={IconPlus}
                title={t`Tambah Model`}
                variant="secondary"
              />
            </UndecoratedLink>
          )}
        </Section>

        {isCustomProvider && (
          <Section>
            <H2Title
              title={t`Zona berbahaya`}
              description={t`Hapus penyedia ini dan putuskan semua modelnya`}
            />
            <Button
              Icon={IconTrash}
              title={t`Hapus penyedia`}
              variant="secondary"
              accent="danger"
              onClick={() => openModal(REMOVE_PROVIDER_MODAL_ID)}
            />
          </Section>
        )}
      </SettingsPageContainer>

      <ConfirmationModal
        modalInstanceId={REMOVE_PROVIDER_MODAL_ID}
        title={t`Hapus penyedia "${provider?.label ?? providerName}"`}
        subtitle={t`Ini akan memutus semua model dari penyedia ini. Model tidak akan tersedia sampai penyedia baru dikonfigurasi.`}
        onConfirmClick={handleRemoveProvider}
        confirmButtonText={t`Hapus`}
        confirmButtonAccent="danger"
      />

      <ConfirmationModal
        modalInstanceId={REMOVE_MODEL_MODAL_ID}
        title={t`Hapus model "${modelToRemove?.label ?? ''}"`}
        subtitle={t`Model ini akan dihapus dari penyedia. Anda dapat menambahkannya kembali nanti.`}
        onConfirmClick={handleRemoveModel}
        confirmButtonText={t`Hapus`}
        confirmButtonAccent="danger"
      />
    </SubMenuTopBarContainer>
  );
};
