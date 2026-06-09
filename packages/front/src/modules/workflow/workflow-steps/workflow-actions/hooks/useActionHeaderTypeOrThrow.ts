import { type WorkflowActionType } from '@/workflow/types/Workflow';
import { getActionHeaderTypeOrThrow } from '@/workflow/workflow-steps/workflow-actions/utils/getActionHeaderTypeOrThrow';
import { useLingui } from '~/utils/i18n/badesI18n';

export const useActionHeaderTypeOrThrow = (actionType: WorkflowActionType) => {
  const { i18n } = useLingui();

  return i18n._(getActionHeaderTypeOrThrow(actionType));
};
