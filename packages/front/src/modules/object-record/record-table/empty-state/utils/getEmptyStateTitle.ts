import { CoreObjectNameSingular } from 'shared/types';
import { t } from '@lingui/core/macro';

export const getEmptyStateTitle = (
  objectNameSingular: string,
  objectLabel: string,
) => {
  if (objectNameSingular === CoreObjectNameSingular.WorkflowVersion) {
    return ""No workflow versions yet";
  }

  if (objectNameSingular === CoreObjectNameSingular.WorkflowRun) {
    return ""No workflow runs yet";
  }

  return t`Add your first ${objectLabel}`;
};
