import { msg } from 'src/utils/bades-i18n';
import {
  WorkflowQueryValidationException,
  WorkflowQueryValidationExceptionCode,
} from 'src/modules/workflow/common/exceptions/workflow-query-validation.exception';
import { type WorkflowStatus } from 'src/modules/workflow/common/standard-objects/workflow.workspace-entity';

export const assertWorkflowStatusesNotSet = (
  statuses?: WorkflowStatus[] | null,
) => {
  if (statuses) {
    throw new WorkflowQueryValidationException(
      'Statuses cannot be set manually.',
      WorkflowQueryValidationExceptionCode.FORBIDDEN,
      {
        userFriendlyMessage: msg`Statuses cannot be set manually.`,
      },
    );
  }
};
