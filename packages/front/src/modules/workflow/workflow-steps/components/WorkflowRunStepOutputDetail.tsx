import { useWorkflowRun } from '@/workflow/hooks/useWorkflowRun';
import { useWorkflowRunIdOrThrow } from '@/workflow/hooks/useWorkflowRunIdOrThrow';
import { getStepDefinitionOrThrow } from '@/workflow/utils/getStepDefinitionOrThrow';
import { WorkflowRunStepJsonContainer } from '@/workflow/workflow-steps/components/WorkflowRunStepJsonContainer';
import { useWorkflowRunStepInfo } from '@/workflow/workflow-steps/hooks/useWorkflowRunStepInfo';
import { getWorkflowRunStepInfoToDisplayAsOutput } from '@/workflow/workflow-steps/utils/getWorkflowRunStepInfoToDisplayAsOutput';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'shared/utils';
import {
  type GetJsonNodeHighlighting,
  isTwoFirstDepths,
  JsonTree,
} from 'ui/json-visualizer';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export const WorkflowRunStepOutputDetail = ({ stepId }: { stepId: string }) => {
  const { t } = useLingui();
  const { copyToClipboard } = useCopyToClipboard();

  const workflowRunId = useWorkflowRunIdOrThrow();
  const workflowRun = useWorkflowRun({ workflowRunId });

  const stepInfo = useWorkflowRunStepInfo({ stepId });

  if (!isDefined(workflowRun?.state) || !isDefined(stepInfo)) {
    return null;
  }

  const stepInfoToDisplay = getWorkflowRunStepInfoToDisplayAsOutput({
    stepInfo,
  });

  const stepDefinition = getStepDefinitionOrThrow({
    stepId,
    trigger: workflowRun.state.flow.trigger,
    steps: workflowRun.state.flow.steps,
  });
  if (!isDefined(stepDefinition?.definition)) {
    throw new Error('The step is expected to be properly shaped.');
  }

  const setRedHighlightingForEveryNode: GetJsonNodeHighlighting = (keyPath) => {
    if (keyPath.startsWith('error')) {
      return 'red';
    }

    return undefined;
  };

  return (
    <>
      <WorkflowRunStepJsonContainer>
        <JsonTree
          value={stepInfoToDisplay ?? t`Tidak ada keluaran`}
          shouldExpandNodeInitially={isTwoFirstDepths}
          emptyArrayLabel={t`Array Kosong`}
          emptyObjectLabel={t`Objek Kosong`}
          emptyStringLabel={t`[teks kosong]`}
          arrowButtonCollapsedLabel={t`Tampilkan`}
          arrowButtonExpandedLabel={t`Ciutkan`}
          getNodeHighlighting={
            isDefined(stepInfo?.error)
              ? setRedHighlightingForEveryNode
              : undefined
          }
          onNodeValueClick={copyToClipboard}
        />
      </WorkflowRunStepJsonContainer>
    </>
  );
};
