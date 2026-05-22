import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';

import { IconPicker } from '@/ui/input/components/IconPicker';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { TextArea } from '@/ui/input/components/TextArea';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { isDefined } from 'shared/utils';
import { H2Title, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { type Agent } from '~/generated-metadata/graphql';
import { SettingsAgentDeleteConfirmationModal } from '~/pages/settings/ai/components/SettingsAgentDeleteConfirmationModal';
import { SettingsAgentResponseFormat } from '~/pages/settings/ai/components/SettingsAgentResponseFormat';
import { computeMetadataNameFromLabel } from '~/pages/settings/data-model/utils/computeMetadataNameFromLabel';
import { type SettingsAiAgentFormValues } from '~/pages/settings/ai/hooks/useSettingsAgentFormState';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledIconNameRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledNameContainer = styled.div`
  flex: 1;
`;

const DELETE_AGENT_MODAL_ID = 'delete-agent-modal';

type SettingsAgentSettingsTabProps = {
  formValues: SettingsAiAgentFormValues;
  onFieldChange: (
    field: keyof SettingsAiAgentFormValues,
    value: SettingsAiAgentFormValues[keyof SettingsAiAgentFormValues],
  ) => void;
  disabled: boolean;
  agent?: Agent;
};

export const SettingsAgentSettingsTab = ({
  formValues,
  onFieldChange,
  disabled,
  agent,
}: SettingsAgentSettingsTabProps) => {
  const { t } = useLingui();
  const { openModal } = useModal();

  const fillNameFromLabel = (label: string) => {
    if (isDefined(label)) {
      onFieldChange('name', computeMetadataNameFromLabel(label));
    }
  };

  return (
    <StyledFormContainer>
      <StyledFormContainer>
        <StyledIconNameRow>
          <IconPicker
            selectedIconKey={formValues.icon || 'IconRobot'}
            onChange={({ iconKey }) => {
              onFieldChange('icon', iconKey);
            }}
            disabled={disabled}
          />

          <StyledNameContainer>
            <SettingsTextInput
              instanceId="agent-label-input"
              placeholder={t`Masukkan nama agen*`}
              value={formValues.label}
              onChange={(value) => {
                onFieldChange('label', value);
                fillNameFromLabel(value);
              }}
              fullWidth
              disabled={disabled}
            />
          </StyledNameContainer>
        </StyledIconNameRow>
      </StyledFormContainer>
      <StyledFormContainer>
        <TextArea
          textAreaId="agent-description-textarea"
          placeholder={t`Tulis deskripsi untuk agen ini`}
          minRows={3}
          value={formValues.description || ''}
          onChange={(value) => onFieldChange('description', value)}
          disabled={disabled}
        />
      </StyledFormContainer>
      <StyledFormContainer>
        <TextArea
          textAreaId="agent-prompt-textarea"
          label={t`Prompt Sistem`}
          placeholder={t`Masukkan prompt sistem yang mendefinisikan perilaku dan kemampuan agen ini`}
          minRows={6}
          maxRows={15}
          value={formValues.prompt}
          onChange={(value) => onFieldChange('prompt', value)}
          disabled={disabled}
        />
      </StyledFormContainer>
      <StyledFormContainer>
        <SettingsAgentResponseFormat
          responseFormat={formValues.responseFormat}
          onResponseFormatChange={(format) =>
            onFieldChange('responseFormat', format)
          }
          disabled={disabled}
        />
      </StyledFormContainer>
      {!disabled && agent && formValues.isCustom && (
        <Section>
          <H2Title title={t`Zona berbahaya`} description={t`Hapus agen ini`} />
          <Button
            accent="danger"
            variant="secondary"
            title={t`Hapus Agen`}
            Icon={IconTrash}
            onClick={() => openModal(DELETE_AGENT_MODAL_ID)}
          />
        </Section>
      )}
      {!disabled && agent && (
        <SettingsAgentDeleteConfirmationModal
          agentId={agent.id}
          agentName={agent.label}
        />
      )}
    </StyledFormContainer>
  );
};
