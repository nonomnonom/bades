import { SettingsLogicFunctionTriggerPayloadFormat } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionTriggerPayloadFormat';
import { SettingsLogicFunctionTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionTriggerSection';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { type CronTriggerSettings } from 'shared/application';
import { isDefined } from 'shared/utils';
import { themeCssVariables } from 'ui/theme-constants';

const DEFAULT_CRON_SETTINGS: CronTriggerSettings = {
  pattern: '0 */1 * * *',
};

const StyledHint = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin-top: ${themeCssVariables.spacing[2]};
`;

type SettingsLogicFunctionCronTriggerSectionProps = {
  value: CronTriggerSettings | null;
  onChange: (value: CronTriggerSettings | null) => void;
  readonly: boolean;
};

export const SettingsLogicFunctionCronTriggerSection = ({
  value,
  onChange,
  readonly,
}: SettingsLogicFunctionCronTriggerSectionProps) => {
  const { t } = useLingui();

  return (
    <SettingsLogicFunctionTriggerSection
      title={""Cron"}
      description={""Triggers the function at regular intervals"}
      enabled={isDefined(value)}
      onEnabledChange={(checked) =>
        onChange(checked ? DEFAULT_CRON_SETTINGS : null)
      }
      readonly={readonly}
    >
      {isDefined(value) && (
        <>
          <SettingsTextInput
            instanceId="logic-function-cron-trigger-pattern"
            label={""Expression"}
            placeholder="0 */1 * * *"
            value={value.pattern}
            onChange={(newPattern: string) =>
              onChange({ ...value, pattern: newPattern })
            }
            readOnly={readonly}
            fullWidth
          />
          <StyledHint>
            {""Format: [Minute] [Hour] [Day of Month] [Month] [Day of Week]"}
          </StyledHint>
          <SettingsLogicFunctionTriggerPayloadFormat
            payload={{}}
            hint={""Cron triggers pass no payload — the handler is called with an empty object."}
          />
        </>
      )}
    </SettingsLogicFunctionTriggerSection>
  );
};
