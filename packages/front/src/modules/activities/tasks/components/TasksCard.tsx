import { styled } from '@linaria/react';

import { TaskGroups } from '@/activities/tasks/components/TaskGroups';
import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';

const StyledContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

const TASK_FILTER_CONTEXT_VALUE = {
  instanceId: 'entity-tasks-filter-instance',
} as const;

export const TasksCard = () => {
  const targetRecord = useTargetRecord();

  return (
    <StyledContainer>
      <ObjectFilterDropdownComponentInstanceContext.Provider
        value={TASK_FILTER_CONTEXT_VALUE}
      >
        <TaskGroups targetableObject={targetRecord} />
      </ObjectFilterDropdownComponentInstanceContext.Provider>
    </StyledContainer>
  );
};
