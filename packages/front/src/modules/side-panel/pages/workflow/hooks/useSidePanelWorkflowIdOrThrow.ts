import { sidePanelWorkflowIdComponentState } from '@/side-panel/pages/workflow/states/sidePanelWorkflowIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { isDefined } from 'shared/utils';

export const useSidePanelWorkflowIdOrThrow = () => {
  const sidePanelWorkflowId = useAtomComponentStateValue(
    sidePanelWorkflowIdComponentState,
  );
  if (!isDefined(sidePanelWorkflowId)) {
    throw new Error('sidePanelWorkflowIdComponentState seharusnya sudah ditentukan');
  }

  return sidePanelWorkflowId;
};
