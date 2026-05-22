import { SettingsLogicFunctionTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionTriggerSection';
import { useLingui } from '@lingui/react/macro';
import { type ToolTriggerSettings } from 'shared/application';
import { DEFAULT_TOOL_INPUT_SCHEMA } from 'shared/logic-function';
import { isDefined } from 'shared/utils';
import { SettingsToolParameterTable } from '~/pages/settings/ai/components/SettingsToolParameterTable';

const DEFAULT_TOOL_TRIGGER_SETTINGS: ToolTriggerSettings = {
  inputSchema: DEFAULT_TOOL_INPUT_SCHEMA,
};

type ToolInputSchema = {
  properties?: Record<string, unknown>;
  required?: string[];
};

type SettingsLogicFunctionToolTriggerSectionProps = {
  value: ToolTriggerSettings | null;
  onChange: (value: ToolTriggerSettings | null) => void;
  readonly: boolean;
};

export const SettingsLogicFunctionToolTriggerSection = ({
  value,
  onChange,
  readonly,
}: SettingsLogicFunctionToolTriggerSectionProps) => {
  const { t } = useLingui();

  const schema = (value?.inputSchema as ToolInputSchema | undefined) ?? {};
  const schemaProperties = isDefined(schema.properties)
    ? (schema.properties as Record<
        string,
        { type?: string; description?: string; format?: string }
      >)
    : {};

  return (
    <SettingsLogicFunctionTriggerSection
      title={t`Alat AI`}
      description={t`Mengekspos fungsi sebagai alat yang dapat dipanggil agen AI`}
      enabled={isDefined(value)}
      onEnabledChange={(checked) =>
        onChange(checked ? DEFAULT_TOOL_TRIGGER_SETTINGS : null)
      }
      readonly={readonly}
    >
      <SettingsToolParameterTable
        schemaProperties={schemaProperties}
        requiredFields={schema.required}
      />
    </SettingsLogicFunctionTriggerSection>
  );
};
