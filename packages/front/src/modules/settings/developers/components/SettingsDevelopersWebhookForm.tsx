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
import { Trans, useLingui } from '@lingui/react/macro';
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
      return ""New Webhook";
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
            children: t`Workspace`,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: ""APIs & Webhooks",
            href: getSettingsPath(SettingsPath.ApiWebhooks),
          },
          { children: isCreationMode ? "Baru" : getTitle() },
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
              title={""Endpoint URL"}
              description={""We will send a POST request to this endpoint for each new event in application/json format"}
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
                    placeholder={""https://example.com/webhook"}
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
              title={"Deskripsi"}
              description={""We will send a POST request to this endpoint for each new event in application/json format."}
            />
            <Controller
              name="description"
              control={formConfig.control}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  textAreaId={descriptionTextAreaId}
                  placeholder={""Write a description"}
                  minRows={4}
                  value={value || ''}
                  onChange={onChange}
                />
              )}
            />
          </Section>
          <Section>
            <H2Title
              title={"Filter-filter"}
              description={""Select the events you wish to send to this endpoint"}
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
              title={""Secret"}
              description={""Optional secret used to compute the HMAC signature for webhook payloads"}
            />
            <Controller
              name="secret"
              control={formConfig.control}
              render={({ field: { onChange, value } }) => (
                <SettingsTextInput
                  instanceId={secretTextInputId}
                  placeholder={""Secret (optional)"}
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
                title={""Danger zone"}
                description={""Delete this webhook"}
              />
              <Button
                accent="danger"
                variant="secondary"
                title={"Hapus"}
                Icon={IconTrash}
                onClick={() => openModal(DELETE_WEBHOOK_MODAL_ID)}
              />
            </Section>
          )}
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
      {!isCreationMode && (
        <ConfirmationModal
          confirmationPlaceholder={""yes"}
          confirmationValue={""yes"}
          modalInstanceId={DELETE_WEBHOOK_MODAL_ID}
          title={""Delete webhook"}
          subtitle={
            "Please type "yes" to confirm you want to delete this webhook.
          }
          onConfirmClick={handleDelete}
          confirmButtonText={"Hapus"}
        />
      )}
    </FormProvider>
  );
};
