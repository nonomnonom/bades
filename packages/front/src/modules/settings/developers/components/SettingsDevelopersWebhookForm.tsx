import { Controller, FormProvider } from 'react-hook-form';

import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsSkeletonLoader } from '@/settings/components/SettingsSkeletonLoader';
import { type WebhookFormMode } from '@/settings/developers/constants/WebhookFormMode';
import { useWebhookForm } from '@/settings/developers/hooks/useWebhookForm';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { TextArea } from '@/ui/input/components/TextArea';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPath } from 'shared/types';
import {
  getSettingsPath,
  getUrlHostnameOrThrow,
  isDefined,
  isValidUrl,
} from 'shared/utils';
import { H2Title, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { SettingsDatabaseEventsForm } from '@/settings/components/SettingsDatabaseEventsForm';

const DELETE_WEBHOOK_MODAL_ID = 'delete-webhook-modal';

type SettingsDevelopersWebhookFormProps = {
  webhookId?: string;
  mode: WebhookFormMode;
};

export const SettingsDevelopersWebhookForm = ({
  webhookId,
  mode,
}: SettingsDevelopersWebhookFormProps) => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();
  const { openModal } = useModal();
  const {
    formConfig,
    loading,
    canSave,
    handleSave,
    updateOperation,
    removeOperation,
    handleDelete,
    isCreationMode,
    error,
  } = useWebhookForm({ webhookId, mode });

  const getTitle = () => {
    if (isCreationMode) {
      return t`Webhook Baru`;
    }

    const targetUrl = formConfig.watch('targetUrl');
    if (isDefined(targetUrl) && isValidUrl(targetUrl.trim())) {
      return getUrlHostnameOrThrow(targetUrl);
    }
  };

  if ((loading && !isCreationMode) || isDefined(error)) {
    return <SettingsSkeletonLoader />;
  }

  const descriptionTextAreaId = `${webhookId}-description`;
  const targetUrlTextInputId = `${webhookId}-target-url`;
  const secretTextInputId = `${webhookId}-secret`;

  return (
    // oxlint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formConfig}>
      <SubMenuTopBarContainer
        title={getTitle()}
        reserveTitleSpace
        links={[
          {
            children: t`Ruang Kerja`,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: t`API & Webhook`,
            href: getSettingsPath(SettingsPath.ApiWebhooks),
          },
          { children: isCreationMode ? t`Baru` : getTitle() },
        ]}
        actionButton={
          <SaveAndCancelButtons
            isSaveDisabled={!canSave}
            isCancelDisabled={formConfig.formState.isSubmitting}
            onCancel={() => navigate(SettingsPath.ApiWebhooks)}
            onSave={formConfig.handleSubmit(handleSave)}
          />
        }
      >
        <SettingsPageContainer>
          <Section>
            <H2Title
              title={t`URL Endpoint`}
              description={t`Kami akan mengirim permintaan POST ke endpoint ini untuk setiap event baru dalam format application/json`}
            />
            <Controller
              name="targetUrl"
              control={formConfig.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => {
                return (
                  <SettingsTextInput
                    instanceId={targetUrlTextInputId}
                    placeholder={t`https://example.com/webhook`}
                    value={value}
                    onChange={onChange}
                    error={error?.message}
                    fullWidth
                    autoFocus={isCreationMode}
                  />
                );
              }}
            />
          </Section>
          <Section>
            <H2Title
              title={t`Deskripsi`}
              description={t`Kami akan mengirim permintaan POST ke endpoint ini untuk setiap event baru dalam format application/json.`}
            />
            <Controller
              name="description"
              control={formConfig.control}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  textAreaId={descriptionTextAreaId}
                  placeholder={t`Tulis deskripsi`}
                  minRows={4}
                  value={value || ''}
                  onChange={onChange}
                />
              )}
            />
          </Section>
          <Section>
            <H2Title
              title={t`Filter`}
              description={t`Pilih event yang ingin dikirim ke endpoint ini`}
            />
            <Controller
              name="operations"
              control={formConfig.control}
              render={({ field: { value } }) => (
                <SettingsDatabaseEventsForm
                  events={value}
                  updateOperation={updateOperation}
                  removeOperation={removeOperation}
                />
              )}
            />
          </Section>
          <Section>
            <H2Title
              title={t`Rahasia`}
              description={t`Secret opsional untuk menghitung tanda tangan HMAC pada payload webhook`}
            />
            <Controller
              name="secret"
              control={formConfig.control}
              render={({ field: { onChange, value } }) => (
                <SettingsTextInput
                  instanceId={secretTextInputId}
                  placeholder={t`Rahasia (opsional)`}
                  value={value || ''}
                  onChange={onChange}
                  fullWidth
                />
              )}
            />
          </Section>
          {!isCreationMode && (
            <Section>
              <H2Title
                title={t`Zona bahaya`}
                description={t`Hapus webhook ini`}
              />
              <Button
                accent="danger"
                variant="secondary"
                title={t`Hapus`}
                Icon={IconTrash}
                onClick={() => openModal(DELETE_WEBHOOK_MODAL_ID)}
              />
            </Section>
          )}
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
      {!isCreationMode && (
        <ConfirmationModal
          confirmationPlaceholder={t`yes`}
          confirmationValue={t`yes`}
          modalInstanceId={DELETE_WEBHOOK_MODAL_ID}
          title={t`Hapus webhook`}
          subtitle={
            <Trans>
              Ketik "yes" untuk mengonfirmasi penghapusan webhook ini.
            </Trans>
          }
          onConfirmClick={handleDelete}
          confirmButtonText={t`Hapus`}
        />
      )}
    </FormProvider>
  );
};
