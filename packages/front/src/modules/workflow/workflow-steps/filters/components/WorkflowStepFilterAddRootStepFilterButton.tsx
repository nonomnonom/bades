import { useAddRootStepFilter } from '@/workflow/workflow-steps/filters/hooks/useAddRootStepFilter';
import { WorkflowStepFilterContext } from '@/workflow/workflow-steps/filters/states/context/WorkflowStepFilterContext';
import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { useContext } from 'react';
import { IconFilter } from 'ui/display';
import { Button } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';

const StyledButtonContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const WorkflowStepFilterAddRootStepFilterButton = () => {
  const { t } = useLingui();
  const { readonly } = useContext(WorkflowStepFilterContext);
  const { addRootStepFilter } = useAddRootStepFilter();

  return (
    <StyledButtonContainer>
      <Button
        Icon={IconFilter}
        size="small"
        variant="secondary"
        accent="default"
        onClick={addRootStepFilter}
        ariaLabel={t`Tambah filter pertama`}
        title={t`Tambah filter pertama`}
        disabled={readonly}
      />
    </StyledButtonContainer>
  );
};
