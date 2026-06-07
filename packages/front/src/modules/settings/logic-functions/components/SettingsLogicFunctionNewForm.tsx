import { type LogicFunctionFormValues } from '@/logic-functions/hooks/useLogicFunctionUpdateFormState';
import { SettingsOptionCardContentCounter } from '@/settings/components/SettingsOptions/SettingsOptionCardContentCounter';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { TextArea } from '@/ui/input/components/TextArea';
import { styled } from '@linaria/react';
import { H2Title, IconClockHour8 } from 'ui/display';
import { Card, Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

const StyledInputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

export const SettingsLogicFunctionNewForm = ({
  formValues,
  onChange,
  readonly = false,
}: {
  formValues: LogicFunctionFormValues;
  onChange: <TKey extends keyof LogicFunctionFormValues>(
    key: TKey,
  ) => (value: LogicFunctionFormValues[TKey]) => void;
  readonly?: boolean;
}) => {
  const descriptionTextAreaId = `${formValues.name}-description`;
  const nameTextInputId = `${formValues.name}-name`;

  return (
    <Section>
      <H2Title
        title={`Tentang`}
        description={`Beri nama dan deskripsi untuk fungsi ini`}
      />
      <StyledInputsContainer>
        <SettingsTextInput
          instanceId={nameTextInputId}
          placeholder={`Nama`}
          fullWidth
          autoFocusOnMount
          value={formValues.name}
          onChange={onChange('name')}
          readOnly={readonly}
        />
        <TextArea
          textAreaId={descriptionTextAreaId}
          placeholder={`Deskripsi`}
          minRows={4}
          value={formValues.description}
          onChange={onChange('description')}
          readOnly={readonly}
        />
        <Card rounded>
          <SettingsOptionCardContentCounter
            Icon={IconClockHour8}
            title={`Batas waktu`}
            description={`Waktu eksekusi maksimum dalam detik (1-900)`}
            value={formValues.timeoutSeconds}
            onChange={onChange('timeoutSeconds')}
            minValue={1}
            maxValue={900}
            disabled={readonly}
          />
        </Card>
      </StyledInputsContainer>
    </Section>
  );
};
