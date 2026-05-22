import { useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';

import { IconPicker } from '@/ui/input/components/IconPicker';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { TextArea } from '@/ui/input/components/TextArea';
import { isDefined } from 'shared/utils';
import { themeCssVariables } from 'ui/theme-constants';
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

type SettingsAiAgentFormProps = {
  formValues: SettingsAiAgentFormValues;
  onFieldChange: (
    field: keyof SettingsAiAgentFormValues,
    value: SettingsAiAgentFormValues[keyof SettingsAiAgentFormValues],
  ) => void;
  disabled: boolean;
};

export const SettingsAiAgentForm = ({
  formValues,
  onFieldChange,
  disabled,
}: SettingsAiAgentFormProps) => {
  const { t } = useLingui();

  const fillNameFromLabel = (label: string) => {
    isDefined(label) &&
      onFieldChange('name', computeMetadataNameFromLabel(label));
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
    </StyledFormContainer>
  );
};
