import { SettingsLogicFunctionTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionTriggerSection';
import { type WorkflowActionTriggerSettings } from 'shared/application';
import { isDefined } from 'shared/utils';

const DEFAULT_WORKFLOW_ACTION_TRIGGER_SETTINGS: WorkflowActionTriggerSettings =
  {
    inputSchema: [],
  };

type SettingsLogicFunctionWorkflowActionTriggerSectionProps = {
  value: WorkflowActionTriggerSettings | null;
  onChange: (value: WorkflowActionTriggerSettings | null) => void;
  readonly: boolean;
};

export const SettingsLogicFunctionWorkflowActionTriggerSection = ({
  value,
  onChange,
  readonly,
}: SettingsLogicFunctionWorkflowActionTriggerSectionProps) => {
  return (
    <SettingsLogicFunctionTriggerSection
      title={`Tindakan alur kerja`}
      description={`Mengekspos fungsi sebagai langkah dalam pembuat alur kerja`}
      enabled={isDefined(value)}
      onEnabledChange={(checked) =>
        onChange(checked ? DEFAULT_WORKFLOW_ACTION_TRIGGER_SETTINGS : null)
      }
      readonly={readonly}
    />
  );
};
