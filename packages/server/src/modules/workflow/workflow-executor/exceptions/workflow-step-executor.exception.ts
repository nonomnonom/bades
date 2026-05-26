import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { STANDARD_ERROR_MESSAGE } from 'src/engine/api/common/common-query-runners/errors/standard-error-message.constant';
import { CustomException } from 'src/utils/custom-exception';

export enum WorkflowStepExecutorExceptionCode {
  SCOPED_WORKSPACE_NOT_FOUND = 'SCOPED_WORKSPACE_NOT_FOUND',
  INVALID_STEP_TYPE = 'INVALID_STEP_TYPE',
  INVALID_STEP_INPUT = 'INVALID_STEP_INPUT',
  STEP_NOT_FOUND = 'STEP_NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

const getWorkflowStepExecutorExceptionUserFriendlyMessage = (
  code: WorkflowStepExecutorExceptionCode,
) => {
  switch (code) {
    case WorkflowStepExecutorExceptionCode.SCOPED_WORKSPACE_NOT_FOUND:
      return msg`Workspace tidak ditemukan.`;
    case WorkflowStepExecutorExceptionCode.INVALID_STEP_TYPE:
      return msg`Tipe langkah alur kerja tidak valid.`;
    case WorkflowStepExecutorExceptionCode.STEP_NOT_FOUND:
      return msg`Langkah alur kerja tidak ditemukan.`;
    case WorkflowStepExecutorExceptionCode.INVALID_STEP_INPUT:
      return msg`Input langkah alur kerja tidak valid.`;
    case WorkflowStepExecutorExceptionCode.INTERNAL_ERROR:
      return STANDARD_ERROR_MESSAGE;
    default:
      assertUnreachable(code);
  }
};

export class WorkflowStepExecutorException extends CustomException<WorkflowStepExecutorExceptionCode> {
  constructor(
    message: string,
    code: WorkflowStepExecutorExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getWorkflowStepExecutorExceptionUserFriendlyMessage(code),
    });
  }
}
