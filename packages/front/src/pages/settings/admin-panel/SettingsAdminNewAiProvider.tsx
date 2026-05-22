import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { useMemo, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client/react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { type AiSdkPackage, isDataResidency } from 'shared/ai';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconPlus, Info } from 'ui/display';
import { Section } from 'ui/layout';

import { AI_ADMIN_PATH } from '@/settings/admin-panel/ai/constants/AiAdminPath';
import { DATA_RESIDENCY_OPTIONS } from '@/settings/admin-panel/ai/constants/DataResidencyOptions';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { ADD_AI_PROVIDER } from '@/settings/admin-panel/ai/graphql/mutations/addAiProvider';
import { GET_ADMIN_AI_MODELS } from '@/settings/admin-panel/ai/graphql/queries/getAdminAiModels';
import { GET_AI_PROVIDERS } from '@/settings/admin-panel/ai/graphql/queries/getAiProviders';
import { GET_MODELS_DEV_PROVIDERS } from '@/settings/admin-panel/ai/graphql/queries/getModelsDevProviders';
import { type RawAiProviderConfig } from '@/settings/admin-panel/ai/types/RawAiProviderConfig';
import { slugify } from 'transliteration';
import { getProviderIcon } from '@/settings/admin-panel/ai/utils/getProviderIcon';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Select } from '@/ui/input/components/Select';
import { TextInput } from '@/ui/input/components/TextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';

type ModelsDevProvider = { id: string; modelCount: number; npm: AiSdkPackage };

type FormValues = {
  npm: AiSdkPackage;
  label: string;
  apiKey: string;
  baseUrl: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  dataResidency: string;
};

export const SettingsAdminNewAiProvider = () => {
  const apolloAdminClient = useApolloAdminClient();
  const navigate = useNavigate();
  const { t } = useLingui();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModelsDevId, setSelectedModelsDevId] = useState<string | null>(
    null,
  );
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [addAiProvider] = useMutation(ADD_AI_PROVIDER, {
    client: apolloAdminClient,
  });

  const { data: modelsDevData } = useQuery<{
    getModelsDevProviders: ModelsDevProvider[];
  }>(GET_MODELS_DEV_PROVIDERS, { client: apolloAdminClient });

  const modelsDevProviders = useMemo(
    () => modelsDevData?.getModelsDevProviders ?? [],
    [modelsDevData?.getModelsDevProviders],
  );

  const modelsDevByIdMap = useMemo(
    () =>
      new Map(modelsDevProviders.map((provider) => [provider.id, provider])),
    [modelsDevProviders],
  );

  const providerOptions = useMemo(
    () =>
      modelsDevProviders.map((provider) => ({
        value: provider.id,
        label: `${provider.id.charAt(0).toUpperCase() + provider.id.slice(1)} (${provider.modelCount} models)`,
        Icon: getProviderIcon(provider.id),
      })),
    [modelsDevProviders],
  );

  const form = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      npm: '@ai-sdk/openai-compatible',
      label: '',
      apiKey: '',
      baseUrl: '',
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
      dataResidency: '',
    },
  });

  const hasSelected = selectedModelsDevId !== null || isCustomMode;
  const npmPackage = form.watch('npm');
  const isBedrock = npmPackage === '@ai-sdk/amazon-bedrock';
  const isOpenAiCompatible = npmPackage === '@ai-sdk/openai-compatible';
  const needsApiKey = !isBedrock;
  const isModelsDevWithoutNativeSdk =
    selectedModelsDevId !== null && isOpenAiCompatible;

  const handleProviderSelected = (providerId: string) => {
    setSelectedModelsDevId(providerId);
    setIsCustomMode(false);

    const suggestion = modelsDevByIdMap.get(providerId);

    form.setValue('npm', suggestion?.npm ?? '@ai-sdk/openai-compatible');

    form.setValue(
      'label',
      providerId.charAt(0).toUpperCase() + providerId.slice(1),
    );
  };

  const handleCustomMode = () => {
    setSelectedModelsDevId(null);
    setIsCustomMode(true);
    form.setValue('npm', '@ai-sdk/openai-compatible');
    form.setValue('label', '');
  };

  const handleSave = async () => {
    const values = form.getValues();

    if (!values.label.trim()) {
      form.setError('label', {
        type: 'manual',
        message: t`Label wajib diisi`,
      });

      return;
    }

    const providerName = slugify(values.label, { separator: '-' });

    if (!providerName) {
      form.setError('label', {
        type: 'manual',
        message: t`Label harus mengandung setidaknya satu karakter alfanumerik`,
      });

      return;
    }

    const config: Partial<RawAiProviderConfig> = {
      npm: values.npm,
      label: values.label.trim(),
      ...(selectedModelsDevId && { name: selectedModelsDevId }),
      ...(needsApiKey &&
        values.apiKey.trim() && {
          apiKey: values.apiKey.trim(),
        }),
      ...(isOpenAiCompatible &&
        values.baseUrl.trim() && {
          baseUrl: values.baseUrl.trim(),
        }),
      ...(isDataResidency(values.dataResidency) && {
        dataResidency: values.dataResidency,
      }),
    };

    if (isBedrock) {
      if (!values.region.trim()) {
        form.setError('region', {
          type: 'manual',
          message: t`Wilayah wajib diisi untuk Bedrock`,
        });

        return;
      }
      config.region = values.region.trim();

      if (values.accessKeyId.trim()) {
        config.accessKeyId = values.accessKeyId.trim();
      }
      if (values.secretAccessKey.trim()) {
        config.secretAccessKey = values.secretAccessKey.trim();
      }
    }

    if (!isBedrock && !isOpenAiCompatible && !values.apiKey.trim()) {
      form.setError('apiKey', {
        type: 'manual',
        message: t`Kunci API wajib diisi`,
      });

      return;
    }

    if (isOpenAiCompatible && !values.baseUrl.trim()) {
      form.setError('baseUrl', {
        type: 'manual',
        message: t`URL Dasar wajib diisi`,
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await addAiProvider({
        variables: {
          providerName,
          providerConfig: config,
        },
        refetchQueries: [
          { query: GET_AI_PROVIDERS },
          { query: GET_ADMIN_AI_MODELS },
        ],
      });

      enqueueSuccessSnackBar({
        message: t`Penyedia "${values.label.trim()}" ditambahkan`,
      });
      navigate(AI_ADMIN_PATH);
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal menambahkan penyedia`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSave)}>
      <SubMenuTopBarContainer
        title={t`Penyedia AI Baru`}
        links={[
          {
            children: <Trans>Panel Admin</Trans>,
            href: getSettingsPath(SettingsPath.AdminPanel),
          },
          { children: <Trans>Penyedia AI Baru</Trans> },
        ]}
        actionButton={
          <SaveAndCancelButtons
            onCancel={() => navigate(AI_ADMIN_PATH)}
            isSaveDisabled={isSubmitting || !hasSelected}
            onSave={handleSave}
          />
        }
      >
        <SettingsPageContainer>
          <Section>
            <H2Title
              title={t`Penyedia`}
              description={t`Pilih penyedia yang dikenal atau buat yang kustom`}
            />
            <Select
              dropdownId="ai-provider-models-dev-select"
              value={selectedModelsDevId ?? undefined}
              onChange={handleProviderSelected}
              options={providerOptions}
              withSearchInput
              fullWidth
              callToActionButton={{
                text: t`Penyedia kustom`,
                onClick: handleCustomMode,
                Icon: IconPlus,
              }}
            />
          </Section>

          {isModelsDevWithoutNativeSdk && (
            <Info
              accent="blue"
              text={t`Penyedia ini belum memiliki SDK native — akan menggunakan mode kompatibel OpenAI. Butuh dukungan native? Hubungi kami.`}
            />
          )}

          {hasSelected && (
            <>
              <Section>
                <H2Title
                  title={t`Label`}
                  description={t`Nama tampilan untuk penyedia ini`}
                />
                <Controller
                  name="label"
                  control={form.control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      value={value}
                      onChange={onChange}
                      placeholder={
                        isCustomMode
                          ? t`cth. Proxy OpenAI Saya`
                          : t`cth. OpenAI EU`
                      }
                      fullWidth
                      error={error?.message}
                    />
                  )}
                />
              </Section>

              {needsApiKey && (
                <Section>
                  <H2Title
                    title={t`Kunci API`}
                    description={t`Kunci API penyedia Anda untuk autentikasi`}
                  />
                  <Controller
                    name="apiKey"
                    control={form.control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        value={value}
                        onChange={onChange}
                        placeholder={t`sk-...`}
                        fullWidth
                        type="password"
                        error={error?.message}
                      />
                    )}
                  />
                </Section>
              )}

              {isOpenAiCompatible && (
                <Section>
                  <H2Title
                    title={t`URL Dasar`}
                    description={t`Endpoint API untuk penyedia kompatibel OpenAI Anda`}
                  />
                  <Controller
                    name="baseUrl"
                    control={form.control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        value={value}
                        onChange={onChange}
                        placeholder={t`https://api.example.com/v1`}
                        fullWidth
                        error={error?.message}
                      />
                    )}
                  />
                </Section>
              )}

              <Section>
                <H2Title
                  title={t`Residensi Data`}
                  description={t`Wilayah tempat data inferensi diproses (opsional)`}
                />
                <Controller
                  name="dataResidency"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      dropdownId="ai-provider-data-residency-select"
                      value={value}
                      onChange={onChange}
                      options={[
                        { value: '', label: t`Tidak ada` },
                        ...DATA_RESIDENCY_OPTIONS,
                      ]}
                      fullWidth
                    />
                  )}
                />
              </Section>

              {isBedrock && (
                <>
                  <Section>
                    <H2Title
                      title={t`Wilayah`}
                      description={t`Wilayah AWS untuk Bedrock`}
                    />
                    <Controller
                      name="region"
                      control={form.control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextInput
                          value={value}
                          onChange={onChange}
                          placeholder={t`us-east-1`}
                          fullWidth
                          error={error?.message}
                        />
                      )}
                    />
                  </Section>

                  <Section>
                    <H2Title
                      title={t`ID Kunci Akses`}
                      description={t`Opsional — menggunakan peran IAM jika kosong`}
                    />
                    <Controller
                      name="accessKeyId"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChange={onChange}
                          placeholder={t`AKIA...`}
                          fullWidth
                        />
                      )}
                    />
                  </Section>

                  <Section>
                    <H2Title
                      title={t`Kunci Akses Rahasia`}
                      description={t`Opsional — menggunakan peran IAM jika kosong`}
                    />
                    <Controller
                      name="secretAccessKey"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChange={onChange}
                          fullWidth
                          type="password"
                        />
                      )}
                    />
                  </Section>
                </>
              )}
            </>
          )}
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    </form>
  );
};
