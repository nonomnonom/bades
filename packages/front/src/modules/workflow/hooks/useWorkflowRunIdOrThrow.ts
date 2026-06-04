import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { workflowVisualizerWorkflowRunIdComponentState } from '@/workflow/states/workflowVisualizerWorkflowRunIdComponentState';
import { isDefined } from 'shared/utils';

export const useWorkflowRunIdOrThrow = () => {
  const workflowVisualizerWorkflowRunId = useAtomComponentStateValue(
    workflowVisualizerWorkflowRunIdComponentState,
  );

  if (!isDefined(workflowVisualizerWorkflowRunId)) {
    throw new Error('ID eksekusi alur kerja seharusnya sudah ditentukan');
  }

  return workflowVisualizerWorkflowRunId;
};
