import { t } from '~/utils/i18n/badesI18n';

import { type WorkflowTrigger } from '@/workflow/types/Workflow';
import { splitWorkflowTriggerEventName } from '@/workflow/utils/splitWorkflowTriggerEventName';
import { DATABASE_TRIGGER_TYPES } from '@/workflow/workflow-trigger/constants/DatabaseTriggerTypes';
import { OTHER_TRIGGER_TYPES } from '@/workflow/workflow-trigger/constants/OtherTriggerTypes';
import { isDefined } from 'shared/utils';

export const getTriggerDefaultLabel = (trigger: WorkflowTrigger): string => {
  if (trigger.type === 'DATABASE_EVENT') {
    const triggerEvent = splitWorkflowTriggerEventName(
      trigger.settings.eventName,
    );

    const label = DATABASE_TRIGGER_TYPES.find(
      (type) => type.event === triggerEvent.event,
    )?.defaultLabel;

    if (!isDefined(label)) {
      throw new Error(t`Peristiwa pemicu tidak dikenal`);
    }

    return label;
  }

  const label = OTHER_TRIGGER_TYPES.find(
    (item) => item.type === trigger.type,
  )?.defaultLabel;

  if (!isDefined(label)) {
    throw new Error(t`Tipe pemicu tidak dikenal`);
  }

  return label;
};
